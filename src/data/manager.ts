import type { PixelArt } from "./trophy";
import type { BattleTurn } from "../lib/battle-log";
import { HUMON } from "./humon";
import { PLAYERS, findPlayer } from "./players";
import { spriteFor } from "./trainer-sprites";
import { applySwaps, swapsFor } from "./midseason";
import { HOMETOWN_MARKERS } from "./hometown-map";
import { SECRET_HUMONS, type SecretHumonKey } from "./hidden-humons";

export const MANAGER_STORAGE_KEY = "pkm:manager:v1";

export const MAX_TEAM_SIZE = 6;
export const XP_PER_LEVEL = 100;
export const RARE_CANDY_XP = 50;
export const LOG_LIMIT = 8;

export const TRAIN_MS = 2 * 60 * 60 * 1000;
export const GYM_MS = 6 * 60 * 60 * 1000;
export const TRAVEL_BASE_MS = 2 * 60 * 60 * 1000;
export const TRAVEL_PER_UNIT_MS = 10 * 60 * 1000;
export const TRAVEL_CAP_MS = 8 * 60 * 60 * 1000;

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

export interface Action {
  kind: ActionKind;
  startedAt: number;
  durationMs: number;
  seed: number;
  /** Travel: town player number. Gym: boss player number. */
  target?: number;
  /** Pre-simulated gym battle result. true = humon won. */
  battleResult?: boolean;
  /** Human-readable battle log lines from @pkmn/sim. */
  battleLog?: string[];
  /** Parsed turn-by-turn battle data. */
  battleTurns?: BattleTurn[];
}

export interface Humon {
  id: string;
  kind: HumonKind;
  level: number;
  xp: number;
  team: string[];
  action: Action | null;
  lastBattle?: { win: boolean; turns: BattleTurn[]; opponent: string };
}

export interface LogEntry {
  at: number;
  text: string;
}

export interface Items {
  "rare-candy": number;
  "max-repel": number;
}

