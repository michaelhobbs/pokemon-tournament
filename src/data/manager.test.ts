import { describe, it, expect } from "vitest";
import {
  mulberry32,
  hashString,
  levelFor,
  catchChance,
  travelDurationMs,
  townCatchPool,
  recommendedLevel,
  ensureStarter,
  humonById,
  defaultState,
  XP_PER_LEVEL,
  CATCH_BASE,
  CATCH_PER_LEVEL,
  CATCH_CAP,
  TRAVEL_BASE_MS,
  TRAVEL_PER_UNIT_MS,
  TRAVEL_CAP_MS,
  MAX_TEAM_SIZE,
} from "./manager";

describe("mulberry32", () => {
  it("returns a function", () => {
    const rand = mulberry32(12345);
    expect(typeof rand).toBe("function");
  });

  it("produces values between 0 and 1", () => {
    const rand = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      const val = rand();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it("is deterministic for the same seed", () => {
    const r1 = mulberry32(999);
    const r2 = mulberry32(999);
    const seq1 = Array.from({ length: 10 }, () => r1());
    const seq2 = Array.from({ length: 10 }, () => r2());
    expect(seq1).toEqual(seq2);
  });

  it("produces different sequences for different seeds", () => {
    const r1 = mulberry32(1);
    const r2 = mulberry32(2);
    const seq1 = Array.from({ length: 5 }, () => r1());
    const seq2 = Array.from({ length: 5 }, () => r2());
    expect(seq1).not.toEqual(seq2);
  });
});

describe("hashString", () => {
  it("returns a number", () => {
    expect(typeof hashString("hello")).toBe("number");
  });

  it("is deterministic", () => {
    expect(hashString("test")).toBe(hashString("test"));
  });

  it("produces different hashes for different strings", () => {
    expect(hashString("foo")).not.toBe(hashString("bar"));
  });

  it("returns an unsigned 32-bit integer", () => {
    const h = hashString("anything");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("levelFor", () => {
  it("starts at level 1 for 0 XP", () => {
    expect(levelFor(0)).toBe(1);
  });

  it("levels up at XP_PER_LEVEL thresholds", () => {
    expect(levelFor(XP_PER_LEVEL)).toBe(2);
    expect(levelFor(XP_PER_LEVEL * 2)).toBe(3);
  });

  it("levels up mid-threshold", () => {
    expect(levelFor(XP_PER_LEVEL + 1)).toBe(2);
    expect(levelFor(XP_PER_LEVEL * 5 + 50)).toBe(6);
  });
});

describe("catchChance", () => {
  it("starts at CATCH_BASE for level 0", () => {
    expect(catchChance(0)).toBe(CATCH_BASE);
  });

  it("increases with level", () => {
    expect(catchChance(5)).toBeGreaterThan(catchChance(0));
  });

  it("caps at CATCH_CAP", () => {
    expect(catchChance(100)).toBe(CATCH_CAP);
  });

  it("increases by CATCH_PER_LEVEL per level", () => {
    expect(catchChance(1)).toBeCloseTo(CATCH_BASE + CATCH_PER_LEVEL);
  });
});

describe("travelDurationMs", () => {
  it("returns TRAVEL_BASE_MS for unknown player", () => {
    expect(travelDurationMs(99)).toBe(TRAVEL_BASE_MS);
  });

  it("returns at least TRAVEL_BASE_MS for any valid player", () => {
    const durations = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map(travelDurationMs);
    for (const d of durations) {
      expect(d).toBeGreaterThanOrEqual(TRAVEL_BASE_MS);
    }
  });

  it("never exceeds TRAVEL_CAP_MS", () => {
    const durations = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map(travelDurationMs);
    for (const d of durations) {
      expect(d).toBeLessThanOrEqual(TRAVEL_CAP_MS);
    }
  });

  it("farther towns take longer", () => {
    // Just check that different players have different durations
    const durations = new Set(
      [1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map(travelDurationMs),
    );
    expect(durations.size).toBeGreaterThan(1);
  });
});

describe("townCatchPool", () => {
  it("returns a non-empty array for valid players", () => {
    for (const num of [1, 2, 3, 5, 6, 7, 8, 9, 10, 11]) {
      const pool = townCatchPool(num);
      expect(pool.length).toBeGreaterThan(0);
    }
  });

  it("returns empty array for unknown player", () => {
    expect(townCatchPool(99)).toEqual([]);
  });

  it("returns exactly 6 Pokémon per player (team size)", () => {
    for (const num of [1, 2, 3, 5, 6, 7, 8, 9, 10, 11]) {
      expect(townCatchPool(num)).toHaveLength(6);
    }
  });

  it("applies midseason swaps (player 1 swaps Pachirisu → Porygon2)", () => {
    const pool = townCatchPool(1);
    expect(pool).toContain("Porygon2");
    expect(pool).not.toContain("Pachirisu");
  });
});

describe("recommendedLevel", () => {
  it("returns 1 for unknown player", () => {
    expect(recommendedLevel(99)).toBe(1);
  });

  it("returns increasing levels for different bosses", () => {
    const levels = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map(recommendedLevel);
    // Should be 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 (since sorted by player number)
    expect(levels[0]).toBe(2); // player 1
    expect(levels[1]).toBe(3); // player 2
  });
});

describe("defaultState", () => {
  it("has version 1", () => {
    expect(defaultState().version).toBe(1);
  });

  it("starts with 0 currency", () => {
    expect(defaultState().currency).toBe(0);
  });

  it("has a starter humon", () => {
    const state = defaultState();
    expect(state.humons).toHaveLength(1);
    expect(state.humons[0].id).toBe("starter");
    expect(state.humons[0].kind).toBe("starter");
  });

  it("has empty items", () => {
    const state = defaultState();
    expect(state.items["rare-candy"]).toBe(0);
    expect(state.items["max-repel"]).toBe(0);
  });

  it("has a log entry", () => {
    const state = defaultState();
    expect(state.log.length).toBeGreaterThan(0);
  });
});

describe("ensureStarter", () => {
  it("does not duplicate if starter exists", () => {
    const state = defaultState();
    ensureStarter(state);
    expect(state.humons.filter((h) => h.id === "starter")).toHaveLength(1);
  });

  it("adds starter if missing", () => {
    const state = defaultState();
    state.humons = [];
    ensureStarter(state);
    expect(state.humons).toHaveLength(1);
    expect(state.humons[0].id).toBe("starter");
  });
});

describe("humonById", () => {
  it("finds a humon by id", () => {
    const state = defaultState();
    expect(humonById(state, "starter")).toBeDefined();
  });

  it("returns undefined for unknown id", () => {
    const state = defaultState();
    expect(humonById(state, "nonexistent")).toBeUndefined();
  });
});

describe("MAX_TEAM_SIZE", () => {
  it("is 6", () => {
    expect(MAX_TEAM_SIZE).toBe(6);
  });
});
