import { BattleStreams, RandomPlayerAI, Teams, PRNG } from "@pkmn/sim";
import { POKEMON_SETS } from "../data/pokemon-sets";

export interface BattleResult {
  win: boolean;
  log: string[];
  items: Record<string, string>;
}

const SPECIES_TO_KEY: Record<string, string> = {};
for (const [key, set] of Object.entries(POKEMON_SETS)) {
  SPECIES_TO_KEY[set.species] = key;
}

export function speciesToKey(species: string): string {
  return SPECIES_TO_KEY[species] ?? species;
}

/** A full Showdown-style set (parsed from an imported team), packed verbatim with defaults filled in. */
export interface CustomSet {
  name?: string;
  species: string;
  item?: string;
  ability?: string;
  moves?: string[];
  nature?: string;
  gender?: string;
  evs?: Partial<Record<"hp" | "atk" | "def" | "spa" | "spd" | "spe", number>>;
  ivs?: Partial<Record<"hp" | "atk" | "def" | "spa" | "spd" | "spe", number>>;
  level?: number;
  teraType?: string;
  shiny?: boolean;
  happiness?: number;
  pokeball?: string;
  hpType?: string;
}

const DEFAULT_IVS = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

export function buildTeam(
  inputs: readonly (string | CustomSet)[],
  level = 100,
): string {
  const sets = inputs.map((input) => {
    if (typeof input === "string") {
      const set = POKEMON_SETS[input];
      if (!set) {
        return {
          name: input,
          species: input,
          item: "Leftovers",
          ability: "Huge Power",
          nature: "Hardy",
          gender: "",
          evs: { hp: 252, atk: 252, def: 0, spa: 0, spd: 4, spe: 0 },
          ivs: DEFAULT_IVS,
          level,
          moves: ["Tackle", "Tackle", "Tackle", "Tackle"],
        };
      }
      return {
        name: input,
        species: set.species,
        item: set.item,
        ability: set.ability,
        nature: set.nature,
        gender: "",
        evs: set.evs,
        ivs: DEFAULT_IVS,
        level,
        moves: set.moves,
      };
    }
    return {
      name: input.name ?? "",
      species: input.species,
      item: input.item ?? "",
      ability: input.ability ?? "Pressure",
      nature: input.nature ?? "Hardy",
      gender: input.gender ?? "",
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...input.evs },
      ivs: { ...DEFAULT_IVS, ...input.ivs },
      level: input.level ?? level,
      moves:
        input.moves && input.moves.length > 0
          ? input.moves
          : ["Tackle", "Tackle", "Tackle", "Tackle"],
      ...(input.teraType ? { teraType: input.teraType } : {}),
      ...(input.hpType ? { hpType: input.hpType } : {}),
      ...(input.shiny ? { shiny: true } : {}),
      ...(input.happiness !== undefined ? { happiness: input.happiness } : {}),
      ...(input.pokeball ? { pokeball: input.pokeball } : {}),
    };
  });
  return Teams.pack(sets);
}

export async function runBattle(
  humonTeam: string[],
  bossTeam: string[],
  seed: number,
): Promise<BattleResult> {
  const prng = new PRNG(`gen5,${seed},${seed},${seed},${seed}`);
  const stream = new BattleStreams.BattleStream();
  const streams = BattleStreams.getPlayerStreams(stream);

  const ai1 = new RandomPlayerAI(streams.p1, { seed: prng });
  const ai2 = new RandomPlayerAI(streams.p2, { seed: prng });

  void ai1.start();
  void ai2.start();

  const spec = { formatid: "gen9customgame", seed: prng.getSeed() };
  const init =
    `>start ${JSON.stringify(spec)}\n` +
    `>player p1 ${JSON.stringify({ name: "HUMON", team: buildTeam(humonTeam) })}\n` +
    `>player p2 ${JSON.stringify({ name: "GYM", team: buildTeam(bossTeam) })}`;
  void streams.omniscient.write(init);

  const raw = await streams.omniscient.readAll();

  const log: string[] = [];
  let win = false;
  for (const chunk of raw) {
    for (const line of chunk.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("|")) continue;
      log.push(trimmed);
      if (trimmed.startsWith("|win|")) {
        const winner = trimmed.split("|")[2];
        win = winner === "HUMON";
      }
    }
  }

  const items: Record<string, string> = {};
  for (const name of [...humonTeam, ...bossTeam]) {
    const set = POKEMON_SETS[name];
    if (set) items[set.species] = set.item;
    else items[name] = "Leftovers";
  }

  return { win, log, items };
}
