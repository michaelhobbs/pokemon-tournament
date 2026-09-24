export interface Badge {
  /** Gym leader player number this badge belongs to. */
  number: number;
  name: string;
  sprite: { map: string[]; palette: Record<string, string> };
}

const FRAME_TOP = [
  "................",
  "......BBBB......",
  "....BBBBBBBB....",
  "...BBGGGGGGBB...",
  "..BGGGGGGGGGGB..",
  "..BGGGGGGGGGGB..",
];

const FRAME_BOTTOM = [
  "..BGGGGGGGGGGB..",
  "..BGGGGGGGGGGB..",
  "...BBGGGGGGBB...",
  "....BBBBBBBB....",
  "......BBBB......",
  "................",
];

const ACCENT = {
  cyan: "var(--ceefax-cyan)",
  magenta: "var(--ceefax-magenta)",
  red: "var(--ceefax-red)",
  green: "var(--ceefax-green)",
  blue: "var(--ceefax-blue)",
  white: "var(--ceefax-white)",
} as const;

function badge(
  number: number,
  name: string,
  color: keyof typeof ACCENT,
  emblem: [string, string, string, string],
): Badge {
  return {
    number,
    name,
    sprite: {
      map: [
        ...FRAME_TOP,
        ...emblem.map((row) => `.BGG${row}GGB.`),
        ...FRAME_BOTTOM,
      ],
      palette: {
        B: "var(--ceefax-black)",
        G: "var(--ceefax-yellow)",
        C: ACCENT[color],
      },
    },
  };
}

export const BADGES: Badge[] = [
  badge(1, "THUNDER", "cyan", ["..CC....", "...CC...", ".C..CC..", "CC..C..."]),
  badge(2, "ROCK", "magenta", ["...CC...", "..CCCC..", ".CCCCCC.", "..CCCC.."]),
  badge(3, "FLAME", "red", ["...CC...", "..CCCC..", "..CC.CC.", ".CCCCCC."]),
  badge(5, "LEAF", "green", [".CC.....", ".CCCC...", ".CC.CC..", "..C..C.."]),
  badge(6, "TIDE", "blue", ["CCCCCCCC", "..C....C", "CCCCCCCC", ".C....C."]),
  badge(7, "PSYCHE", "magenta", [
    "..CCCC..",
    ".CCC..C.",
    "CC..CCC.",
    "CCCC....",
  ]),
  badge(8, "FROST", "cyan", ["C..CC..C", ".C.CC.C.", "..CCCC..", ".C.CC.C."]),
  badge(9, "BELL", "white", ["..CCCC..", "...CC...", "..CCCC..", ".CCCCCC."]),
  badge(10, "TOXIC", "green", [".CCCCCC.", "C..CC..C", "C......C", "CCCCCCCC"]),
  badge(11, "SUNNY", "red", [".C.CC.C.", ".CCCCCC.", ".CCCCCC.", ".C.CC.C."]),
];

/** Badge for a gym leader player number, or undefined if none. */
export function badgeFor(playerNumber: number): Badge | undefined {
  return BADGES.find((b) => b.number === playerNumber);
}
