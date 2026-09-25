import type { PixelArt } from "./trophy";
import { JOAk_SPRITE } from "./professor-joak";

export const DEVIL_SPRITE: PixelArt = {
  map: [
    "................",
    "...RRR....RRR...",
    "..RRRRR..RRRRR..",
    "..RRBBBBBBBBRR..",
    "..RKKKKKKKKKKR..",
    ".RKKKKKKKKKKKKR.",
    ".RKKWKKKKWKKKKR.",
    ".RKKKKKKKKKKKKR.",
    ".RRKKKKKKKKKKRR.",
    "..RKKKKKKKKKKR..",
    "..BOOOOOOOOOOB..",
    ".BOOOOOOOOOOOOB.",
    ".BOOOOBBBBOOOOB.",
    ".BBOOOOOOOOOOBB.",
    "..BBBBBBBBBBBB..",
    "................",
  ],
  palette: {
    B: "#000000",
    R: "#e63232",
    K: "#ffd700",
    O: "#ff00ff",
    W: "#ffffff",
  },
};

export const COP_SPRITE: PixelArt = {
  map: [
    "................",
    "....BBBBBBBB....",
    "..BBBBBBBBBBBB..",
    "..BWWWWWWWWWWB..",
    "..BWWWWWWWWWWB..",
    "..BBBBBBBBBBBB..",
    "..BWWWWWWWWWWB..",
    "..BKKKKKKKKKKB..",
    "..BKBBKKBBKKKB..",
    "..BKKKKKKKKKKB..",
    "..BKKKKKKKKKKB..",
    "..BOOOOOOOOOOB..",
    ".BOOOOOOOOOOOOB.",
    ".BOOOOWWWWWOOOB.",
    ".BBOOOOOOOOOOBB.",
    "..BBBBBBBBBBBB..",
  ],
  palette: {
    B: "#000000",
    K: "#ffcc99",
    W: "#ffffff",
    O: "#3b6aff",
  },
};

export const GLITCH_SPRITE: PixelArt = {
  map: [
    "................",
    "..G..G....G..G..",
    ".G...G...G...G..",
    "..G..G....G..G..",
    "...GGGGGGGGGG...",
    "..BKKKKKKKKKKB..",
    ".BKKWKKKKWKKKB..",
    "BKKKKKKKKKKKKKB.",
    "BKKKKKKKKKKKKKB.",
    "BKKKKKKKKKKKKKB.",
    ".BKKDDDDDDDKKB..",
    "..BDDGGDDGGDKB..",
    "..BGGDDGGDDDKB..",
    "..BGGGGGGGGGKB..",
    "..BBBBBBBBBBB...",
    "................",
  ],
  palette: {
    B: "#000000",
    G: "#004d26",
    K: "#00ff41",
    W: "#ffffff",
    D: "#ff00dd",
  },
};

export const BOND_SPRITE: PixelArt = {
  map: [
    "................",
    "......WWWW......",
    "....WWWWWWWW....",
    "...WKKKKKKKKW...",
    "...WKKKKKKKKW...",
    "...WKKWWKKWWK...",
    "...WKKKKKKKKW...",
    "....KKKKKKKK....",
    "....KKKKKKKK....",
    "...BBBBBBBBBB...",
    "..BBWWWWWWWWBB..",
    "..BBWWWWWWWWBB..",
    ".BBBBBBBBBBBBBB.",
    ".BBBKBBBBKBBBKB.",
    "..BKK..BB..KKB..",
    "................",
  ],
  palette: {
    B: "#000000",
    K: "#ffcc99",
    W: "#ffffff",
  },
};

export const ANGEL_SPRITE: PixelArt = {
  map: [
    "................",
    "......GGG.......",
    "......GGG.......",
    "......GGG.......",
    "..WW..KKKK..WW..",
    ".WWW.KKKKKK.WWW.",
    ".WWW.KWKKWK.WWW.",
    ".WWW.KKKKKK.WWW.",
    ".WWW..KKKK..WWW.",
    "..WW.PPPPPPP.WW.",
    "..PP.PPPPPP.PP..",
    ".PPP.PPPPPP.PPP.",
    ".PPP.PPPPPP.PPP.",
    "..PPPPPP..PPPP..",
    ".....PPP..PPP...",
    "................",
  ],
  palette: {
    B: "#000000",
    G: "#ffd700",
    K: "#ffcc99",
    W: "#ffffff",
    P: "#f6c1d9",
  },
};

