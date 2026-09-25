import type { PixelArt } from "./trophy";
import { HUMON } from "./humon";
import {
  DEVIL_SPRITE,
  COP_SPRITE,
  GLITCH_SPRITE,
  BOND_SPRITE,
  ANGEL_SPRITE,
  SEX_SPRITE,
  DBZ_SPRITE,
} from "./hidden-humons";
import { JOAk_SPRITE } from "./professor-joak";

export interface HumonSkin {
  /** Storage id. */
  id: string;
  name: string;
  sprite: PixelArt;
}

/** The victorious HUMON: gold crown + gold outfit. */
export const CHAMPION_SPRITE: PixelArt = {
  map: [
    "....G..GG..G....",
    "....GGGGGGGG....",
    "...BGGGGGGGGB...",
    "..BKKKKKKKKKKB..",
    "..BKKWKKKKWKKB..",
    "..BKKKKKKKKKKB..",
    "...BKKKKKKKKB...",
    ".BOOOOOOOOOOOOB.",
    "..BOOOOOOOOOOB..",
    "..BOOOOOOOOOOB..",
    "..BBBBBBBBBBBB..",
    "..BOOOOOOOOOOB..",
    "..BOOO....OOOB..",
    "..BOOO....OOOB..",
    "..BBBB....BBBB..",
    "................",
  ],
  palette: {
    B: "#000000",
    K: "#ffcc99",
    W: "#ffffff",
    G: "#ffd700",
    O: "#e9b800",
  },
};

export const HUMON_SKINS: HumonSkin[] = [
  { id: "default", name: "THE HUMON", sprite: HUMON },
  { id: "champion", name: "CHAMPION", sprite: CHAMPION_SPRITE },
  { id: "joak", name: "JOAK", sprite: JOAk_SPRITE },
  { id: "devil", name: "THE DEVIL", sprite: DEVIL_SPRITE },
  { id: "cop", name: "THE COP", sprite: COP_SPRITE },
  { id: "glitch", name: "THE GLITCH", sprite: GLITCH_SPRITE },
  { id: "bond", name: "THE BOND", sprite: BOND_SPRITE },
  { id: "angel", name: "THE ANGEL", sprite: ANGEL_SPRITE },
  { id: "sex", name: "THE SEX", sprite: SEX_SPRITE },
  { id: "dbz", name: "THE DBZ", sprite: DBZ_SPRITE },
];

export function skinFor(id: string | undefined): HumonSkin {
  return HUMON_SKINS.find((s) => s.id === id) ?? HUMON_SKINS[0];
}

/** Whether a skin is gated behind catching that hidden HUMON. */
export function skinUnlockKey(id: string): string | undefined {
  if (
    id === "joak" ||
    id === "devil" ||
    id === "cop" ||
    id === "glitch" ||
    id === "bond" ||
    id === "angel" ||
    id === "sex" ||
    id === "dbz"
  ) {
    return id;
  }
  return undefined;
}
