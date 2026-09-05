export interface PixelArt {
  /** Rows of pixel chars, each row the same length. `.` = transparent. */
  map: string[];
  /** Maps a pixel char to a CSS color. */
  palette: Record<string, string>;
}

export const TROPHY_SPRITE: PixelArt = {
  map: [
    ".......BBBBBBBBBBBBBB.......",
    ".....BBBBBBBBBBBBBBBBBB.....",
    ".....BGGGGGGGGGGGGGGGGB.....",
    "....BGGGGGGGGGGGGGGGGGGB....",
    "....BGGGGGGGHHHGGGGGGGGB....",
    "...BGGGGGGGGGGGGGGGGGGGGB...",
    "BBGBGGGGGGGGGGGGGGGGGGGGBGBB",
    "BGGBGGGGGGGGGGGGGGGGGGGGBGGB",
    "BGGBGGGGGGGGGGGGGGGGGGGGBGGB",
    "BGGBGGGGGGGGGGGGGGGGGGGGBGGB",
    "BBGBGGGGGGGGGGGGGGGGGGGGBGBB",
    "....BGGGGGGGGGGGGGGGGGGB....",
    ".....BGGGGGGGGGGGGGGGGB.....",
    ".....BBBBBBBBBBBBBBBBBB.....",
    "..........BBBBBBBB..........",
    "..........GGGGGGGG..........",
    ".........GGGGGGGGGG.........",
    ".......BBBBBBBBBBBBBB.......",
    "......BBBBBBBBBBBBBBBB......",
    ".....BBBBBBBBBBBBBBBBBB.....",
    ".....BGGGGGGGGGGGGGGGGB.....",
    ".....BBBBBBBBBBBBBBBBBB.....",
  ],
  palette: {
    B: "#000000",
    G: "#ffd700",
    H: "#fff6a8",
  },
};
