import type { PixelArt } from "./trophy";
import type { BattleTurn } from "../lib/battle-log";
import type { BattleResult } from "../lib/battle";
import { HUMON } from "./humon";
import { PLAYERS, findPlayer } from "./players";
import { spriteFor } from "./trainer-sprites";
import { applySwaps, swapsFor } from "./midseason";
import {
  SECRET_HUMONS,
  BALL_NAMES,
  type SecretHumonKey,
} from "./hidden-humons";

export const MANAGER_STORAGE_KEY = "pkm:manager:v2";

export const MAX_TEAM_SIZE = 6;
export const XP_PER_LEVEL = 100;
export const RARE_CANDY_XP = 50;
export const LOG_LIMIT = 8;

export const STARTING_DAY = 1;
export const BASE_STAMINA = 100;
export const STAMINA_PER_LEVEL = 20;
export const TRAIN_STAMINA = 20;
export const TRAVEL_STAMINA = 40;
export const GYM_STAMINA = 50;

export const TRAIN_XP = 40;
export const TRAVEL_XP = 25;
export const GYM_XP = 60;

export const CATCH_BASE = 0.6;
export const CATCH_PER_LEVEL = 0.02;
export const CATCH_CAP = 0.9;
export const RARE_CANDY_DROP = 0.08;
export const MAX_REPEL_DROP = 0.07;

export const CURRENCY = {
  train: { min: 20, max: 40 },
  travel: { min: 30, max: 80 },
  gym: { min: 150, max: 300 },
  duplicate: 45,
} as const;

export type HumonKind = "starter" | "boss" | SecretHumonKey;
export type ActionKind = "train" | "travel" | "gym";
export type NonBattleActionKind = Exclude<ActionKind, "gym">;

export interface Humon {
  id: string;
  kind: HumonKind;
  level: number;
  xp: number;
  team: string[];
  stamina: number;
  maxStamina: number;
  lastBattle?: { win: boolean; turns: BattleTurn[]; opponent: string };
}

export interface LogEntry {
  at: number;
  text: string;
}

export interface Items {
  "rare-candy": number;
  "max-repel": number;
  "joak-ball": number;
  "devil-ball": number;
  "cop-ball": number;
}

export type BallItem = "joak-ball" | "devil-ball" | "cop-ball";

export function ballItemFor(key: SecretHumonKey): BallItem {
  if (key === "joak") return "joak-ball";
  if (key === "devil") return "devil-ball";
  return "cop-ball";
}

export interface GameState {
  version: 2;
  day: number;
  /** The day all gym leaders were beaten, or null while still playing. */
  wonDay: number | null;
  /** Gym leader numbers that have been defeated (badges). */
  defeated: number[];
  currency: number;
  humons: Humon[];
  items: Items;
  visited: string[];
  unlocked: SecretHumonKey[];
  log: LogEntry[];
  createdAt: number;
}

export const BOSS_PLAYER_NUMBERS: number[] = PLAYERS.map(
  (player) => player.number,
);
export const TOWN_PLAYER_NUMBERS: number[] = PLAYERS.map(
  (player) => player.number,
);

export const HIDDEN_PAGE_NUMBERS: string[] = [
  "000",
  "123",
  "404",
  "666",
  "999",
];

/** Deterministic PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function randInt(rand: () => number, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

export function levelFor(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/** Maximum stamina for a humon of the given level (100 base, +20/level). */
export function maxStaminaFor(level: number): number {
  return BASE_STAMINA + (level - 1) * STAMINA_PER_LEVEL;
}

export function staminaCost(kind: ActionKind): number {
  switch (kind) {
    case "train":
      return TRAIN_STAMINA;
    case "travel":
      return TRAVEL_STAMINA;
    case "gym":
      return GYM_STAMINA;
  }
}

export function log(state: GameState, text: string): void {
  state.log.unshift({ at: Date.now(), text });
  if (state.log.length > LOG_LIMIT) state.log.length = LOG_LIMIT;
}

