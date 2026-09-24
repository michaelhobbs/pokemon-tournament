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
  buyBall,
  useBall,
  buyRareCandy,
  depositToStorage,
  withdrawFromStorage,
  transferBetweenHumons,
  sellFromStorage,
  CURRENCY,
  SHINY_BASE,
  SHINY_PER_LEVEL,
  SHINY_CAP,
  shinyChance,
  SHINY_SELL_MULTIPLIER,
  RARE_CANDY_PRICE,
  loadState,
  MANAGER_STORAGE_KEY,
  TOWN_PLAYER_NUMBERS,
  setHumonSkin,
} from "./manager";
import { SECRET_HUMONS, SECRET_HUMON_KEYS } from "./hidden-humons";
import { POKEMON_TYPES } from "./pokemon";
import { POKEMON_STATS } from "./pokemon-stats";
import { badgeFor } from "./badges";
import { HOMETOWN_MARKERS } from "./hometown-map";
import type { CaughtMon } from "./manager";

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

describe("shinyChance", () => {
  it("grows with level", () => {
    expect(shinyChance(5)).toBeGreaterThan(shinyChance(0));
  });

  it("grows by SHINY_PER_LEVEL per level", () => {
    expect(shinyChance(1)).toBeCloseTo(SHINY_BASE + SHINY_PER_LEVEL);
  });

  it("caps at SHINY_CAP", () => {
    expect(shinyChance(100)).toBe(SHINY_CAP);
  });

  it("never exceeds SHINY_CAP", () => {
    expect(shinyChance(10_000)).toBeLessThanOrEqual(SHINY_CAP);
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
  it("records the current day once all gym leaders are defeated", () => {
    const state = defaultState();
    state.day = 7;
    state.defeated = [...BOSS_PLAYER_NUMBERS];
    recordVictoryIfComplete(state);
    expect(state.wonDay).toBe(7);
  });

  it("does not overwrite an existing wonDay", () => {
    const state = defaultState();
    state.day = 7;
    state.wonDay = 5;
    state.defeated = [...BOSS_PLAYER_NUMBERS];
    recordVictoryIfComplete(state);
    expect(state.wonDay).toBe(5);
  });

  it("does nothing before all gym leaders are beaten", () => {
    const state = defaultState();
    state.day = 4;
    state.defeated = [1];
    recordVictoryIfComplete(state);
    expect(state.wonDay).toBeNull();
  });

  it("starts with no defeated gyms", () => {
    const state = defaultState();
    expect(state.defeated).toEqual([]);
  });
});

describe("defaultState", () => {
  it("has version 4", () => {
    expect(defaultState().version).toBe(4);
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
    expect(state.items["joak-ball"]).toBe(0);
    expect(state.items["devil-ball"]).toBe(0);
    expect(state.items["cop-ball"]).toBe(0);
  });

  it("has an empty pokeputer", () => {
    const state = defaultState();
    expect(state.storage).toEqual([]);
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

describe("balls", () => {
  it("buyBall deducts currency and adds a ball", () => {
    const state = defaultState();
    state.currency = 500;
    const result = buyBall(state, "joak");
    expect(result.ok).toBe(true);
    expect(state.currency).toBe(0);
    expect(state.items["joak-ball"]).toBe(1);
  });

  it("buyBall fails without enough currency", () => {
    const state = defaultState();
    state.currency = 499;
    const result = buyBall(state, "joak");
    expect(result.ok).toBe(false);
    expect(state.items["joak-ball"]).toBe(0);
  });

  it("buyBall rejects a second ball of the same type", () => {
    const state = defaultState();
    state.currency = 1000;
    buyBall(state, "joak");
    const result = buyBall(state, "joak");
    expect(result.ok).toBe(false);
    expect(state.items["joak-ball"]).toBe(1);
  });

  it("useBall consumes a ball and catches the humon", () => {
    const state = defaultState();
    state.currency = 500;
    buyBall(state, "joak");
    const before = state.humons.length;
    const result = useBall(state, "joak");
    expect(result.ok).toBe(true);
    expect(state.items["joak-ball"]).toBe(0);
    expect(state.unlocked).toContain("joak");
    expect(state.humons.length).toBe(before + 1);
  });

  it("useBall gives the caught humon its full themed team", () => {
    const state = defaultState();
    state.currency = 2000;
    buyBall(state, "joak");
    buyBall(state, "devil");
    useBall(state, "joak");
    const joak = humonById(state, "joak");
    expect(joak?.team.map((m) => m.species)).toEqual(SECRET_HUMONS.joak.team);
    expect(joak?.team.every((m) => !m.shiny)).toBe(true);
    useBall(state, "devil");
    const devil = humonById(state, "devil");
    expect(devil?.team.map((m) => m.species)).toEqual(SECRET_HUMONS.devil.team);
  });

  it("useBall fails when missing the ball", () => {
    const state = defaultState();
    const result = useBall(state, "devil");
    expect(result.ok).toBe(false);
    expect(state.unlocked).not.toContain("devil");
  });

  it("buyRareCandy sells a candy for the listed price", () => {
    expect(RARE_CANDY_PRICE).toBe(150);
    const state = defaultState();
    state.currency = 150;
    const result = buyRareCandy(state);
    expect(result.ok).toBe(true);
    expect(state.currency).toBe(0);
    expect(state.items["rare-candy"]).toBe(1);
  });

  it("buyRareCandy fails without enough currency (and can be tried again)", () => {
    const state = defaultState();
    state.currency = 149;
    const result = buyRareCandy(state);
    expect(result.ok).toBe(false);
    expect(state.items["rare-candy"]).toBe(0);
    state.currency = 300;
    buyRareCandy(state);
    buyRareCandy(state);
    expect(state.items["rare-candy"]).toBe(2);
    expect(state.currency).toBe(0);
  });
});

describe("gym leader badges & hometown markers", () => {
  it("gives every gym leader a badge", () => {
    for (const number of BOSS_PLAYER_NUMBERS) {
      expect(badgeFor(number)).toBeDefined();
    }
  });

  it("gives every gym leader a marker on the hometown map", () => {
    const markerNumbers = HOMETOWN_MARKERS.map((m) => m.playerNumber);
    for (const number of BOSS_PLAYER_NUMBERS) {
      expect(markerNumbers).toContain(number);
    }
  });
});

describe("secret humon teams", () => {
  const pool = [
    ...new Set(TOWN_PLAYER_NUMBERS.flatMap((n) => townCatchPool(n))),
  ];
  const bst = (species: string): number => {
    const stats = POKEMON_STATS[species];
    if (!stats) return NaN;
    return (
      stats.HP.base +
      stats.Attack.base +
      stats.Defense.base +
      stats["Sp. Atk"].base +
      stats["Sp. Def"].base +
      stats.Speed.base
    );
  };

  it("gives every secret humon 6 unique pokémon from the tournament pool", () => {
    for (const key of SECRET_HUMON_KEYS) {
      const team = SECRET_HUMONS[key].team;
      expect(team).toHaveLength(MAX_TEAM_SIZE);
      expect(new Set(team).size).toBe(team.length);
      for (const species of team) expect(pool).toContain(species);
    }
  });

  it("does not share any pokémon between secret humon teams", () => {
    const seen = new Set<string>();
    for (const key of SECRET_HUMON_KEYS) {
      for (const species of SECRET_HUMONS[key].team) {
        expect(seen.has(species)).toBe(false);
        seen.add(species);
      }
    }
  });

  it("devilmon is all fire", () => {
    for (const species of SECRET_HUMONS.devil.team) {
      expect(POKEMON_TYPES[species]).toContain("Fire");
    }
  });

  it("copmon carries every ice pokémon in the pool plus police picks", () => {
    const icePool = pool.filter((species) =>
      POKEMON_TYPES[species].includes("Ice"),
    );
    expect(icePool).toHaveLength(4);
    for (const species of icePool) {
      expect(SECRET_HUMONS.cop.team).toContain(species);
    }
    expect(SECRET_HUMONS.cop.team).toContain("Arcanine");
    expect(SECRET_HUMONS.cop.team).toContain("Lucario");
  });

  it("joak gets the top-tier powerhouses of the pool, minus the Truant trap", () => {
    const maxTier = Math.max(...pool.map(bst));
    expect(maxTier).toBe(700);
    for (const species of SECRET_HUMONS.joak.team) {
      expect(bst(species)).toBeGreaterThanOrEqual(600);
    }
    for (const species of pool.filter((s) => bst(s) === maxTier)) {
      expect(SECRET_HUMONS.joak.team).toContain(species);
    }
    expect(SECRET_HUMONS.joak.team).not.toContain("Slaking");
  });
});

describe("loadState migration (v3 -> v4)", () => {
  const setLocalStorage = (json: string): void => {
    const store = new Map<string, string>();
    store.set(MANAGER_STORAGE_KEY, json);
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
      clear: () => {
        store.clear();
      },
      key: (i: number) => [...store.keys()][i] ?? null,
      get length() {
        return store.size;
      },
    };
  };
  const baseSave = {
    version: 3,
    day: 5,
    wonDay: null,
    defeated: [],
    currency: 0,
    storage: [],
    items: {
      "rare-candy": 0,
      "max-repel": 0,
      "joak-ball": 0,
      "devil-ball": 0,
      "cop-ball": 0,
    },
    visited: ["810"],
    unlocked: ["joak", "devil", "cop"],
    log: [],
    createdAt: 1,
  };

  it("backfills the themed team on pre-existing secret humons", () => {
    setLocalStorage(
      JSON.stringify({
        ...baseSave,
        humons: [
          {
            id: "joak",
            kind: "joak",
            level: 3,
            xp: 200,
            team: [],
            stamina: 100,
            maxStamina: 140,
          },
          {
            id: "cop",
            kind: "cop",
            level: 2,
            xp: 100,
            team: [],
            stamina: 80,
            maxStamina: 120,
          },
        ],
      }),
    );
    const state = loadState();
    expect(state.version).toBe(4);
    const joak = humonById(state, "joak");
    const cop = humonById(state, "cop");
    expect(joak?.team.map((m) => m.species)).toEqual(SECRET_HUMONS.joak.team);
    expect(cop?.team.map((m) => m.species)).toEqual(SECRET_HUMONS.cop.team);
    expect(joak?.team.every((m) => !m.shiny)).toBe(true);
  });

  it("leaves a deliberately emptied secret team alone on v4 saves", () => {
    setLocalStorage(
      JSON.stringify({
        ...baseSave,
        version: 4,
        humons: [
          {
            id: "joak",
            kind: "joak",
            level: 3,
            xp: 200,
            team: [],
            stamina: 100,
            maxStamina: 140,
          },
        ],
      }),
    );
    const state = loadState();
    expect(humonById(state, "joak")?.team).toEqual([]);
  });
});

const norm = (species: string): CaughtMon => ({ species, shiny: false });
const shiny = (species: string): CaughtMon => ({ species, shiny: true });
const mons = (...species: string[]): CaughtMon[] =>
  species.map((s) => ({ species: s, shiny: false }));
const fullTeam = (): CaughtMon[] =>
  Array.from({ length: MAX_TEAM_SIZE }, (_, i) => ({
    species: `Mon${i}`,
    shiny: false,
  }));

describe("pokeputer", () => {
  it("depositToStorage moves a mon off a team", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.team = mons("Pikachu", "Charizard");
    expect(state.storage).toEqual([]);
    const result = depositToStorage(state, "starter", norm("Pikachu"));
    expect(result.ok).toBe(true);
    expect(humon.team).toEqual(mons("Charizard"));
    expect(state.storage).toEqual(mons("Pikachu"));
  });

  it("depositToStorage rejects a mon not on the team", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.team = mons("Pikachu");
    const result = depositToStorage(state, "starter", norm("Charizard"));
    expect(result.ok).toBe(false);
    expect(state.storage).toEqual([]);
    expect(humon.team).toEqual(mons("Pikachu"));
  });

  it("depositToStorage rejects an unknown humon", () => {
    const state = defaultState();
    const result = depositToStorage(state, "nope", norm("Pikachu"));
    expect(result.ok).toBe(false);
  });

  it("withdrawFromStorage adds a mon to a team and empties storage", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    state.storage = mons("Pikachu");
    const result = withdrawFromStorage(state, "starter", norm("Pikachu"));
    expect(result.ok).toBe(true);
    expect(state.storage).toEqual([]);
    expect(humon.team).toEqual(mons("Pikachu"));
  });

  it("withdrawFromStorage rejects a full team", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.team = fullTeam();
    state.storage = mons("Pikachu");
    const result = withdrawFromStorage(state, "starter", norm("Pikachu"));
    expect(result.ok).toBe(false);
    expect(state.storage).toEqual(mons("Pikachu"));
  });

  it("withdrawFromStorage rejects a species already on the team", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.team = mons("Pikachu");
    state.storage = mons("Pikachu", "Charizard");
    const result = withdrawFromStorage(state, "starter", norm("Pikachu"));
    expect(result.ok).toBe(false);
    expect(state.storage).toEqual(mons("Pikachu", "Charizard"));
  });

  it("withdrawFromStorage rejects a mon not boxed", () => {
    const state = defaultState();
    const result = withdrawFromStorage(state, "starter", norm("Pikachu"));
    expect(result.ok).toBe(false);
  });

  it("transferBetweenHumons moves a mon between two humons", () => {
    const state = defaultState();
    const starter = humonById(state, "starter");
    if (!starter) return;
    state.humons.push({
      id: "second",
      kind: "boss",
      level: 1,
      xp: 0,
      team: [],
      stamina: BASE_STAMINA,
      maxStamina: BASE_STAMINA,
    });
    starter.team = mons("Pikachu", "Charizard");
    const result = transferBetweenHumons(
      state,
      "starter",
      "second",
      norm("Pikachu"),
    );
    expect(result.ok).toBe(true);
    expect(starter.team).toEqual(mons("Charizard"));
    expect(humonById(state, "second")?.team).toEqual(mons("Pikachu"));
  });

  it("transferBetweenHumons rejects moving to the same humon", () => {
    const state = defaultState();
    const result = transferBetweenHumons(
      state,
      "starter",
      "starter",
      norm("Pikachu"),
    );
    expect(result.ok).toBe(false);
  });

  it("transferBetweenHumons rejects a full target", () => {
    const state = defaultState();
    const starter = humonById(state, "starter");
    if (!starter) return;
    state.humons.push({
      id: "second",
      kind: "boss",
      level: 1,
      xp: 0,
      team: fullTeam(),
      stamina: BASE_STAMINA,
      maxStamina: BASE_STAMINA,
    });
    starter.team = mons("Pikachu");
    const result = transferBetweenHumons(
      state,
      "starter",
      "second",
      norm("Pikachu"),
    );
    expect(result.ok).toBe(false);
  });

  it("sellFromStorage pays CURRENCY.duplicate and removes a copy", () => {
    const state = defaultState();
    state.currency = 100;
    state.storage = mons("Pikachu", "Charizard");
    const result = sellFromStorage(state, norm("Pikachu"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.price).toBe(CURRENCY.duplicate);
    expect(state.currency).toBe(100 + CURRENCY.duplicate);
    expect(state.storage).toEqual(mons("Charizard"));
  });

  it("sellFromStorage rejects a mon not boxed", () => {
    const state = defaultState();
    const result = sellFromStorage(state, norm("Pikachu"));
    expect(result.ok).toBe(false);
    expect(state.currency).toBe(0);
  });
});

describe("shiny", () => {
  it("shiny flag survives deposit and withdraw", () => {
    const state = defaultState();
    const humon = humonById(state, "starter");
    if (!humon) return;
    humon.team = [shiny("Pikachu")];
    const deposited = depositToStorage(state, "starter", shiny("Pikachu"));
    expect(deposited.ok).toBe(true);
    expect(state.storage).toEqual([shiny("Pikachu")]);
    const withdrawn = withdrawFromStorage(state, "starter", shiny("Pikachu"));
    expect(withdrawn.ok).toBe(true);
    expect(humon.team).toEqual([shiny("Pikachu")]);
    expect(state.storage).toEqual([]);
  });

  it("shiny and normal copies of the same species coexist in the box", () => {
    const state = defaultState();
    state.storage = [norm("Pikachu"), shiny("Pikachu")];
    const result = withdrawFromStorage(state, "starter", norm("Pikachu"));
    expect(result.ok).toBe(true);
    expect(humonById(state, "starter")?.team).toEqual([norm("Pikachu")]);
    expect(state.storage).toEqual([shiny("Pikachu")]);
  });

  it("withdrawFromStorage picks the right copy (shiny vs normal)", () => {
    const state = defaultState();
    state.storage = [norm("Pikachu"), shiny("Pikachu")];
    const result = withdrawFromStorage(state, "starter", shiny("Pikachu"));
    expect(result.ok).toBe(true);
    expect(humonById(state, "starter")?.team).toEqual([shiny("Pikachu")]);
    expect(state.storage).toEqual([norm("Pikachu")]);
  });

  it("shiny flag survives transfer between humons", () => {
    const state = defaultState();
    const starter = humonById(state, "starter");
    if (!starter) return;
    state.humons.push({
      id: "second",
      kind: "boss",
      level: 1,
      xp: 0,
      team: [],
      stamina: BASE_STAMINA,
      maxStamina: BASE_STAMINA,
    });
    starter.team = [shiny("Pikachu")];
    const result = transferBetweenHumons(
      state,
      "starter",
      "second",
      shiny("Pikachu"),
    );
    expect(result.ok).toBe(true);
    expect(starter.team).toEqual([]);
    expect(humonById(state, "second")?.team).toEqual([shiny("Pikachu")]);
  });

  it("sellFromStorage pays double for a shiny", () => {
    const state = defaultState();
    state.currency = 100;
    state.storage = [shiny("Pikachu")];
    const result = sellFromStorage(state, shiny("Pikachu"));
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.price).toBe(CURRENCY.duplicate * SHINY_SELL_MULTIPLIER);
    expect(state.currency).toBe(
      100 + CURRENCY.duplicate * SHINY_SELL_MULTIPLIER,
    );
    expect(state.storage).toEqual([]);
  });

  it("sells the matching copy for its own price", () => {
    const state = defaultState();
    state.currency = 0;
    state.storage = [norm("Pikachu"), shiny("Pikachu")];
    sellFromStorage(state, norm("Pikachu"));
    sellFromStorage(state, shiny("Pikachu"));
    expect(state.currency).toBe(
      CURRENCY.duplicate * (1 + SHINY_SELL_MULTIPLIER),
    );
    expect(state.storage).toEqual([]);
  });
});

describe("setHumonSkin", () => {
  it("stores a valid skin and logs it", () => {
    const state = defaultState();
    const result = setHumonSkin(state, "champion");
    expect(result.ok).toBe(true);
    expect(state.cosmetic).toEqual({ skin: "champion" });
    expect(state.log[0].text).toContain("CHAMPION");
  });

  it("rejects an unknown skin without touching cosmetic", () => {
    const state = defaultState();
    state.cosmetic = { skin: "champion" };
    const result = setHumonSkin(state, "bogus");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/NO SUCH LOOK/);
    expect(state.cosmetic).toEqual({ skin: "champion" });
  });

  it("is a no-op gate until the game is won", () => {
    const state = defaultState();
    expect(state.cosmetic).toBeUndefined();
  });
});
