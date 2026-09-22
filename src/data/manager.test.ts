import { describe, it, expect } from "vitest";
import {
  mulberry32,
  hashString,
  levelFor,
  catchChance,
  townCatchPool,
  recommendedLevel,
  ensureStarter,
  humonById,
  defaultState,
  maxStaminaFor,
  staminaCost,
  advanceDay,
  startAction,
  startGymAction,
  recordVictoryIfComplete,
  XP_PER_LEVEL,
  CATCH_BASE,
  CATCH_PER_LEVEL,
  CATCH_CAP,
  MAX_TEAM_SIZE,
  BASE_STAMINA,
  STAMINA_PER_LEVEL,
  TRAIN_STAMINA,
  TRAVEL_STAMINA,
  GYM_STAMINA,
  TRAIN_XP,
  BOSS_PLAYER_NUMBERS,
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

describe("maxStaminaFor", () => {
  it("starts at 100 stamina for level 1", () => {
    expect(maxStaminaFor(1)).toBe(BASE_STAMINA);
  });

  it("gains STAMINA_PER_LEVEL each level", () => {
    expect(maxStaminaFor(2)).toBe(BASE_STAMINA + STAMINA_PER_LEVEL);
    expect(maxStaminaFor(5)).toBe(BASE_STAMINA + STAMINA_PER_LEVEL * 4);
  });

  it("increases with higher levels", () => {
    expect(maxStaminaFor(10)).toBeGreaterThan(maxStaminaFor(5));
  });
});

describe("staminaCost", () => {
  it("costs TRAIN_STAMINA to train", () => {
    expect(staminaCost("train")).toBe(TRAIN_STAMINA);
  });

  it("costs TRAVEL_STAMINA to travel", () => {
    expect(staminaCost("travel")).toBe(TRAVEL_STAMINA);
  });

  it("costs GYM_STAMINA to challenge a gym", () => {
    expect(staminaCost("gym")).toBe(GYM_STAMINA);
  });
});

describe("startAction (immediate)", () => {
  it("consumes stamina and grants XP when training", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    expect(humon).toBeDefined();
    if (!humon) return;
    const staminaBefore = humon.stamina;
    const result = startAction(state, "starter", "train");
    expect(result.ok).toBe(true);
    expect(humon.stamina).toBe(staminaBefore - TRAIN_STAMINA);
    expect(humon.xp).toBe(TRAIN_XP);
    expect(humon.level).toBe(levelFor(TRAIN_XP));
  });

  it("rejects training when stamina is too low", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.stamina = TRAIN_STAMINA - 1;
    const result = startAction(state, "starter", "train");
    expect(result.ok).toBe(false);
    expect(humon.stamina).toBe(TRAIN_STAMINA - 1);
    expect(humon.xp).toBe(0);
  });

  it("allows free actions without consuming stamina", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    const staminaBefore = humon.stamina;
    const result = startAction(state, "starter", "train", undefined, {
      free: true,
    });
    expect(result.ok).toBe(true);
    expect(humon.stamina).toBe(staminaBefore);
    expect(humon.xp).toBe(TRAIN_XP);
  });

  it("can train until the daily stamina is spent", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.stamina = TRAIN_STAMINA * 2;
    expect(startAction(state, "starter", "train").ok).toBe(true);
    expect(startAction(state, "starter", "train").ok).toBe(true);
    expect(startAction(state, "starter", "train").ok).toBe(false);
  });

  it("rejects travel to an unknown town", () => {
    const state = defaultState();
    const result = startAction(state, "starter", "travel", 99);
    expect(result.ok).toBe(false);
  });
});

describe("advanceDay", () => {
  it("increments the day counter", () => {
    const state = defaultState();
    const day = state.day;
    expect(advanceDay(state)).toBe(day + 1);
    expect(state.day).toBe(day + 1);
  });

  it("restores full stamina to the roster", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.stamina = 5;
    advanceDay(state);
    expect(humon.stamina).toBeGreaterThan(5);
    expect(humon.stamina).toBe(humon.maxStamina);
  });

  it("refreshes maxStamina to match the current level", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.level = 4;
    humon.stamina = 1;
    advanceDay(state);
    expect(humon.maxStamina).toBe(maxStaminaFor(4));
    expect(humon.stamina).toBe(maxStaminaFor(4));
  });
});

describe("recordVictoryIfComplete", () => {
  it("records the current day once all gym leaders are in the squad", () => {
    const state = defaultState();
    state.day = 7;
    for (const number of BOSS_PLAYER_NUMBERS) {
      state.humons.push({
        id: `boss-${number}`,
        kind: "boss",
        level: 1,
        xp: 0,
        team: [],
        stamina: maxStaminaFor(1),
        maxStamina: maxStaminaFor(1),
      });
    }
    recordVictoryIfComplete(state);
    expect(state.wonDay).toBe(7);
  });

  it("does not overwrite an existing wonDay", () => {
    const state = defaultState();
    state.day = 7;
    state.wonDay = 5;
    for (const number of BOSS_PLAYER_NUMBERS) {
      state.humons.push({
        id: `boss-${number}`,
        kind: "boss",
        level: 1,
        xp: 0,
        team: [],
        stamina: maxStaminaFor(1),
        maxStamina: maxStaminaFor(1),
      });
    }
    recordVictoryIfComplete(state);
    expect(state.wonDay).toBe(5);
  });

  it("does nothing before all gym leaders are beaten", () => {
    const state = defaultState();
    state.day = 4;
    state.humons.push({
      id: "boss-1",
      kind: "boss",
      level: 1,
      xp: 0,
      team: [],
      stamina: maxStaminaFor(1),
      maxStamina: maxStaminaFor(1),
    });
    recordVictoryIfComplete(state);
    expect(state.wonDay).toBeNull();
  });
});

describe("defaultState", () => {
  it("has version 2", () => {
    expect(defaultState().version).toBe(2);
  });

  it("starts on day 1", () => {
    expect(defaultState().day).toBe(1);
  });

  it("has no win recorded", () => {
    expect(defaultState().wonDay).toBeNull();
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

  it("starts the starter at full base stamina", () => {
    const state = defaultState();
    expect(state.humons[0].stamina).toBe(BASE_STAMINA);
    expect(state.humons[0].maxStamina).toBe(BASE_STAMINA);
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
