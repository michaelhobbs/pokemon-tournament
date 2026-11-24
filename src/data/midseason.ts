export interface MidseasonSwap {
  /** Pokémon removed from the initial draft team */
  removed: string;
  /** Pokémon drafted to replace it */
  replacement: string;
  /** Shelter-style adoption blurb for the removed Pokémon */
  blurb: string;
}

/** Mid-season draft swaps, keyed by player number. Max 2 per player. */
export const MIDSEASON_SWAPS: Record<number, MidseasonSwap[]> = {
  1: [
    {
      removed: "Pachirisu",
      replacement: "Porygon2",
      blurb:
        "TINY, LOUD, AND FULL OF STATIC. GREAT WITH KIDS, PROVIDED THEY ARE INSULATED. WILL CHEER FOR YOU WHILE STEALING EVERY CHARGER.",
    },
  ],
  3: [
    {
      removed: "Klefki",
      replacement: "Arcanine",
      blurb:
        "HOARDS KEYS, TRUSTS NOBODY, AND JANGLES CONSTANTLY. IDEAL FOR THE OWNER WHO HAS LOST ALL SENSE OF AUDIO PEACE.",
    },
  ],
  5: [
    {
      removed: "Empoleon",
      replacement: "Kangaskhan",
      blurb:
        "FORMER EMPEROR, CURRENTLY BETWEEN TERRITORIES. EXPECTS A THRONE, A BUTLER, AND A POND. HOUSE TRAINED, ALLEGEDLY.",
    },
  ],
  7: [
    {
      removed: "Chansey",
      replacement: "Gardevoir",
      blurb:
        "NATURAL CARER, EXCELLENT WITH SICKLY TRAINERS, AND WILL NOT STOP NURSING YOU. PLEASE BRING YOUR OWN TISSUES.",
    },
    {
      removed: "Slowbro",
      replacement: "Sableye",
      blurb:
        "VERY LOW ENERGY, VERY HIGH COMMITMENT. WILL FOLLOW YOU ANYWHERE, EVENTUALLY. SHELL PROVIDES FREE FURNITURE.",
    },
  ],
  8: [
    {
      removed: "Gothitelle",
      replacement: "Klefki",
      blurb:
        "BROODY, THEATRICAL, AND ALREADY KNOWS HOW YOUR WEEK ENDS. NEEDS A HOME WITH NO MIRRORS AND PLENTY OF EYELINER.",
    },
  ],
  9: [
    {
      removed: "Abomasnow",
      replacement: "Gyarados",
      blurb:
        "WINTER IN A POT. SHEDS, CHILLS, AND GLARES AT ANYONE WHO SAYS GLOBAL WARMING. SNOW SHOVEL NOT INCLUDED.",
    },
  ],
  10: [
    {
      removed: "Weavile",
      replacement: "Breloom",
      blurb:
        "SHARP, FAST, AND QUESTIONABLY HOUSE TRAINED. WILL KNOCK CURTAINS OFF THE WALL AND CALL IT LOVE.",
    },
  ],
};

export function swapsFor(playerNumber: number): MidseasonSwap[] {
  return MIDSEASON_SWAPS[playerNumber] ?? [];
}

/** Initial-draft team with each removed Pokémon replaced by its draft pick. */
export function applySwaps(team: string[], swaps: MidseasonSwap[]): string[] {
  return team.map((pokemon) => {
    const swap = swaps.find((s) => s.removed === pokemon);
    return swap ? swap.replacement : pokemon;
  });
}
