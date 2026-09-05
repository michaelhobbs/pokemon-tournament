import { Dex, Teams, TeamValidator } from "@pkmn/sim";
import { POKEMON_SPRITES } from "../data/pokemon-sprites";
import { GYM_FORMAT } from "./gym-battle";
import type { CustomSet } from "./battle";

const GYM_GEN = 9;
export const GYM_TEAM_SIZE = 4;

export interface ImportedMon {
  species: string;
  nickname: string | null;
  label: string;
  item: string | null;
  ability: string | null;
  nature: string | null;
  level: number;
  teraType: string | null;
  moves: string[];
  types: string[];
  evs: { stat: string; label: string; value: number }[];
  ivs: { stat: string; label: string; value: number }[];
  set: CustomSet;
}

export type ImportResult =
  { ok: true; mons: ImportedMon[] } | { ok: false; error: string };

interface StatEntry {
  key: "hp" | "atk" | "def" | "spa" | "spd" | "spe";
  label: string;
}

const STAT_ORDER: StatEntry[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "ATK" },
  { key: "def", label: "DEF" },
  { key: "spa", label: "SPA" },
  { key: "spd", label: "SPD" },
  { key: "spe", label: "SPE" },
];

export function importTeamText(text: string): ImportResult {
  const trimmed = text.trim();
  if (!trimmed)
    return {
      ok: false,
      error: "NOTHING TO IMPORT - PASTE A POKEMON SHOWDOWN TEAM FIRST.",
    };
  let sets: ReturnType<typeof Teams.import>;
  try {
    sets = Teams.import(trimmed);
  } catch (err) {
    return {
      ok: false,
      error:
        `COULD NOT READ THE TEAM: ${err instanceof Error ? err.message : String(err)}`.toUpperCase(),
    };
  }
  if (!sets || sets.length === 0)
    return {
      ok: false,
      error:
        "NO POKEMON FOUND - CHECK THAT THE TEXT USES SHOWDOWN EXPORT FORMAT.",
    };
  if (sets.length !== GYM_TEAM_SIZE) {
    return {
      ok: false,
      error: `GYM BATTLES ARE 4 VS 4 - THE TEAM NEEDS EXACTLY ${GYM_TEAM_SIZE} POKEMON (FOUND ${sets.length}).`,
    };
  }
  let problems: string[] | null;
  try {
    problems = new TeamValidator(GYM_FORMAT).validateTeam(sets);
  } catch (err) {
    problems = [err instanceof Error ? err.message : String(err)];
  }
  if (problems && problems.length > 0)
    return {
      ok: false,
      error: `INVALID TEAM - ${problems.join(" ")}`.toUpperCase(),
    };

  const dex = Dex.forGen(GYM_GEN);
  const mons = sets.map((set): ImportedMon => {
    const rawSpecies = String(set.species ?? "");
    const dexSpecies = dex.species.get(rawSpecies);
    const species = dexSpecies?.exists ? String(dexSpecies.name) : rawSpecies;
    const baseSpecies = dexSpecies?.exists
      ? String(dexSpecies.baseSpecies)
      : rawSpecies;
    // Teams.import back-fills name with the base forme ("Typhlosion" for
    // Typhlosion-Hisui) - that is not a nickname.
    const nickname =
      typeof set.name === "string" &&
      set.name &&
      set.name !== species &&
      set.name !== baseSpecies
        ? set.name
        : null;
    const evSource = (set.evs ?? {}) as Partial<Record<string, number>>;
    const ivSource = (set.ivs ?? {}) as Partial<Record<string, number>>;
    return {
      species,
      nickname,
      label: nickname ?? species,
      item: set.item ? String(set.item) : null,
      ability: set.ability ? String(set.ability) : null,
      nature: set.nature ? String(set.nature) : null,
      level: typeof set.level === "number" && set.level > 0 ? set.level : 100,
      teraType: set.teraType ? String(set.teraType) : null,
      moves: (Array.isArray(set.moves) ? set.moves : [])
        .map(String)
        .filter(Boolean),
      types: dexSpecies?.exists ? dexSpecies.types.map(String) : [],
      evs: STAT_ORDER.filter(({ key }) => (evSource[key] ?? 0) > 0).map(
        ({ key, label }) => ({ stat: key, label, value: evSource[key] ?? 0 }),
      ),
      ivs: STAT_ORDER.filter(
        ({ key }) => ivSource[key] !== undefined && ivSource[key] !== 31,
      ).map(({ key, label }) => ({
        stat: key,
        label,
        value: ivSource[key] ?? 31,
      })),
      set: set as unknown as CustomSet,
    };
  });
  return { ok: true, mons };
}

export function spreadText(entries: ImportedMon["evs"]): string {
  return entries.map((entry) => `${entry.value} ${entry.label}`).join(" / ");
}

/** Base types of any species straight from the pokedex data the sim ships with. */
export function dexTypes(name: string): string[] {
  const species = Dex.forGen(GYM_GEN).species.get(name);
  return species?.exists ? species.types.map(String) : [];
}

/* ---------- pokedex sprite fallback ---------- */

type SpriteStatus = "loading" | "ready" | "missing";
interface SpriteEntry {
  status: SpriteStatus;
  url?: string;
}

const spriteCache = new Map<string, SpriteEntry>();
let spriteListener: (() => void) | null = null;

/** Registers the callback fired whenever a lazily fetched pokedex sprite resolves. */
export function onMonSprites(callback: () => void): void {
  spriteListener = callback;
}

/**
 * Sprite URL for any pokemon: our hand-picked pool first, then a Pokédex
 * sprite fetched once per species (null while loading or when unavailable).
 */
export function monSprite(name: string): {
  url: string | null;
  loading: boolean;
} {
  const known = POKEMON_SPRITES[name];
  if (known) return { url: known, loading: false };
  let entry = spriteCache.get(name);
  if (!entry) {
    entry = { status: "loading" };
    spriteCache.set(name, entry);
    void fetchPokedexSprite(name, entry);
  }
  return entry.status === "ready"
    ? { url: entry.url ?? null, loading: false }
    : { url: null, loading: entry.status === "loading" };
}

async function fetchPokedexSprite(
  name: string,
  entry: SpriteEntry,
): Promise<void> {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokedexSlug(name))}`,
    );
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      sprites?: {
        front_default?: string | null;
        versions?: {
          "generation-i"?: { "red-blue"?: { front_default?: string | null } };
        };
        other?: { "official-artwork"?: { front_default?: string | null } };
      };
    };
    const sprites = data.sprites ?? {};
    const url =
      sprites.versions?.["generation-i"]?.["red-blue"]?.front_default ??
      sprites.front_default ??
      sprites.other?.["official-artwork"]?.front_default ??
      null;
    entry.status = url ? "ready" : "missing";
    entry.url = url ?? undefined;
  } catch {
    entry.status = "missing";
  }
  spriteListener?.();
}

function pokedexSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/[.'’:%]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}
