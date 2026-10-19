import { Dex } from "@pkmn/sim";

export interface StatValues {
  base: number;
  min: number;
  max: number;
}

export type StatKey =
  "HP" | "Attack" | "Defense" | "Sp. Atk" | "Sp. Def" | "Speed";

export const STAT_COLUMNS: { key: StatKey; label: string }[] = [
  { key: "HP", label: "HP" },
  { key: "Attack", label: "ATK" },
  { key: "Defense", label: "DEF" },
  { key: "Sp. Atk", label: "SP.ATK" },
  { key: "Sp. Def", label: "SP.DEF" },
  { key: "Speed", label: "SPE" },
];

export interface PokemonStats {
  HP: StatValues;
  Attack: StatValues;
  Defense: StatValues;
  "Sp. Atk": StatValues;
  "Sp. Def": StatValues;
  Speed: StatValues;
}

/** Display names whose roster forme differs from the plain species name. */
const SPECIES_OVERRIDES: Record<string, string> = {
  "Alolan Muk": "Muk-Alola",
  "Alolan Ninetales": "Ninetales-Alola",
  "Galarian Weezing": "Weezing-Galar",
  "Hisuian Goodra": "Goodra-Hisui",
  "Hisuian Lilligant": "Lilligant-Hisui",
  "Hisuian Typhlosion": "Typhlosion-Hisui",
  "Hisuian Zoroark": "Zoroark-Hisui",
  "Meowstic (M)": "Meowstic",
  "Rotom (W)": "Rotom-Wash",
};

const SPECIES_NAMES: string[] = [
  "Abomasnow",
  "Aegislash",
  "Alolan Muk",
  "Alolan Ninetales",
  "Amoonguss",
  "Arcanine",
  "Blastoise",
  "Blaziken",
  "Blissey",
  "Breloom",
  "Chandelure",
  "Chansey",
  "Charizard",
  "Clefable",
  "Cloyster",
  "Dragonite",
  "Electabuzz",
  "Empoleon",
  "Excadrill",
  "Ferrothorn",
  "Galarian Weezing",
  "Garchomp",
  "Gardevoir",
  "Gastrodon",
  "Gengar",
  "Gothitelle",
  "Greninja",
  "Gyarados",
  "Hariyama",
  "Hisuian Goodra",
  "Hisuian Lilligant",
  "Hisuian Typhlosion",
  "Hisuian Zoroark",
  "Hitmontop",
  "Hydreigon",
  "Kangaskhan",
  "Kingdra",
  "Klefki",
  "Lapras",
  "Lucario",
  "Ludicolo",
  "Magnezone",
  "Mamoswine",
  "Meowstic (M)",
  "Metagross",
  "Milotic",
  "Murkrow",
  "Pachirisu",
  "Pelipper",
  "Politoed",
  "Porygon2",
  "Raichu",
  "Rotom (W)",
  "Sableye",
  "Salamence",
  "Scizor",
  "Shuckle",
  "Slaking",
  "Slowbro",
  "Swampert",
  "Sylveon",
  "Talonflame",
  "Togekiss",
  "Torkoal",
  "Tyranitar",
  "Weavile",
  "Whimsicott",
];

function level100Values(
  base: number,
  dexKey: "hp" | "atk" | "def" | "spa" | "spd" | "spe",
): StatValues {
  if (dexKey === "hp") {
    return { base, min: 2 * base + 110, max: 2 * base + 204 };
  }
  return {
    base,
    min: Math.floor((2 * base + 5) * 0.9),
    max: Math.floor((2 * base + 99) * 1.1),
  };
}

/**
 * Level-100 stat ranges matching the Pokémon Showdown team builder: max = 31 IV
 * / 252 EVs / beneficial nature, min = 0 IV / 0 EVs / hindering nature (HP has
 * no nature modifier). Base stats come from the @pkmn/sim pokedex, so these
 * always agree with the battle engine.
 */
export const POKEMON_STATS: Record<string, PokemonStats> = Object.fromEntries(
  SPECIES_NAMES.map((name) => {
    const species = Dex.species.get(SPECIES_OVERRIDES[name] ?? name);
    if (!species.exists) {
      throw new Error(`pokemon-stats: unknown species "${name}"`);
    }
    const stats: PokemonStats = {
      HP: level100Values(species.baseStats.hp, "hp"),
      Attack: level100Values(species.baseStats.atk, "atk"),
      Defense: level100Values(species.baseStats.def, "def"),
      "Sp. Atk": level100Values(species.baseStats.spa, "spa"),
      "Sp. Def": level100Values(species.baseStats.spd, "spd"),
      Speed: level100Values(species.baseStats.spe, "spe"),
    };
    return [name, stats];
  }),
);
