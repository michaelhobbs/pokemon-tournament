# HUMON MANAGER — Game Plan

A football-manager style idle game for the Pokémon tournament site. The player manages a squad of HUMONs (trainers-turned-pokémon) who each go out and collect their own pokémon.

## Game concept

- **Your squad is HUMONs.** You start with the one caught on the home page (existing `pkm:humon-caught` gate — no HUMON, no game). Humons auto-manage their own pokémon; you only give instructions.
- **Each humon collects its own team** by travelling to hometowns on the map (800). Each hometown's catch pool = that trainer's team (current, mid-season swaps applied via `applySwaps`).
- **Gym bosses** = the 10 tournament trainers. Beat one (deterministic type sim) → badge + that trainer joins your roster as a humon (reusing `spriteFor()`).
- **Hidden humons** = secret pages: Joak (123, needs a purchased **JOAK BALL**), Devilmon (new page 666, needs currency), Copmon (page 999, needs currency).
- **Cooldowns in hours** per action per humon; results are resolved deterministically from a stored seed, so nothing is lost across SPA nav / refresh.

## New data layer

**`src/data/manager.ts`** (the game engine, pure functions):

- Types: `Humon`, `Action`, `GameState`, plus constants (`TRAIN_MS`, `TRAVEL_BASE_MS`, `GYM_MS`, `CURRENCY` rewards/costs, level thresholds).
- `DEFAULT_STATE`, `loadState()`, `saveState()` under key `pkm:manager:v1` (pattern from `humon.ts`, try/catch wrappers).
- Seeded PRNG (mulberry32) + `startAction()`, `resolveAction()` — deterministic, idempotent resolution: catch success/chosen pokémon, xp/currency/items, gym win/loss all derived from `{startedAt, durationMs, seed}`. Duplicate catches convert to bonus currency.
- Gym formula: each side's power = Σ stat totals (`POKEMON_STATS` max) adjusted by type matchups via the existing `multiplier()`/`POKEMON_TYPES`; boss uses post-swap team; win gates a min recommended level per gym (tunable).

**`src/data/hidden-humons.ts`**: specs + sprites for Devilmon and Copmon (new 16×16 PixelArt in the trainer-sprite style), plus Joak (reuse `JOAk_SPRITE`), each with unlock cost + required visited page.

## New pages (800s block)

| Page | Content |
|---|---|
| **810 MANAGER** hub | currency, all humons + live status/countdowns, active actions, quick links, gate message if no HUMON |
| **811 ROSTER** | owned/locked humons, levels, XP, caught teams (sprites + types), status |
| **812 TRAVEL** | pick idle humon + hometown → shows catch pool + seeded chance → start trip (duration from map grid distance) |
| **813 TRAINING** | pick humon → train (XP/level/currency) |
| **814 GYMS** | 10 bosses: hometown, badge state, team, recommended level → challenge |
| **815 UNLOCKS** | hidden-page visit tracker (000/123/404/666/999) + currency shop for Joak/Devil/Cop |

Plus new hidden pages **`666.astro` (DEVILMON)** and **`999.astro` (COPMON)**, and a purchase widget on **`123.astro`** ("BUY A JOAK BALL — $500").

## Wiring

- **`navigation.ts`**: `MANAGER_PAGE` + `MANAGER_CHILD_PAGES` (610–615), `DEVILMON_PAGE`/`COPMON_PAGE` (hidden) — add to `PAGES`, `ALL_PAGES` (and hidden pages so typing 666/999 works).
- **`src/scripts/manager.ts`**: global init (included once, like `ceefax-nav.ts`); on every `astro:page-load` loads state, resolves elapsed actions, marks the current page as visited (for unlock conditions), re-renders any `data-manager-feature` containers, ticks countdowns every second. A small `ManagerApp.astro` component injects it per page with a feature key (`hub|roster|travel|training|gyms|unlocks`).
- **`CeefaxLayout`**: pages render static Ceefax skeletons; the script fills them client-side from localStorage (same pattern as `TournamentGraphic.initBall`).
- Reuse `SectionNav.astro`, `CeefaxBlock`, `CeefaxHeading`, `PixelArt`, `TrainerSprite`, `POKEMON_SPRITES`, and the map markers for distance.

## Tunables (defaults, in constants)

Train 2h · travel 2–8h (map distance) · gym 6h · gym win $150–300 · travel/train $20–80 · JOAK BALL $500 · Devil/Cop $750 · one active action per humon.

## Implementation order

1. `manager.ts` engine + `hidden-humons.ts` sprites
2. `666.astro`, `999.astro`, 123 JOAK BALL widget + nav wiring
3. `ManagerApp.astro` + `manager.ts` script + CeefaxLayout include
4. Pages 810–815 (hub → roster → training → travel → gyms → unlocks)
5. Verify: `npm run build` (plus `npx astro check` if configured)