export interface GameState {
  version: 1;
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

export const HOME_BASE = { col: 12, row: 14 };

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

export function log(state: GameState, text: string): void {
  state.log.unshift({ at: Date.now(), text });
  if (state.log.length > LOG_LIMIT) state.log.length = LOG_LIMIT;
}

function makeHumon(kind: HumonKind, id: string): Humon {
  return { id, kind, level: 1, xp: 0, team: [], action: null };
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

export function actionLabel(action: Action): string {
  if (action.kind === "train") return "TRAINING";
  const player = findPlayer(action.target ?? 0);
  if (action.kind === "travel")
    return `TRAVELLING TO ${player?.hometown ?? "???"}`;
  return `GYM BATTLE VS ${player?.name ?? "???"}`;
}

export function actionRemaining(action: Action): number {
  return Math.max(0, action.startedAt + action.durationMs - Date.now());
}

export function actionDone(action: Action): boolean {
  return actionRemaining(action) <= 0;
}

export function defaultState(): GameState {
  const state: GameState = {
    version: 1,
    currency: 0,
    humons: [],
    items: { "rare-candy": 0, "max-repel": 0 },
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
    const parsed = JSON.parse(raw) as GameState;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as GameState).version !== 1
    ) {
      return defaultState();
    }
    const state: GameState = {
      version: 1,
      currency: typeof parsed.currency === "number" ? parsed.currency : 0,
      humons: Array.isArray(parsed.humons) ? parsed.humons : [],
      items: {
        "rare-candy":
          typeof parsed.items?.["rare-candy"] === "number"
            ? parsed.items["rare-candy"]
            : 0,
        "max-repel":
          typeof parsed.items?.["max-repel"] === "number"
            ? parsed.items["max-repel"]
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

export function travelDurationMs(playerNumber: number): number {
  const marker = HOMETOWN_MARKERS.find((m) => m.playerNumber === playerNumber);
  if (!marker) return TRAVEL_BASE_MS;
  const distance =
    Math.abs(marker.col - HOME_BASE.col) + Math.abs(marker.row - HOME_BASE.row);
  return Math.min(
    TRAVEL_CAP_MS,
    TRAVEL_BASE_MS + distance * TRAVEL_PER_UNIT_MS,
  );
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

export function startAction(
  state: GameState,
  humonId: string,
  kind: ActionKind,
  target?: number,
): { ok: true } | { ok: false; error: string } {
  const humon = humonById(state, humonId);
  if (!humon) return { ok: false, error: "HUMON NOT FOUND" };
  if (humon.action) return { ok: false, error: `${humonName(humon)} IS BUSY` };
  if (kind === "train") {
    humon.action = {
      kind,
      startedAt: Date.now(),
      durationMs: TRAIN_MS,
      seed: newSeed(),
    };
    log(state, `${humonName(humon)} STARTS TRAINING`);
    return { ok: true };
  }
  if (kind === "travel") {
    if (target === undefined) return { ok: false, error: "PICK A TOWN FIRST" };
    const player = findPlayer(target);
    if (!player) return { ok: false, error: "UNKNOWN TOWN" };
    humon.action = {
      kind,
      startedAt: Date.now(),
      durationMs: travelDurationMs(target),
      seed: newSeed(),
      target,
    };
    log(state, `${humonName(humon)} HEADS TO ${player.hometown}`);
    return { ok: true };
  }
  if (kind === "gym") {
    if (target === undefined) return { ok: false, error: "PICK A GYM FIRST" };
    const player = findPlayer(target);
    if (!player) return { ok: false, error: "UNKNOWN GYM" };
    if (humon.team.length === 0)
      return { ok: false, error: `${humonName(humon)} NEEDS A TEAM FIRST` };
    const rec = recommendedLevel(target);
    if (humon.level < rec)
      return { ok: false, error: `GYM ${player.number} REQUIRES LV ${rec}` };
    humon.action = {
      kind,
      startedAt: Date.now(),
      durationMs: GYM_MS,
      seed: newSeed(),
      target,
    };
    log(state, `${humonName(humon)} CHALLENGES ${player.name}`);
    return { ok: true };
  }
  return { ok: false, error: "UNKNOWN ACTION" };
}

/** Validate and start a gym action, pre-simulating the battle via @pkmn/sim. */
export async function startGymAction(
  state: GameState,
  humonId: string,
  bossNumber: number,
): Promise<
  | { ok: true; win: boolean; log: string[]; turns: BattleTurn[] }
  | { ok: false; error: string }
> {
  const humon = humonById(state, humonId);
  if (!humon) return { ok: false, error: "HUMON NOT FOUND" };
  if (humon.action) return { ok: false, error: `${humonName(humon)} IS BUSY` };
  const player = findPlayer(bossNumber);
  if (!player) return { ok: false, error: "UNKNOWN GYM" };
  if (humon.team.length === 0)
    return { ok: false, error: `${humonName(humon)} NEEDS A TEAM FIRST` };
  const rec = recommendedLevel(bossNumber);
  if (humon.level < rec)
    return { ok: false, error: `GYM ${player.number} REQUIRES LV ${rec}` };

  const { runBattle } = await import("../lib/battle");
  const { parseBattleLog } = await import("../lib/battle-log");
  const seed = newSeed();
  const result = await runBattle(humon.team, bossTeamFor(bossNumber), seed);
  const turns = parseBattleLog(result.log, result.items);

  humon.action = {
    kind: "gym",
    startedAt: Date.now(),
    durationMs: GYM_MS,
    seed,
    target: bossNumber,
    battleResult: result.win,
    battleLog: result.log,
    battleTurns: turns,
  };
  log(state, `${humonName(humon)} CHALLENGES ${player.name}`);
  return { ok: true, win: result.win, log: result.log, turns };
}

export function resolveActions(state: GameState): void {
  for (const humon of state.humons) {
    if (!humon.action) continue;
    const action = humon.action;
    if (Date.now() < action.startedAt + action.durationMs) continue;
    humon.action = null;
    if (action.kind === "train") resolveTrain(state, humon, action);
    else if (action.kind === "travel") resolveTravel(state, humon, action);
    else resolveGym(state, humon, action);
  }
}

/** Debug: resolve all pending actions immediately, ignoring timers. */
export function forceResolveAll(state: GameState): void {
  for (const humon of state.humons) {
    if (!humon.action) continue;
    const action = humon.action;
    humon.action = null;
    if (action.kind === "train") resolveTrain(state, humon, action);
    else if (action.kind === "travel") resolveTravel(state, humon, action);
    else resolveGym(state, humon, action);
  }
}

function resolveTrain(state: GameState, humon: Humon, action: Action): void {
  const rand = mulberry32(
    hashString(`${humon.id}:train:${action.startedAt}:${action.seed}`),
  );
  humon.xp += TRAIN_XP;
  humon.level = levelFor(humon.xp);
  const pay = randInt(rand, CURRENCY.train.min, CURRENCY.train.max);
  state.currency += pay;
  log(state, `${humonName(humon)} TRAINS. +${TRAIN_XP} XP +$${pay}`);
  if (rand() < RARE_CANDY_DROP) {
    state.items["rare-candy"] += 1;
    log(state, "RARE CANDY FOUND!");
  }
}

function resolveTravel(state: GameState, humon: Humon, action: Action): void {
  const target = action.target ?? 0;
  const player = findPlayer(target);
  const townName = player?.hometown ?? "???";
  const rand = mulberry32(
    hashString(`${humon.id}:travel:${action.startedAt}:${action.seed}`),
  );
  humon.xp += TRAVEL_XP;
  humon.level = levelFor(humon.xp);
  const pay = randInt(rand, CURRENCY.travel.min, CURRENCY.travel.max);
  state.currency += pay;
  log(
    state,
    `${humonName(humon)} RETURNS FROM ${townName}. +${TRAVEL_XP} XP +$${pay}`,
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
    log(state, `${pick} DUPED OR TEAM FULL - SOLD FOR $${bonus}`);
  } else {
    humon.team.push(pick);
    log(state, `${humonName(humon)} CAUGHT ${pick} IN ${townName}!`);
  }
}

function resolveGym(state: GameState, humon: Humon, action: Action): void {
  const target = action.target ?? 0;
  const player = findPlayer(target);
  const bossName = player?.name ?? "???";
  const rand = mulberry32(
    hashString(`${humon.id}:gym:${action.startedAt}:${action.seed}`),
  );
  const win = action.battleResult ?? false;
  if (action.battleTurns && action.battleTurns.length > 0) {
    humon.lastBattle = { win, turns: action.battleTurns, opponent: bossName };
  }
  humon.xp += GYM_XP;
  humon.level = levelFor(humon.xp);
  if (win) {
    const pay = randInt(rand, CURRENCY.gym.min, CURRENCY.gym.max);
    state.currency += pay;
    log(state, `${humonName(humon)} BEATS ${bossName}! +${GYM_XP} XP +$${pay}`);
    const bossId = `boss-${target}`;
    if (!humonById(state, bossId)) {
      state.humons.push(makeHumon("boss", bossId));
      log(state, `${bossName} JOINS THE SQUAD!`);
    } else {
      const bonus = CURRENCY.duplicate + Math.floor(rand() * 60);
      state.currency += bonus;
      log(state, `${bossName} ALREADY JOINED - +$${bonus}`);
    }
  } else {
    log(state, `${humonName(humon)} IS DEFEATED BY ${bossName}.`);
  }
}

export function unlockSecret(
  state: GameState,
  key: SecretHumonKey,
): { ok: true } | { ok: false; error: string } {
  const spec = SECRET_HUMONS[key];
  if (state.unlocked.includes(key))
    return { ok: false, error: `${spec.name} IS ALREADY IN THE SQUAD` };
  if (!state.visited.includes(spec.page))
    return { ok: false, error: `FIND PAGE ${spec.page} FIRST` };
  if (state.currency < spec.cost)
    return { ok: false, error: `NOT ENOUGH CURRENCY (NEED $${spec.cost})` };
  state.currency -= spec.cost;
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
  humon.level = levelFor(humon.xp);
  log(state, `${humonName(humon)} USES A RARE CANDY. +${RARE_CANDY_XP} XP`);
  return { ok: true };
}