function makeHumon(kind: HumonKind, id: string): Humon {
  return {
    id,
    kind,
    level: 1,
    xp: 0,
    team: [],
    stamina: maxStaminaFor(1),
    maxStamina: maxStaminaFor(1),
  };
}

function recalcLevel(humon: Humon): void {
  humon.level = levelFor(humon.xp);
  humon.maxStamina = maxStaminaFor(humon.level);
}

export function humonById(state: GameState, id: string): Humon | undefined {
  return state.humons.find((humon) => humon.id === id);
}

export function ensureStarter(state: GameState): void {
  if (!humonById(state, "starter")) {
    state.humons.unshift(makeHumon("starter", "starter"));
  }
}

export function humonName(humon: Humon): string {
  if (humon.kind === "starter") return "HUMON";
  if (humon.kind === "boss") {
    const number = Number(humon.id.split("-")[1]);
    return findPlayer(number)?.name ?? humon.id.toUpperCase();
  }
  return SECRET_HUMONS[humon.kind].name;
}

export function humonSprite(humon: Humon): PixelArt {
  if (humon.kind === "starter") return HUMON;
  if (humon.kind === "boss") {
    const number = Number(humon.id.split("-")[1]);
    return spriteFor(number);
  }
  return SECRET_HUMONS[humon.kind].sprite;
}

export function kindLabel(humon: Humon): string {
  if (humon.kind === "starter") return "STARTER";
  if (humon.kind === "boss") return "GYM LEADER";
  return SECRET_HUMONS[humon.kind].title;
}

export function defaultState(): GameState {
  const state: GameState = {
    version: 2,
    day: STARTING_DAY,
    wonDay: null,
    defeated: [],
    currency: 0,
    humons: [],
    items: {
      "rare-candy": 0,
      "max-repel": 0,
      "joak-ball": 0,
      "devil-ball": 0,
      "cop-ball": 0,
    },
    visited: [],
    unlocked: [],
    log: [],
    createdAt: Date.now(),
  };
  ensureStarter(state);
  log(state, "HUMON MANAGER ONLINE");
  return state;
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(MANAGER_STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<GameState> & {
      humons?: Array<Partial<Humon> & { id: string; kind: HumonKind }>;
    };
    if (!parsed || typeof parsed !== "object") return defaultState();
    const humons = Array.isArray(parsed.humons)
      ? parsed.humons.map((h): Humon => {
          const level = typeof h.level === "number" ? h.level : 1;
          const maxStamina =
            typeof h.maxStamina === "number"
              ? h.maxStamina
              : maxStaminaFor(level);
          return {
            id: h.id,
            kind: h.kind,
            level,
            xp: typeof h.xp === "number" ? h.xp : 0,
            team: Array.isArray(h.team) ? h.team : [],
            // v1 saves had no stamina fields; start fresh-levelled but at full.
            stamina:
              typeof h.stamina === "number"
                ? Math.min(h.stamina, maxStamina)
                : maxStamina,
            maxStamina,
            lastBattle: h.lastBattle,
          };
        })
      : [];
    const state: GameState = {
      version: 2,
      day:
        typeof parsed.day === "number" && parsed.day >= STARTING_DAY
          ? parsed.day
          : STARTING_DAY,
      wonDay: typeof parsed.wonDay === "number" ? parsed.wonDay : null,
      currency: typeof parsed.currency === "number" ? parsed.currency : 0,
      humons,
      defeated: (() => {
        const seen = new Set(
          Array.isArray(parsed.defeated)
            ? parsed.defeated.filter((n): n is number => typeof n === "number")
            : [],
        );
        for (const h of humons) {
          if (h.kind === "boss") {
            const n = Number(h.id.split("-")[1]);
            if (!Number.isNaN(n)) seen.add(n);
          }
        }
        return [...seen];
      })(),
      items: {
        "rare-candy":
          typeof parsed.items?.["rare-candy"] === "number"
            ? parsed.items["rare-candy"]
            : 0,
        "max-repel":
          typeof parsed.items?.["max-repel"] === "number"
            ? parsed.items["max-repel"]
            : 0,
        "joak-ball":
          typeof parsed.items?.["joak-ball"] === "number"
            ? parsed.items["joak-ball"]
            : 0,
        "devil-ball":
          typeof parsed.items?.["devil-ball"] === "number"
            ? parsed.items["devil-ball"]
            : 0,
        "cop-ball":
          typeof parsed.items?.["cop-ball"] === "number"
            ? parsed.items["cop-ball"]
            : 0,
      },
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
      log: Array.isArray(parsed.log) ? parsed.log : [],
      createdAt:
        typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now(),
    };
    ensureStarter(state);
    return state;
  } catch {
    return defaultState();
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(MANAGER_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — keep in-memory state only
  }
}

export function markVisited(state: GameState, page: string): void {
  if (!state.visited.includes(page)) {
    state.visited.push(page);
  }
}

/** Hometown catch pool = the trainer's current team, mid-season swaps applied. */
export function townCatchPool(playerNumber: number): string[] {
  const player = findPlayer(playerNumber);
  if (!player) return [];
  return applySwaps(player.team, swapsFor(playerNumber));
}

export function bossTeamFor(playerNumber: number): string[] {
  return townCatchPool(playerNumber);
}

export function recommendedLevel(playerNumber: number): number {
  const index = BOSS_PLAYER_NUMBERS.indexOf(playerNumber);
  return index === -1 ? 1 : 2 + index;
}

export function catchChance(level: number): number {
  return Math.min(CATCH_CAP, CATCH_BASE + level * CATCH_PER_LEVEL);
}

function newSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
}

