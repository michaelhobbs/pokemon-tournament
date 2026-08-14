# Pokémon Tournament (PKM)

A Ceefax/teletext-style website tracking a Pokémon tournament, built with **Astro** (static site generator) and **TypeScript**.

## Commands

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `npm install`     | Installs dependencies                           |
| `npm run dev`     | Starts the local dev server at `localhost:4321` |
| `npm run build`   | Builds the production site to `./dist/`         |
| `npm run preview` | Previews the production build locally           |

## UI architecture

The site uses a Ceefax/teletext aesthetic throughout.

- Global theme (fonts, Ceefax colour variables, base reset) lives in `src/styles/ceefax.css`.
- Every page renders through `src/layouts/CeefaxLayout.astro`, which provides the header bar, nav row, content grid, ticker footer, and CRT scanline overlay.
- Keyboard navigation (`src/scripts/ceefax-nav.ts`): number keys enter a 3-digit page code, arrows step through pages, `h`/`?` open `/help`. The header page-number box is clickable and swaps to a numeric input on mobile.
- Page navigation uses Astro view transitions (`<ClientRouter />`); the header, nav row, footer, and CRT overlay persist across navigations while content swaps instantly.

## Pages

Page numbers are managed in `src/data/navigation.ts`:

## Data

- `src/data/players.ts` — the 10 trainers and their initial six-Pokémon teams.
- `src/data/matches.ts` — 9 fixture weeks (`FIRST_HALF_LAST_WEEK = 9` splits first/second half).
- `src/data/midseason.ts` — mid-season draft swaps (removed → replacement, max 2 per trainer) and helpers `swapsFor` / `applySwaps`.
- `src/data/pokemon.ts` — type chart, per-Pokémon types, and `analyzeTeam` for team weakness/resistance analysis.
- `src/data/pokemon-sprites.ts` — Pokémon sprites hot-linked from `img.pokemondb.net` (lowest available generation per Pokémon).
- `src/data/navigation.ts` — site-wide page list and arrow-key navigation order.
- `src/data/trainer-sprites.ts`, `src/data/trophy.ts`, `src/data/awards.ts`, `src/data/hometown-map.ts`, `src/data/humon.ts` — pixel-art assets for trainers, trophy, awards, map, and the catchable HUMON mascot.

## Tracking

Umami analytics is loaded in the layout `<head>` during production builds only (omitted in dev).

## Conventions

- Astro SSG with TypeScript (`strict`); prefer `.astro` + `.ts` over `.js`.
- Reusable UI pieces live in `src/components/ceefax/` (`CeefaxBlock`, `CeefaxHeading`, `PixelArt`, `DraftTable`, `TeamList`, `ResultsTable`, etc.).
- `src/content/` is reserved for content collections once configured (Zod schemas in `src/content.config.ts`).
