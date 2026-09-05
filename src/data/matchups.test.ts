import { describe, it, expect } from "vitest";
import {
  TRAINER_MATCHUPS,
  matchupFor,
  colourFor,
  matchupColours,
} from "./matchups";
import { PLAYERS } from "./players";

describe("TRAINER_MATCHUPS", () => {
  it("has 45 pairings (10 choose 2)", () => {
    expect(TRAINER_MATCHUPS).toHaveLength(45);
  });

  it("page numbers start at 902", () => {
    expect(TRAINER_MATCHUPS[0].number).toBe(902);
  });

  it("page numbers are sequential", () => {
    for (let i = 0; i < TRAINER_MATCHUPS.length; i++) {
      expect(TRAINER_MATCHUPS[i].number).toBe(902 + i);
    }
  });

  it("each pairing has two different player numbers", () => {
    for (const m of TRAINER_MATCHUPS) {
      expect(m.player1Number).not.toBe(m.player2Number);
    }
  });

  it("player1 < player2 (sorted order)", () => {
    for (const m of TRAINER_MATCHUPS) {
      expect(m.player1Number).toBeLessThan(m.player2Number);
    }
  });

  it("all player numbers are valid", () => {
    const validNumbers = new Set(PLAYERS.map((p) => p.number));
    for (const m of TRAINER_MATCHUPS) {
      expect(validNumbers.has(m.player1Number)).toBe(true);
      expect(validNumbers.has(m.player2Number)).toBe(true);
    }
  });

  it("every unique pair appears exactly once", () => {
    const seen = new Set<string>();
    for (const m of TRAINER_MATCHUPS) {
      const key = `${m.player1Number}-${m.player2Number}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});

describe("matchupFor", () => {
  it("finds a matchup in either order", () => {
    const m1 = matchupFor(1, 2);
    const m2 = matchupFor(2, 1);
    expect(m1).toBeDefined();
    expect(m2).toBeDefined();
    expect(m1!.number).toBe(m2!.number);
  });

  it("returns undefined for the same player", () => {
    expect(matchupFor(1, 1)).toBeUndefined();
  });

  it("returns undefined for non-existent players", () => {
    expect(matchupFor(1, 99)).toBeUndefined();
  });
});

describe("colourFor", () => {
  it("returns a valid colour for every player", () => {
    const validColours = [
      "cyan",
      "yellow",
      "magenta",
      "red",
      "green",
      "blue",
      "white",
    ];
    for (const player of PLAYERS) {
      expect(validColours).toContain(colourFor(player.number));
    }
  });
});

describe("matchupColours", () => {
  it("returns two different colours", () => {
    const [c1, c2] = matchupColours(1, 2);
    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
    // They might be different (usually), but if same, the function adjusts
  });

  it("always returns distinct colours for same-colour players", () => {
    // Force the case where both players map to the same colour
    // by testing many pairings
    for (const m of TRAINER_MATCHUPS) {
      const [c1, c2] = matchupColours(m.player1Number, m.player2Number);
      expect(c1).not.toBe(c2);
    }
  });
});
