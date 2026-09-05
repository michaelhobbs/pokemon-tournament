import { describe, it, expect } from "vitest";
import { MIDSEASON_SWAPS, swapsFor, applySwaps } from "./midseason";

describe("MIDSEASON_SWAPS", () => {
  it("has swaps for 7 players", () => {
    expect(Object.keys(MIDSEASON_SWAPS)).toHaveLength(7);
  });

  it("no player has more than 2 swaps", () => {
    for (const swaps of Object.values(MIDSEASON_SWAPS)) {
      expect(swaps.length).toBeLessThanOrEqual(2);
    }
  });

  it("every swap has a non-empty removed and replacement", () => {
    for (const swaps of Object.values(MIDSEASON_SWAPS)) {
      for (const swap of swaps) {
        expect(swap.removed.length).toBeGreaterThan(0);
        expect(swap.replacement.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("swapsFor", () => {
  it("returns swaps for a player with swaps", () => {
    const swaps = swapsFor(7);
    expect(swaps.length).toBe(2);
  });

  it("returns empty array for player without swaps", () => {
    expect(swapsFor(2)).toEqual([]);
    expect(swapsFor(99)).toEqual([]);
  });
});

describe("applySwaps", () => {
  it("replaces removed Pokémon with replacements", () => {
    const team = ["Chansey", "Scizor", "Slowbro"];
    const swaps = [{ removed: "Chansey", replacement: "Gardevoir" }];
    const result = applySwaps(team, swaps);
    expect(result).toEqual(["Gardevoir", "Scizor", "Slowbro"]);
  });

  it("leaves unswapped Pokémon unchanged", () => {
    const team = ["Scizor", "Greninja"];
    const result = applySwaps(team, []);
    expect(result).toEqual(["Scizor", "Greninja"]);
  });

  it("handles multiple swaps", () => {
    const team = ["A", "B", "C"];
    const swaps = [
      { removed: "A", replacement: "X" },
      { removed: "C", replacement: "Y" },
    ];
    expect(applySwaps(team, swaps)).toEqual(["X", "B", "Y"]);
  });

  it("preserves team length", () => {
    const team = [
      "Pachirisu",
      "Hisuian Typhlosion",
      "Murkrow",
      "Torkoal",
      "Hisuian Lilligant",
      "Hisuian Goodra",
    ];
    const swaps = [{ removed: "Pachirisu", replacement: "Porygon2" }];
    expect(applySwaps(team, swaps)).toHaveLength(team.length);
  });
});