export const SEX_SPRITE: PixelArt = {
  map: [
    "................",
    "...PPP....PPP...",
    "..PPPPP..PPPPP..",
    ".PPPKKKKKKPPP...",
    ".PPKKWWKKKKPP...",
    ".PPKKKPPKKKKP...",
    ".PPKKKKPPKKKP...",
    ".PPKKWWKKKKPP...",
    ".PPPKKKKKKPPP...",
    "..PPPPPPPPPPP...",
    "...PP.....PP....",
    "...PPP...PPP....",
    "....PPP.PPP.....",
    ".....PPPPP......",
    ".......P........",
    "................",
  ],
  palette: {
    B: "#000000",
    K: "#ffcc99",
    W: "#ffffff",
    P: "#ff5c9a",
  },
};

export const DBZ_SPRITE: PixelArt = {
  map: [
    "................",
    "..G.G...G..G....",
    ".G.G.G.GG.G.G...",
    ".GG.GGGGGG.GG...",
    ".GGGGKKKKGGGG...",
    ".GGGKKKKKKGGG...",
    "..BKKKKKKKKKB...",
    "..BKKWKKKKWKB...",
    "..BKKKKKKKKKB...",
    "...BKKYKKKB.....",
    "...BKKKKKKB.....",
    "..BOOOOYYOOOB...",
    ".BOOOOYYYOOOOBB.",
    ".BOOOOOOOOOOOBB.",
    "..BBOOO..OOOBB..",
    "................",
  ],
  palette: {
    B: "#000000",
    G: "#ffd700",
    Y: "#fff27a",
    K: "#ffcc99",
    W: "#ffffff",
    O: "#e68a00",
  },
};

export type SecretHumonKey =
  "joak" | "devil" | "cop" | "glitch" | "bond" | "angel" | "sex" | "dbz";

export interface SecretHumonSpec {
  key: SecretHumonKey;
  name: string;
  title: string;
  /** Page number that must be visited before unlocking. */
  page: string;
  /** Currency cost to unlock. */
  cost: number;
  sprite: PixelArt;
  blurb: string;
  /** Shop copy describing the ball, not the humon. */
  ballBlurb: string;
  /** Full 6-pokémon team the humon joins the squad with. */
  team: string[];
}

export const SECRET_HUMONS: Record<SecretHumonKey, SecretHumonSpec> = {
  joak: {
    key: "joak",
    name: "JOAK",
    title: "POKEMON TRAINER TRAINER",
    page: "123",
    cost: 500,
    sprite: JOAk_SPRITE,
    blurb: "THE PROFESSOR HIMSELF. IT IS TRAINERS ALL THE WAY DOWN.",
    ballBlurb:
      "THE PROFESSOR'S REGISTERED BALL. ONE THROW, ALL TRAINERS INSIDE.",
    team: [
      "Dragonite",
      "Garchomp",
      "Salamence",
      "Metagross",
      "Tyranitar",
      "Hydreigon",
    ],
  },
  devil: {
    key: "devil",
    name: "DEVILMON",
    title: "THE GIBBERING HORROR",
    page: "666",
    cost: 750,
    sprite: DEVIL_SPRITE,
    blurb: "A WILD HUMON FROM THE VOID. IT KNOWS EVERY TYPE ADVANTAGE.",
    ballBlurb: "A POCKET FROM THE VOID BETWEEN PAGES. EVERY ADVANTAGE INSIDE.",
    team: [
      "Hisuian Typhlosion",
      "Torkoal",
      "Charizard",
      "Blaziken",
      "Chandelure",
      "Talonflame",
    ],
  },
  cop: {
    key: "cop",
    name: "COPMON",
    title: "THE LAW",
    page: "999",
    cost: 750,
    sprite: COP_SPRITE,
    blurb: "A HUMON WHO BECAME THE POLICE. STOP. DROP. TRADE.",
    ballBlurb: "THE LAW'S OWN BALL. IT PUTS TYPE CHARTS IN THEIR PLACE.",
    team: [
      "Alolan Ninetales",
      "Cloyster",
      "Mamoswine",
      "Lapras",
      "Arcanine",
      "Lucario",
    ],
  },
  glitch: {
    key: "glitch",
    name: "GLITCHMON",
    title: "THE NOT FOUND",
    page: "404",
    cost: 600,
    sprite: GLITCH_SPRITE,
    blurb:
      "THE PAGE WASN'T FOUND. THEN IT DRIFTED HERE. NOW IT FIGHTS WITH YOU.",
    ballBlurb:
      "A BALL THAT DOESN'T EXIST UNTIL YOU THROW IT. PACKETS AND PRAYERS.",
    team: [
      "Porygon2",
      "Rotom (W)",
      "Aegislash",
      "Gengar",
      "Sableye",
      "Galarian Weezing",
    ],
  },
  bond: {
    key: "bond",
    name: "BONDMON",
    title: "LICENCE TO THRILL",
    page: "007",
    cost: 800,
    sprite: BOND_SPRITE,
    blurb: "NOT EVEN A TYPE ADVANTAGE. THE STIRRED ONE. IT NEVER MISSES.",
    ballBlurb:
      "CLASSIFIED. TO BE SOLD ONLY AFTER THE END OF THE SEASON. THIS BALL MIGHT LOVE YOU.",
    team: [
      "Greninja",
      "Murkrow",
      "Meowstic (M)",
      "Hisuian Zoroark",
      "Kingdra",
      "Kangaskhan",
    ],
  },
  angel: {
    key: "angel",
    name: "ANGELMON",
    title: "THE WATCHER",
    page: "777",
    cost: 700,
    sprite: ANGEL_SPRITE,
    blurb:
      "AN ABOVE-WATER HUMON. EVERY BATTLE IS WITNESSED. EVERY LOSS IS JUDGED.",
    ballBlurb: "A HOLY BALL. THROW IT AND MAYBE SOMETHING GOOD HAPPENS.",
    team: [
      "Sylveon",
      "Togekiss",
      "Clefable",
      "Gardevoir",
      "Milotic",
      "Pelipper",
    ],
  },
  sex: {
    key: "sex",
    name: "SEXMON",
    title: "69. NICE.",
    page: "069",
    cost: 750,
    sprite: SEX_SPRITE,
    blurb:
      "IT'S EXACTLY WHAT YOU THINK IT IS. EVERY ROUND IS A ROUND. IT NEVER SLEEPS ALONE.",
    ballBlurb:
      "REQUIRED BY POKECEPTION LAW TO BE SOLD WITH THIS LABEL. SEXY TIMES INSIDE.",
    team: [
      "Blissey",
      "Whimsicott",
      "Alolan Muk",
      "Blastoise",
      "Politoed",
      "Raichu",
    ],
  },
  dbz: {
    key: "dbz",
    name: "DBZMON",
    title: "POWER LEVEL OVER 9000",
    page: "329",
    cost: 850,
    sprite: DBZ_SPRITE,
    blurb:
      "IT'S TRAINING ON THE WAY THERE. IT GOES EVEN FURTHER BEYOND. SCREAMING NOT INCLUDED.",
    ballBlurb:
      "A BALL THAT TOOK FIVE EPISODES TO LEAVE THE SHELF. CLICKING OPENS ANOTHER ARC.",
    team: [
      "Electabuzz",
      "Hariyama",
      "Hitmontop",
      "Scizor",
      "Shuckle",
      "Slaking",
    ],
  },
};