function spendStamina(
  humon: Humon,
  kind: ActionKind,
  free: boolean,
): { ok: true } | { ok: false; error: string } {
  const cost = staminaCost(kind);
  if (!free && humon.stamina < cost) {
    return { ok: false, error: `${humonName(humon)} NEEDS ${cost} STAMINA` };
  }
  if (!free) humon.stamina -= cost;
  return { ok: true };
}

/** Perform a train or travel action immediately, consuming stamina. */
export function startAction(
  state: GameState,
  humonId: string,
  kind: NonBattleActionKind,
  target?: number,
  opts?: { free?: boolean },
): { ok: true } | { ok: false; error: string } {
  const humon = humonById(state, humonId);
  if (!humon) return { ok: false, error: "HUMON NOT FOUND" };
  if (kind === "travel") {
    if (target === undefined) return { ok: false, error: "PICK A TOWN FIRST" };
    const player = findPlayer(target);
    if (!player) return { ok: false, error: "UNKNOWN TOWN" };
  }
  const spend = spendStamina(humon, kind, opts?.free ?? false);
  if (!spend.ok) return spend;
  if (kind === "train") {
    resolveTrain(state, humon, newSeed());
    return { ok: true };
  }
  resolveTravel(state, humon, newSeed(), target as number);
  return { ok: true };
}

/**
 * Challenge a gym leader, pre-simulating the battle via @pkmn/sim and
 * resolving it immediately. Returns whether this win completed the game.
 */
export async function startGymAction(
  state: GameState,
  humonId: string,
  bossNumber: number,
  opts?: { free?: boolean },
): Promise<
  | { ok: true; win: boolean; log: string[]; turns: BattleTurn[]; won: boolean }
  | { ok: false; error: string }
