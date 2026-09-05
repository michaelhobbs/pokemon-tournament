import type { PixelArt } from "./trophy";

/** Persisted key for whether the visitor has caught a HUMON. */
export const HUMON_STORAGE_KEY = "pkm:humon-caught";

export const HUMON: PixelArt = {
  map: [
    "......BBBB......",
    "...BHHHHHHHHB...",
    "...BHHHHHHHHB...",
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
  ],
  palette: {
    B: "#000000",
    H: "#6b4226",
    K: "#ffcc99",
    O: "#ff00ff",
    W: "#ffffff",
  },
};

export function readCaught(): boolean {
  try {
    return localStorage.getItem(HUMON_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeCaught(caught: boolean): void {
  try {
    if (caught) {
      localStorage.setItem(HUMON_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(HUMON_STORAGE_KEY);
    }
  } catch {
    // storage unavailable — keep in-memory state only
  }
}