export const SECRET_HUMON_KEYS: SecretHumonKey[] = [
  "joak",
  "devil",
  "cop",
  "glitch",
  "bond",
  "angel",
  "sex",
  "dbz",
];

export function secretHumon(key: SecretHumonKey): SecretHumonSpec {
  return SECRET_HUMONS[key];
}

export const BALL_NAMES: Record<SecretHumonKey, string> = {
  joak: "JOAKBALL",
  devil: "DEVILBALL",
  cop: "COPBALL",
  glitch: "GLITCHBALL",
  bond: "BONDBALL",
  angel: "ANGELBALL",
  sex: "SEXBALL",
  dbz: "DBZBALL",
};

const POKEBALL_MAP: string[] = [
  "................",
  "..BBBBBBBBBBBB..",
  ".BRRRRRRRRRRRRB.",
  ".BRRRRRRRRRRRRB.",
  ".BRRRRRRRRRRRRB.",
  ".BRRRRRRRRRRRRB.",
  ".BRRRRRRRRRRRRB.",
  ".BRRBBBBBBBBRRB.",
  ".BBBBBBBBBBBBBB.",
  ".BBBBBBWWBBBBBB.",
  ".BBBBBBWWBBBBBB.",
  ".BWWWWWWWWWWWWB.",
  ".BWWWWWWWWWWWWB.",
  ".BWWWWWWWWWWWWB.",
  ".BBBBBBBBBBBBBB.",
  "................",
];

function pokeball(top: string): PixelArt {
  return {
    map: POKEBALL_MAP,
    palette: { B: "#000000", R: top, W: "#ffffff" },
  };
}

export const BALL_SPRITES: Record<SecretHumonKey, PixelArt> = {
  joak: pokeball("#e63232"),
  devil: pokeball("#ff00ff"),
  cop: pokeball("#3b6aff"),
  glitch: pokeball("#00ff41"),
  bond: pokeball("#ff9d00"),
  angel: pokeball("#f6d6ff"),
  sex: pokeball("#ff5c9a"),
  dbz: pokeball("#ff5a1f"),
};
