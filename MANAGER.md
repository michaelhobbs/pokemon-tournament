# HUMON MANAGER — Game Plan

A football-manager style idle game for the Pokémon tournament site. The player manages a squad of HUMONs (trainers-turned-pokémon) who each go out and collect their own pokémon.

## Game concept

- **Your squad is HUMONs.** You start with the one caught on the home page (existing `pkm:humon-caught` gate — no HUMON, no game). Humons auto-manage their own pokémon; you only give instructions.
- **Each humon collects its own team** by travelling to hometowns on the map (800). Each hometown's catch pool = that trainer's team (current, mid-season swaps applied via `applySwaps`).
- **Gym bosses** = the 10 tournament trainers. Beat one (real Showdown sim via `@pkmn/sim`) → badge recorded in `state.defeated`; badges are tracked, leaders don't join the roster.
- **Hidden humons** = secret pages: Joak (123, catch with a **JOAKBALL**), Devilmon (new page 666, catch with a **DEVILBALL**), Copmon (page 999, catch with a **COPBALL**). Balls are bought at the POKESHOP on 810, then thrown on the humon's hidden page. Each hidden humon joins the squad with a themed full team of 6 (all non-shiny, straight from the tournament pool): Joak gets the top-tier powerhouses (Dragonite, Garchomp, Salamence, Metagross, Tyranitar, Hydreigon), Devilmon an all-fire lineup (Hisuian Typhlosion, Torkoal, Charizard, Blaziken, Chandelure, Talonflame), and Copmon the law they swore to uphold (Alolan Ninetales, Cloyster, Mamoswine, Lapras + Arcanine, Lucario) — no species shared between the three teams.
- **Days + stamina**: the game counts days since you started (`state.day`, starts at 1). Every humon has `100 + (level-1)*20` max stamina, refilled each morning. Actions are **immediate** but each costs stamina (train 20, travel 40, gym 50). Click **GO TO SLEEP** to advance a day and restore the whole roster. The objective is to beat all 10 gym leaders in the fewest days — the last one sets `state.wonDay`, and the UI shows **YOU WON IN X DAYS**.
- **Badges on the map**: beating a gym leader swaps that trainer's numbered marker on the hometown map (800) for their badge sprite (`badgeFor`), with a yellow border + "BADGE: <name>" tooltip. Badges are keyed to the real player numbers (1,2,3,5,6,7,8,9,10,11), so all 10 leaders incl. Hannah (#11) get one.
- **Pokeputer**: a shared, unlimited box (`state.storage`). Duplicate catches and catches made when a humon's team of 6 is full are **boxed here instead of auto-sold**. The manager can transfer pokémon between humons (`transferBetweenHumons`), box/unbox them (`depositToStorage`/`withdrawFromStorage`), and sell boxed spares for `CURRENCY.duplicate` (`sellFromStorage`). Transfer unboxes are gated by `MAX_TEAM_SIZE` and block duplicate species on the same team. `version` is now 4 — v2 saves (string-array teams/box) migrate to `CaughtMon[]` on load as non-shiny; v3 saves get the hidden humons' themed teams backfilled (only while the team is still empty, so a v3 save upgraded to v4 won't clobber a team you later emptied on purpose).
- **Shinies**: each caught pokémon rolls `shinyChance(humon.level)` (level-scaled, `SHINY_BASE` 0.5% + `SHINY_PER_LEVEL` 0.1%/lv, capped at `SHINY_CAP` 5%) right after a successful catch. Shininess rides the individual `CaughtMon` through the team, pokeputer, transfers, and battle replays — a shiny of a species you already own gets boxed like any duplicate, and normal + shiny copies of the same species can coexist in the box. Boxed shinies sell for double (`SHINY_SELL_MULTIPLIER`). UI: roster chips / boxed rows / p1 battle sprites get a CSS holographic shimmer + `SHINY` tag; the travel preview shows current SHINY ODDS.

## New data layer

**`src/data/manager.ts`** (the game engine, pure functions):

- Types: `Humon` (`team: CaughtMon[]`), `GameState` (`storage: CaughtMon[]`), `CaughtMon { species, shiny }`, plus constants (`BASE_STAMINA`, `STAMINA_PER_LEVEL`, `TRAIN/TRAVEL/GYM_STAMINA`, `CURRENCY` rewards/costs, level thresholds, `SHINY_BASE/SHINY_PER_LEVEL/SHINY_CAP`, `shinyChance`).
- `DEFAULT_STATE`, `loadState()`, `saveState()` under key `pkm:manager:v2` (pattern from `humon.ts`, try/catch wrappers). v1 saves are migrated on load (fresh stamina, pending timers dropped); v2 saves migrate to `CaughtMon[]` (all non-shiny); v3 saves backfill hidden-humon starter teams via `ensureSecretTeams`.
- Seeded PRNG (mulberry32) + `startAction()`/`startGymAction()` — actions resolve **immediately** on click, consuming stamina; xp/currency/items, catch success/chosen pokémon, gym win/loss all derived from a fresh `seed`. Duplicate/team-full catches auto-box in the pokeputer; every successful catch also rolls for shiny.
- Gym battle: real Showdown sim via the existing `@pkmn/sim` battle lib; boss uses post-swap team; win gates a min recommended level per gym (tunable). Beating the 10th leader calls `recordVictoryIfComplete()` → sets `wonDay`.
- Shop: `buyBall` (one ball per hidden humon), `buyRareCandy` (unlimited, `RARE_CANDY_PRICE` ¥150 → +1 `rare-candy`, the item `useRareCandy` spends for `RARE_CANDY_XP`).

**`src/data/hidden-humons.ts`**: specs + sprites for Devilmon and Copmon (new 16×16 PixelArt in the trainer-sprite style), plus Joak (reuse `JOAk_SPRITE`), each with unlock cost + required visited page + a `team: string[]` of the themed 6 pokémon they arrive with.

## New pages (800s block)

**810 MANAGER** (single page, `/manager`) renders everything stacked in one scroll: day/currency/stamina status bar, GO TO SLEEP, victory banner, objective, quick-jump bar (scrolls to each section), full roster (levels, XP, teams, stamina, rare candy), TRAIN form, TRAVEL form + live catch-pool preview, GYM LEADERS boss cards, battle replays, a **POKEPUTER** section (boxed duplicates with SELL / unbox-to-humon controls plus a FROM→MON→TO transfer form for moving pokémon between humons and the box), POKESHOP (buy JOAKBALL ¥500, DEVILBALL/COPBALL ¥750 — throw on the humon's hidden page to catch it — and **RARE CANDY ¥150 each, unlimited** for instant +50 XP on any humon), a BADGE RACK (10 slots, filled with each defeated leader's badge), and the recent-activity log. Shows a gate message if no HUMON is caught.

Plus hidden pages **`123.astro` (PROFESSOR JOAK)**, **`666.astro` (DEVILMON)** and **`999.astro` (COPMON)**, each with a ball-throw widget (`data-manager-secret`) fed by balls from the POKESHOP.

## Wiring

- **`navigation.ts`**: `MANAGER_PAGE` (810, hidden) — add to `PAGES`, `ALL_PAGES`; `DEVILMON_PAGE`/`COPMON_PAGE` (hidden) so typing 666/999 works.
- **`src/scripts/manager.ts`**: global init (included once, like `ceefax-nav.ts`); on every `astro:page-load` loads state, marks the current page as visited (for unlock conditions), and re-renders any `data-manager-feature` containers. A small `ManagerApp.astro` component injects it per page with a feature key (`all`). Forms use scoped select keys (`train-humon`, `travel-humon`/`travel-town`, `gym-humon`) safe to co-exist on the single page. After every action it dispatches a `mgr:say` event (newest log line), and the header HUMON shows it in a 5-second transient bubble (replaced on the next action; `is-talking-say`).
- **`CeefaxLayout`**: pages render static Ceefax skeletons; the script fills them client-side from localStorage (same pattern as `TournamentGraphic.initBall`).
- Reuse `SectionNav.astro`, `CeefaxBlock`, `CeefaxHeading`, `PixelArt`, `TrainerSprite`, `POKEMON_SPRITES`, and the map markers for distance.

## Tunables (defaults, in constants)

Max stamina 100 +20/level · train 20 stamina/40 XP · travel 40 stamina/25 XP · gym 50 stamina/60 XP · sleep restores all · gym win ¥150–300 · travel/train ¥20–80 · JOAKBALL ¥500 · DEVILBALL/COPBALL ¥750 · RARE CANDY ¥150 (unlimited) · all actions immediate.

## Implementation order

1. `manager.ts` engine + `hidden-humons.ts` sprites
2. `666.astro`, `999.astro`, `123.astro` ball-throw widgets + nav wiring
3. `ManagerApp.astro` + `manager.ts` script + CeefaxLayout include
4. Single 810 page (status bar → roster → train → travel → gyms → replays → shop → log)
5. Verify: `npm run build` (plus `npx astro check` if configured)
