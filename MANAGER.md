# HUMON MANAGER — Game Plan

A football-manager style idle game for the Pokémon tournament site. The player manages a squad of HUMONs (trainers-turned-pokémon) who each go out and collect their own pokémon.

## Game concept

- **Your squad is HUMONs.** You start with the one caught on the home page (existing `pkm:humon-caught` gate — no HUMON, no game). Humons auto-manage their own pokémon; you only give instructions.
- **Each humon collects its own team** by travelling to hometowns on the map (800). Each hometown's catch pool = that trainer's team (current, mid-season swaps applied via `applySwaps`).
- **Gym bosses** = the 10 tournament trainers. Beat one (real Showdown sim via `@pkmn/sim`) → badge + that trainer joins your roster as a humon (reusing `spriteFor()`).
- **Hidden humons** = secret pages: Joak (123, needs a purchased **JOAK BALL**), Devilmon (new page 666, needs currency), Copmon (page 999, needs currency).
- **Days + stamina**: the game counts days since you started (`state.day`, starts at 1). Every humon has `100 + (level-1)*20` max stamina, refilled each morning. Actions are **immediate** but each costs stamina (train 20, travel 40, gym 50). Click **GO TO SLEEP** to advance a day and restore the whole roster. The objective is to beat all 10 gym leaders in the fewest days — the last one sets `state.wonDay`, and the UI shows **YOU WON IN X DAYS**.

## New data layer

**`src/data/manager.ts`** (the game engine, pure functions):

- Types: `Humon`, `GameState`, plus constants (`BASE_STAMINA`, `STAMINA_PER_LEVEL`, `TRAIN/TRAVEL/GYM_STAMINA`, `CURRENCY` rewards/costs, level thresholds).
- `DEFAULT_STATE`, `loadState()`, `saveState()` under key `pkm:manager:v2` (pattern from `humon.ts`, try/catch wrappers). v1 saves are migrated on load (fresh stamina, pending timers dropped).
- Seeded PRNG (mulberry32) + `startAction()`/`startGymAction()` — actions resolve **immediately** on click, consuming stamina; xp/currency/items, catch success/chosen pokémon, gym win/loss all derived from a fresh `seed`. Duplicate catches convert to bonus currency.
- Gym battle: real Showdown sim via the existing `@pkmn/sim` battle lib; boss uses post-swap team; win gates a min recommended level per gym (tunable). Beating the 10th leader calls `recordVictoryIfComplete()` → sets `wonDay`.

**`src/data/hidden-humons.ts`**: specs + sprites for Devilmon and Copmon (new 16×16 PixelArt in the trainer-sprite style), plus Joak (reuse `JOAk_SPRITE`), each with unlock cost + required visited page.

## New pages (800s block)

| Page                | Content                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **810 MANAGER** hub | day, currency, squad, stamina totals, badges, sleep button, objective, all humons + stamina bars, recent activity, gate message if no HUMON |
| **811 ROSTER**      | owned/locked humons, levels, XP, caught teams (sprites + types), stamina per humon                                                          |
| **812 TRAVEL**      | pick humon + hometown → shows catch pool + stamina cost + seeded chance → travel resolves instantly                                         |
| **813 TRAINING**    | pick humon → train instantly (XP/level/currency, costs stamina)                                                                             |
| **814 GYMS**        | 10 bosses: hometown, badge state, team, recommended level → challenge instantly (50 stamina); victory banner once all beaten                |
| **815 UNLOCKS**     | hidden-page visit tracker (000/123/404/666/999) + currency shop for Joak/Devil/Cop                                                          |

Plus new hidden pages **`666.astro` (DEVILMON)** and **`999.astro` (COPMON)**, and a purchase widget on **`123.astro`** ("BUY A JOAK BALL — $500").

## Wiring

- **`navigation.ts`**: `MANAGER_PAGE` + `MANAGER_CHILD_PAGES` (610–615), `DEVILMON_PAGE`/`COPMON_PAGE` (hidden) — add to `PAGES`, `ALL_PAGES` (and hidden pages so typing 666/999 works).
- **`src/scripts/manager.ts`**: global init (included once, like `ceefax-nav.ts`); on every `astro:page-load` loads state, marks the current page as visited (for unlock conditions), and re-renders any `data-manager-feature` containers. A small `ManagerApp.astro` component injects it per page with a feature key (`hub|roster|travel|training|gyms|unlocks|debug`).
- **`CeefaxLayout`**: pages render static Ceefax skeletons; the script fills them client-side from localStorage (same pattern as `TournamentGraphic.initBall`).
- Reuse `SectionNav.astro`, `CeefaxBlock`, `CeefaxHeading`, `PixelArt`, `TrainerSprite`, `POKEMON_SPRITES`, and the map markers for distance.

## Tunables (defaults, in constants)

Max stamina 100 +20/level · train 20 stamina/40 XP · travel 40 stamina/25 XP · gym 50 stamina/60 XP · sleep restores all · gym win $150–300 · travel/train $20–80 · JOAK BALL $500 · Devil/Cop $750 · all actions immediate.

## Implementation order

1. `manager.ts` engine + `hidden-humons.ts` sprites
2. `666.astro`, `999.astro`, 123 JOAK BALL widget + nav wiring
3. `ManagerApp.astro` + `manager.ts` script + CeefaxLayout include
4. Pages 810–815 (hub → roster → training → travel → gyms → unlocks)
5. Verify: `npm run build` (plus `npx astro check` if configured)
