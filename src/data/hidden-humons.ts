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

export type SecretHumonKey = "joak" | "devil" | "cop";

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
  },
};

export const SECRET_HUMON_KEYS: SecretHumonKey[] = ["joak", "devil", "cop"];

export function secretHumon(key: SecretHumonKey): SecretHumonSpec {
  return SECRET_HUMONS[key];
}

export const BALL_NAMES: Record<SecretHumonKey, string> = {
  joak: "JOAKBALL",
  devil: "DEVILBALL",
  cop: "COPBALL",
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
};