> {
  const humon = humonById(state, humonId);
  if (!humon) return { ok: false, error: "HUMON NOT FOUND" };
  const player = findPlayer(bossNumber);
  if (!player) return { ok: false, error: "UNKNOWN GYM" };
  if (humon.team.length === 0)
    return { ok: false, error: `${humonName(humon)} NEEDS A TEAM FIRST` };
  const rec = recommendedLevel(bossNumber);
  if (humon.level < rec)
    return { ok: false, error: `GYM ${player.number} REQUIRES LV ${rec}` };
  const spend = spendStamina(humon, "gym", opts?.free ?? false);
  if (!spend.ok) return spend;

  const { runBattle } = await import("../lib/battle");
  const { parseBattleLog } = await import("../lib/battle-log");
  const seed = newSeed();
  let result: BattleResult;
  try {
    result = await runBattle(humon.team, bossTeamFor(bossNumber), seed);
  } catch {
    // Refund stamina if the simulation itself failed.
    if (!opts?.free) humon.stamina += staminaCost("gym");
    return { ok: false, error: "BATTLE SIMULATION FAILED" };
  }
  const turns = parseBattleLog(result.log, result.items);
  const won = resolveGym(state, humon, result.win, turns, bossNumber, seed);
  return { ok: true, win: result.win, log: result.log, turns, won };
}

/** Advance to the next day. Full stamina for the whole roster. */
export function advanceDay(state: GameState): number {
  state.day += 1;
  for (const humon of state.humons) {
    humon.maxStamina = maxStaminaFor(humon.level);
    humon.stamina = humon.maxStamina;
  }
  log(state, `DAY ${state.day} - ROSTER SLEPT. STAMINA RESTORED.`);
  return state.day;
}

function resolveTrain(state: GameState, humon: Humon, seed: number): void {
  const rand = mulberry32(hashString(`${humon.id}:train:${seed}`));
  humon.xp += TRAIN_XP;
  recalcLevel(humon);
  const pay = randInt(rand, CURRENCY.train.min, CURRENCY.train.max);
  state.currency += pay;
  log(state, `${humonName(humon)} TRAINS. +${TRAIN_XP} XP +¥${pay}`);
  if (rand() < RARE_CANDY_DROP) {
    state.items["rare-candy"] += 1;
    log(state, "RARE CANDY FOUND!");
  }
}

function resolveTravel(
  state: GameState,
  humon: Humon,
  seed: number,
  target: number,
): void {
  const player = findPlayer(target);
  const townName = player?.hometown ?? "???";
  const rand = mulberry32(hashString(`${humon.id}:travel:${seed}`));
  humon.xp += TRAVEL_XP;
  recalcLevel(humon);
  const pay = randInt(rand, CURRENCY.travel.min, CURRENCY.travel.max);
  state.currency += pay;
  log(
    state,
    `${humonName(humon)} VISITS ${townName}. +${TRAVEL_XP} XP +¥${pay}`,
  );
  if (rand() < MAX_REPEL_DROP) {
    state.items["max-repel"] += 1;
    log(state, "MAX REPEL FOUND!");
  }
  const pool = townCatchPool(target);
  let guaranteed = false;
  if (state.items["max-repel"] > 0) {
    state.items["max-repel"] -= 1;
    guaranteed = true;
    log(state, "MAX REPEL CONSUMED - CATCH GUARANTEED");
  }
  const roll =
    pool.length > 0 && (guaranteed || rand() < catchChance(humon.level));
  if (!roll) {
    log(state, `NO LUCK CATCHING IN ${townName}`);
    return;
  }
  const have = new Set(humon.team);
  const unowned = pool.filter((name) => !have.has(name));
  const pick =
    unowned.length > 0
      ? unowned[Math.floor(rand() * unowned.length)]
      : pool[Math.floor(rand() * pool.length)];
  if (have.has(pick) || humon.team.length >= MAX_TEAM_SIZE) {
    const bonus = CURRENCY.duplicate + Math.floor(rand() * 30);
    state.currency += bonus;
    log(state, `${pick} DUPED OR TEAM FULL - SOLD FOR ¥${bonus}`);
  } else {
    humon.team.push(pick);
    log(state, `${humonName(humon)} CAUGHT ${pick} IN ${townName}!`);
  }
}

/** Resolve a gym battle. Returns true when this win completed the game. */
function resolveGym(
  state: GameState,
  humon: Humon,
  win: boolean,
  turns: BattleTurn[],
  target: number,
  seed: number,
): boolean {
  const player = findPlayer(target);
  const bossName = player?.name ?? "???";
  const rand = mulberry32(hashString(`${humon.id}:gym:${target}:${seed}`));
  if (turns && turns.length > 0) {
    humon.lastBattle = { win, turns, opponent: bossName };
  }
  humon.xp += GYM_XP;
  recalcLevel(humon);
  if (win) {
    const pay = randInt(rand, CURRENCY.gym.min, CURRENCY.gym.max);
    state.currency += pay;
    log(state, `${humonName(humon)} BEATS ${bossName}! +${GYM_XP} XP +¥${pay}`);
    if (!state.defeated.includes(target)) {
      state.defeated.push(target);
      log(state, `${bossName} IS DEFEATED. BADGE EARNED!`);
      recordVictoryIfComplete(state);
    } else {
      const bonus = CURRENCY.duplicate + Math.floor(rand() * 60);
      state.currency += bonus;
      log(state, `${bossName} ALREADY DEFEATED - +¥${bonus}`);
    }
  } else {
    log(state, `${humonName(humon)} IS DEFEATED BY ${bossName}.`);
  }
  return state.wonDay !== null;
}

/** Record the victory (wonDay) once every gym leader has been beaten. */
export function recordVictoryIfComplete(state: GameState): void {
  const defeated = state.defeated.length;
  if (defeated >= BOSS_PLAYER_NUMBERS.length && state.wonDay === null) {
    state.wonDay = state.day;
    log(
      state,
      `ALL GYM LEADERS DEFEATED IN ${state.wonDay} DAY${state.wonDay === 1 ? "" : "S"}!`,
    );
  }
}

export function buyBall(
  state: GameState,
  key: SecretHumonKey,
): { ok: true } | { ok: false; error: string } {
  const spec = SECRET_HUMONS[key];
  const item = ballItemFor(key);
  if (state.items[item] >= 1)
    return { ok: false, error: `YOU ALREADY OWN A ${BALL_NAMES[key]}` };
  if (state.currency < spec.cost)
    return { ok: false, error: `NOT ENOUGH CURRENCY (NEED ¥${spec.cost})` };
  state.currency -= spec.cost;
  state.items[item] += 1;
  log(state, `${BALL_NAMES[key]} PURCHASED FOR ¥${spec.cost}`);
  return { ok: true };
}

export function useBall(
  state: GameState,
  key: SecretHumonKey,
): { ok: true } | { ok: false; error: string } {
  const spec = SECRET_HUMONS[key];
  const item = ballItemFor(key);
  if (state.unlocked.includes(key))
    return { ok: false, error: `${spec.name} IS ALREADY IN THE SQUAD` };
  if (state.items[item] <= 0)
    return { ok: false, error: `NO ${BALL_NAMES[key]} IN YOUR BAG` };
  state.items[item] -= 1;
  state.unlocked.push(key);
  state.humons.push(makeHumon(key, key));
  log(state, `${spec.name} JOINS THE SQUAD!`);
  return { ok: true };
}

export function useRareCandy(
  state: GameState,
  humonId: string,
): { ok: true } | { ok: false; error: string } {
  const humon = humonById(state, humonId);
  if (!humon) return { ok: false, error: "HUMON NOT FOUND" };
  if (state.items["rare-candy"] <= 0)
    return { ok: false, error: "NO RARE CANDIES" };
  state.items["rare-candy"] -= 1;
  humon.xp += RARE_CANDY_XP;
  recalcLevel(humon);
  log(state, `${humonName(humon)} USES A RARE CANDY. +${RARE_CANDY_XP} XP`);
  return { ok: true };
}
