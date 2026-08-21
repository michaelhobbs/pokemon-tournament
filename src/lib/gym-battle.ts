import { BattleStreams, Dex, RandomPlayerAI, PRNG } from '@pkmn/sim';
import { POKEMON_SETS } from '../data/pokemon-sets';
import { multiplier, POKEMON_TYPES } from '../data/pokemon';
import { buildTeam } from './battle';

export const GYM_FORMAT = 'gen9doublescustomgame';
export const HUMAN_NAME = 'CHALLENGER';
/** Every gym Pokemon is sent out at this level (see buildTeam). */
export const GYM_LEVEL = 100;
/** Gen used for dex lookups (move categories etc.) - matches GYM_FORMAT. */
const GYM_GEN = 9;

export interface GymMonView {
	ident: string;
	side: 'p1' | 'p2';
	name: string;
	level: number;
	hp: number;
	maxHp: number;
	hpPct: number;
	fainted: boolean;
	status: string | null;
	volatiles: string[];
	/** Stat stages (atk/def/spa/spd/spe/accuracy/evasion -> -6..+6); absent stats are at 0. */
	stages: Record<string, number>;
	item: string | null;
	/** Revealed by |-ability| / |-activate ... ability:| - null until then. */
	ability: string | null;
	/** Current battle types (typechange/typeadd/terastallize); null = use base species types. */
	types: string[] | null;
	activeSlot: number | null;
	/** Position in the side's live team order - switches reshuffle it, so always read fresh. */
	teamPos: number;
}

export interface GymMoveInfo {
	slot: number;
	name: string;
	target: string;
	disabled: boolean;
	pp: number;
	maxpp: number;
}

export interface GymActivePromptData {
	mon: GymMonView;
	moves: GymMoveInfo[];
	trapped: boolean;
	/** Tera type this mon can Terastallize into; null when unavailable. */
	canTerastallize: string | null;
}

export type GymPrompt =
	| { kind: 'team' }
	| { kind: 'move'; actives: GymActivePromptData[] }
	| { kind: 'switch'; slots: { index: number; must: boolean; mon: GymMonView | null }[] };

export interface TimedCondition {
	id: string;
	/** Inclusive turn count (1/N on the first turn); null = permanent or unknown. */
	timer: { elapsed: number; total: number } | null;
}

export interface GymSnapshot {
	turn: number;
	p1Mons: GymMonView[];
	p2Mons: GymMonView[];
	/** Our full four, in the sim's current team order - the source of truth for switch numbering. */
	p1Roster: GymMonView[];
	p1ActiveIdents: (string | null)[];
	p2ActiveIdents: (string | null)[];
	weather: string | null;
	terrain: string | null;
	weatherTimer: { elapsed: number; total: number } | null;
	terrainTimer: { elapsed: number; total: number } | null;
	p1SideConditions: TimedCondition[];
	p2SideConditions: TimedCondition[];
	log: string[];
}

export interface GymOutcome {
	win: boolean;
	tie: boolean;
}

export interface TargetOption {
	loc: number;
	label: string;
}

/** Applies a stat-stage delta, clamped to the game's -6..+6 range; 0 removes the entry. */
function applyStage(mon: GymMonView, stat: string, delta: number): void {
	const next = Math.max(-6, Math.min(6, (mon.stages[stat] ?? 0) + delta));
	if (next === 0) delete mon.stages[stat];
	else mon.stages[stat] = next;
}

const STATUS_IDS = ['brn', 'psn', 'tox', 'par', 'slp', 'frz'];

function displayName(detailsName: string): string {
	for (const [key, set] of Object.entries(POKEMON_SETS)) {
		if (set.species === detailsName) return key;
	}
	return detailsName.replace(/-.*$/, '');
}

/** "Garchomp, L100, F" -> 100 (0 if absent). */
function parseLevel(details: string | undefined): number {
	const levelPart = (details ?? '').split(', ').find((part) => part.startsWith('L'));
	return levelPart ? Number(levelPart.slice(1)) || 0 : 0;
}

const STAT_LABELS: Record<string, string> = {
	atk: 'ATTACK',
	def: 'DEFENSE',
	spa: 'SP. ATK',
	spd: 'SP. DEF',
	spe: 'SPEED',
	accuracy: 'ACCURACY',
	evasion: 'EVASION',
};

function labelStat(stat: string): string {
	return STAT_LABELS[stat] ?? stat.toUpperCase();
}

const PASSIVE_LABELS: Record<string, string> = {
	brn: 'its burn',
	psn: 'poison',
	tox: 'toxic poison',
	sandstorm: 'the sandstorm',
	hail: 'the hail',
	snow: 'the snow',
	lifeorb: 'LIFE ORB',
	rockyhelmet: 'ROCKY HELMET',
	stickybarb: 'STICKY BARB',
	bind: 'BIND',
	clamp: 'CLAMP',
	firespin: 'FIRE SPIN',
	magmastorm: 'MAGMA STORM',
	whirlpool: 'WHIRLPOOL',
	wrap: 'WRAP',
	saltcure: 'SALT CURE',
	leechseed: 'LEECH SEED',
	nightmare: 'NIGHTMARE',
	curse: 'the CURSE',
	confusion: 'its confusion',
	recoil: 'recoil',
};

/** Strips protocol prefixes like "item:" / "move:" / "ability:" / "Species". */
function cleanEffect(effect: string): string {
	return effect.replace(/^(item|move|ability|status):\s*/i, '').toUpperCase();
}

/** Damage reasons arrive either as ids ("sandstorm") or display names ("item: Life Orb"). */
function labelDamageReason(reason: string): string {
	return PASSIVE_LABELS[reason] ?? cleanEffect(reason);
}

function looksLikeIdent(part: string | undefined): boolean {
	return !!part && /^p[12][a-z]?:/.test(part);
}

/**
 * Protocol metadata shares one pipe segment with its value:
 * "|-heal|p1a: X|100/100|[from] item: Leftovers" -> "item: Leftovers".
 */
function findBracketValue(parts: string[], tag: string): string | null {
	const prefix = `[${tag}] `;
	const part = parts.find((candidate) => candidate.startsWith(prefix));
	return part ? part.slice(prefix.length) : null;
}

/** "Garchomp" -> its known gym set's item/ability, so the UI can show them pre-reveal. */
function seedSet(name: string): { item: string | null; ability: string | null } {
	const set = POKEMON_SETS[name];
	return { item: set?.item ?? null, ability: set?.ability ?? null };
}

/** Status moves whose type chart does not capture their typing-based immunities. */
const STATUS_IMMUNES: Record<string, string[]> = {
	thunderwave: ['ground', 'electric'],
	toxic: ['poison', 'steel'],
	poisonpowder: ['poison', 'steel'],
	sleeppowder: ['grass'],
	spore: ['grass'],
	stunspore: ['grass'],
	willowisp: ['fire'],
	leechseed: ['grass'],
};

/**
 * Effectiveness label for using `moveName` on a mon, or null when unremarkable
 * (normal damage / no notable status interaction). Uses the mon's tracked
 * battle types when present, else its base species types.
 */
export function moveEffectiveness(moveName: string, target: { name: string; types: string[] | null }): string | null {
	const info = Dex.forGen(9).moves.get(moveName);
	const defTypes = (target.types ?? POKEMON_TYPES[target.name] ?? []).map((t) => t.toLowerCase());
	if (!info || defTypes.length === 0) return null;
	if (info.category !== 'Status') {
		// The site's type chart is keyed by TitleCase type names.
		const title = defTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1));
		const mult = multiplier(info.type as never, title as never);
		if (mult === 0) return 'NO EFFECT';
		if (mult > 1) return `\u00d7${mult} SUPER EFFECTIVE`;
		if (mult < 1) return `\u00d7${mult} RESISTED`;
		return null;
	}
	const immuneTypes = STATUS_IMMUNES[info.id];
	if (immuneTypes?.some((t) => defTypes.includes(t))) {
		return `NO EFFECT VS ${defTypes.map((t) => t.toUpperCase()).join('/')}`;
	}
	return null;
}

function parseCondition(condition: string): { hp: number; maxHp: number; fainted: boolean; status: string | null } {
	const parts = condition.split(' ');
	const hpPart = parts[0] ?? '0/0';
	const fainted = parts[1] === 'fnt';
	let hp = 0;
	let maxHp = 1;
	const slash = hpPart.indexOf('/');
	if (slash >= 0) {
		hp = Number(hpPart.slice(0, slash)) || 0;
		maxHp = Number(hpPart.slice(slash + 1)) || 1;
	}
	const status = !fainted && parts.length > 1 ? parts.slice(1).find((p) => STATUS_IDS.includes(p)) ?? null : null;
	return { hp, maxHp, fainted, status };
}

const WEATHER_LABELS: Record<string, string> = {
	sunnyday: 'SUNNY DAY',
	raindance: 'RAIN',
	sandstorm: 'SANDSTORM',
	hail: 'HAIL',
	snow: 'SNOW',
	snowscape: 'SNOW',
	desolateland: 'DESOLATE LAND',
	primordialsea: 'PRIMORDIAL SEA',
	deltastream: 'DELTA STREAM',
};

const TERRAIN_LABELS: Record<string, string> = {
	electricterrain: 'ELECTRIC TERRAIN',
	grassyterrain: 'GRASSY TERRAIN',
	mistyterrain: 'MISTY TERRAIN',
	psychicterrain: 'PSYCHIC TERRAIN',
};

const SIDE_CONDITION_LABELS: Record<string, string> = {
	reflect: 'REFLECT',
	lightscreen: 'LIGHT SCREEN',
	auroraveil: 'AURORA VEIL',
	tailwind: 'TAILWIND',
	stickyweb: 'STICKY WEB',
	stealthrock: 'STEALTH ROCK',
	spikes: 'SPIKES',
	toxicspikes: 'TOXIC SPIKES',
	safeguard: 'SAFEGUARD',
	gmaxsteelsurge: 'STEELSURGE',
};

/** Turns each timed field effect lasts: [base, base with extension item]. Absent = permanent. */
const EFFECT_DURATIONS: Record<string, [number, number?]> = {
	sunnyday: [5, 8],
	raindance: [5, 8],
	sandstorm: [5, 8],
	hail: [5, 8],
	snow: [5, 8],
	snowscape: [5, 8],
	desolateland: [5, 8],
	primordialsea: [5, 8],
	deltastream: [5, 8],
	electricterrain: [5, 8],
	grassyterrain: [5, 8],
	mistyterrain: [5, 8],
	psychicterrain: [5, 8],
	reflect: [5, 8],
	lightscreen: [5, 8],
	auroraveil: [5, 8],
	tailwind: [4],
	safeguard: [5],
};

/**
 * Inclusive turn count for a timed effect: the starting turn is 1 of N.
 * If the effect outlives its base length it must be the extended variant
 * (Heat Rock / Light Clay / Terrain Extender).
 */
function turnsFor(id: string, startTurn: number, currentTurn: number): { elapsed: number; total: number } | null {
	const durations = EFFECT_DURATIONS[id];
	if (!durations) return null;
	const [base, extended] = durations;
	// Effects auto-started before |turn|1 (abilities like Drought) record turn 0.
	const elapsed = Math.max(1, currentTurn - Math.max(1, startTurn) + 1);
	let total = base;
	if (elapsed > base && extended !== undefined) total = extended;
	return { elapsed: Math.min(elapsed, total), total };
}

export function labelWeather(id: string): string {
	return WEATHER_LABELS[id] ?? id.toUpperCase();
}

export function labelTerrain(id: string): string {
	return TERRAIN_LABELS[id] ?? id.toUpperCase();
}

export function labelSideCondition(id: string): string {
	return SIDE_CONDITION_LABELS[id] ?? id.toUpperCase();
}

export function labelStatus(status: string): string {
	const labels: Record<string, string> = { brn: 'BRN', psn: 'PSN', tox: 'TOX', par: 'PAR', slp: 'SLP', frz: 'FRZ' };
	return labels[status] ?? status.toUpperCase();
}

/** Moves whose target the player must choose in doubles. */
export function needsTarget(target: string): boolean {
	return ['normal', 'any', 'adjacentFoe', 'adjacentAlly', 'adjacentAllyOrSelf'].includes(target);
}

/**
 * Valid target locations for a move. Loc semantics (from the choosing side):
 * positive 1/2 = foe active slots a/b; negative -1/-2 = own active slots a/b.
 */
export function targetOptionsFor(
	target: string,
	moveName: string | null,
	myActives: GymActivePromptData[],
	slotIndex: number,
	foeMons: (GymMonView | null)[],
): TargetOption[] {
	const self = myActives[slotIndex]?.mon;
	const allyIndex = slotIndex ^ 1;
	const ally = myActives[allyIndex]?.mon;
	const livingFoes = foeMons.filter((m): m is GymMonView => !!m && !m.fainted);
	switch (target) {
		case 'normal':
		case 'adjacentFoe':
			return livingFoes.map((m) => ({ loc: m.activeSlot === 1 ? 2 : 1, label: m.name }));
		case 'adjacentAlly':
			return ally && !ally.fainted ? [{ loc: -(allyIndex + 1), label: ally.name }] : [];
		case 'adjacentAllyOrSelf': {
			const options: TargetOption[] = [];
			if (self) options.push({ loc: -(slotIndex + 1), label: `${self.name} (SELF)` });
			if (ally && !ally.fainted) options.push({ loc: -(allyIndex + 1), label: `${ally.name} (ALLY)` });
			return options;
		}
		case 'any': {
			const options: TargetOption[] = livingFoes.map((m) => ({ loc: m.activeSlot === 1 ? 2 : 1, label: m.name }));
			// "any" also covers damaging attacks (e.g. Dark Pulse) that must not
			// be aimed at allies - only support moves get self/ally targets.
			const info = moveName ? Dex.forGen(GYM_GEN).moves.get(moveName) : null;
			if (!info || info.category !== 'Status') return options;
			if (self) options.push({ loc: -(slotIndex + 1), label: `${self.name} (SELF)` });
			if (ally && !ally.fainted) options.push({ loc: -(allyIndex + 1), label: `${ally.name} (ALLY)` });
			return options;
		}
		default:
			return [];
	}
}

interface ActiveRequestData {
	moves?: Record<string, unknown>[];
	trapped?: boolean;
	maybeTrapped?: boolean;
	canTerastallize?: unknown;
}

export class GymBattle {
	private readonly streams: ReturnType<typeof BattleStreams.getPlayerStreams>;
	private readonly onSnapshot: (snapshot: GymSnapshot) => void;
	private readonly onPrompt: (prompt: GymPrompt) => void;
	private readonly onEnd: (outcome: GymOutcome) => void;

	private members = new Map<string, GymMonView>();
	/** Our four rebuilt from each |request|'s side.pokemon - includes unrevealed mons. */
	private p1Roster: GymMonView[] = [];
	private p1ActiveIdents: (string | null)[] = [null, null];
	private p2ActiveIdents: (string | null)[] = [null, null];
	/** Last mon known to occupy each slot - survives faints so forced-switch prompts can name the casualty. */
	private lastActiveIdents: Record<'p1' | 'p2', (string | null)[]> = { p1: [null, null], p2: [null, null] };
	private weather: string | null = null;
	private terrain: string | null = null;
	private weatherStart: number | null = null;
	/** One Terastallization per battle per team - set once one of ours goes through. */
	private teamTeraUsed = false;
	private terrainStart: number | null = null;
	private sideConditions: Record<'p1' | 'p2', Set<string>> = { p1: new Set(), p2: new Set() };
	private sideStarts: Record<'p1' | 'p2', Map<string, number>> = { p1: new Map(), p2: new Map() };
	private turn = 0;
	private logLines: string[] = [];
	private ended = false;
	private pendingChoice: Promise<void> | null = null;
	private resolvePending: (() => void) | null = null;
	private latestRequest: Record<string, unknown> | null = null;

	constructor(opts: {
		humanTeam: string[];
		aiTeam: string[];
		opponentName: string;
		onSnapshot: (snapshot: GymSnapshot) => void;
		onPrompt: (prompt: GymPrompt) => void;
		onEnd: (outcome: GymOutcome) => void;
		seed?: number;
	}) {
		const seed = opts.seed ?? Math.floor(Math.random() * 2147483647);
		const prng = new PRNG(`gen5,${seed},${seed},${seed},${seed}`);
		const stream = new BattleStreams.BattleStream();
		this.streams = BattleStreams.getPlayerStreams(stream);
		this.onSnapshot = opts.onSnapshot;
		this.onPrompt = opts.onPrompt;
		this.onEnd = opts.onEnd;

		void new RandomPlayerAI(this.streams.p2, { seed: prng }).start();

		const spec = { formatid: GYM_FORMAT, seed: prng.getSeed() };
		const init =
			`>start ${JSON.stringify(spec)}\n` +
			`>player p1 ${JSON.stringify({ name: HUMAN_NAME, team: buildTeam(opts.humanTeam) })}\n` +
			`>player p2 ${JSON.stringify({ name: opts.opponentName.toUpperCase(), team: buildTeam(opts.aiTeam) })}`;
		void this.streams.omniscient.write(init);
	}

	async run(): Promise<void> {
		const reader = this.streams.p1[Symbol.asyncIterator]();
		while (!this.ended) {
			const { value, done } = await reader.next();
			if (done) break;
			await this.handleChunk(value as string);
		}
	}

	submitTeamOrder(order: number[]): void {
		this.respond(`team ${order.join('')}`);
	}

	submitChoices(choices: string[]): void {
		this.respond(choices.join(', '));
	}

	private respond(choiceString: string): void {
		this.latestRequest = null;
		void this.streams.p1.write(choiceString);
		const resolve = this.resolvePending;
		this.resolvePending = null;
		this.pendingChoice = null;
		resolve?.();
	}

	private async handleChunk(chunk: string): Promise<void> {
		let sawRequest = false;
		for (const line of chunk.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed.startsWith('|')) continue;
			// Mirror every protocol event to the console (minus bulky request
			// payloads) so the UI log can be audited against the raw stream.
			if (!trimmed.startsWith('|request')) console.log(`[GYM RAW] ${trimmed}`);
			if (this.handleLine(trimmed)) sawRequest = true;
		}
		this.emitSnapshot();
		if (!this.ended && sawRequest && this.latestRequest) {
			const request = this.latestRequest;
			this.latestRequest = null;
			// Create the wait promise before emitting so an answer made
			// synchronously inside the prompt handler resolves it right away.
			this.pendingChoice = new Promise<void>((resolve) => {
				this.resolvePending = resolve;
			});
			const prompted = this.emitPrompt(request);
			if (prompted) {
				await this.pendingChoice;
			} else {
				this.pendingChoice = null;
				this.resolvePending = null;
			}
		}
	}

	/** Returns true if the line was a request for our side. */
	private handleLine(line: string): boolean {
		const parts = line.split('|');
		const cmd = parts[1] ?? '';
		switch (cmd) {
			case 'request': {
				try {
					const parsed = JSON.parse(parts.slice(2).join('|')) as {
						side?: { pokemon?: { ident?: string; condition?: string; active?: boolean }[] };
					};
					this.latestRequest = parsed;
					this.syncRoster(parsed);
				} catch {
					return false;
				}
				return true;
			}
			case 'turn':
				this.turn = Number(parts[2]) || this.turn + 1;
				this.pushLog(`--- TURN ${parts[2]} ---`);
				break;
			case 'switch':
			case 'drag':
			case 'replace': {
				const ident = parts[2] ?? '';
				const details = parts[3] ?? '';
				const condition = parts[4] ?? '';
				const mon = this.upsertMember(ident, details, condition);
				// A fresh entry onto the field clears stat stages and volatiles.
				mon.stages = {};
				mon.volatiles = [];
				mon.types = null;
				// Ident format is "p1a: Name" - the slot letter sits at index 2.
				this.setActive(ident, ident.slice(2, 3));
				if (cmd === 'drag') this.pushLog(`${mon.name} was dragged out!`);
				else if (cmd === 'replace') this.pushLog(`${mon.name} revealed itself!`);
				else this.pushLog(`${mon.name} switched in!`);
				break;
			}
			case 'move': {
				const attacker = this.byIdent(parts[2] ?? '');
				const move = cleanEffect(parts[3] ?? '');
				if (!attacker || !move) break;
				const targetPart = parts.slice(4).find((part) => looksLikeIdent(part));
				const target = targetPart ? this.byIdent(targetPart) : undefined;
				this.pushLog(target ? `${attacker.name} used ${move} on ${target.name}!` : `${attacker.name} used ${move}!`);
				break;
			}
			case '-damage': {
				const mon = this.byIdent(parts[2] ?? '');
				if (!mon) break;
				const prevPct = mon.maxHp > 0 ? Math.round((mon.hp / mon.maxHp) * 100) : 0;
				const parsed = parseCondition(parts[3] ?? '');
				this.applyCondition(mon, parts[3] ?? '');
				if (parsed.fainted) break; // the faint line announces the KO itself
				const nowPct = Math.round((parsed.hp / (parsed.maxHp || 1)) * 100);
				const lost = prevPct - nowPct;
				if (lost <= 0) break;
				const fromValue = findBracketValue(parts, 'from');
				const ofValue = findBracketValue(parts, 'of');
				const reason = fromValue ? labelDamageReason(fromValue) : null;
				const source = ofValue ? this.byIdent(ofValue)?.name ?? null : null;
				if (reason && source) this.pushLog(`${mon.name} took ${lost}% damage from ${reason} (${source})!`);
				else if (reason) this.pushLog(`${mon.name} took ${lost}% damage from ${reason}!`);
				else this.pushLog(`${mon.name} lost ${lost}% of its health!`);
				break;
			}
			case '-heal': {
				const mon = this.byIdent(parts[2] ?? '');
				if (!mon) break;
				const prevPct = mon.maxHp > 0 ? Math.round((mon.hp / mon.maxHp) * 100) : 0;
				const parsed = parseCondition(parts[3] ?? '');
				this.applyCondition(mon, parts[3] ?? '');
				const nowPct = Math.round((parsed.hp / (parsed.maxHp || 1)) * 100);
				const gained = nowPct - prevPct;
				if (gained <= 0) break;
				const fromValue = findBracketValue(parts, 'from');
				const ofValue = findBracketValue(parts, 'of');
				const reason = fromValue ? cleanEffect(fromValue) : null;
				const source = ofValue ? this.byIdent(ofValue)?.name ?? null : null;
				if (reason === 'DRAIN' && source) this.pushLog(`${mon.name} siphoned ${gained}% health from ${source}!`);
				else if (reason && source) this.pushLog(`${mon.name} regained ${gained}% health from ${reason} (${source})!`);
				else if (reason) this.pushLog(`${mon.name} regained ${gained}% health from ${reason}!`);
				else this.pushLog(`${mon.name} regained ${gained}% of its health!`);
				break;
			}
			case '-boost':
			case '-unboost': {
				const mon = this.byIdent(parts[2] ?? '');
				const stat = labelStat(parts[3] ?? '');
				const rawStat = parts[3] ?? '';
				const amount = Number(parts[4]) || 1;
				if (!mon || !rawStat) break;
				applyStage(mon, rawStat, cmd === '-boost' ? amount : -amount);
				const degree = amount >= 2 ? ' sharply' : '';
				this.pushLog(cmd === '-boost' ? `${mon.name}'s ${stat} rose${degree}!` : `${mon.name}'s ${stat} fell${degree}!`);
				break;
			}
			case '-setboost': {
				const mon = this.byIdent(parts[2] ?? '');
				const stat = parts[3] ?? '';
				const value = Math.max(-6, Math.min(6, Number(parts[4]) || 0));
				if (mon && stat) {
					if (value === 0) delete mon.stages[stat];
					else mon.stages[stat] = value;
				}
				break;
			}
			case '-clearboost': {
				const mon = this.byIdent(parts[2] ?? '');
				if (mon) mon.stages = {};
				break;
			}
			case '-clearpositiveboost':
			case '-clearnegativeboost': {
				const mon = this.byIdent(parts[2] ?? '');
				if (mon) {
					for (const stat of Object.keys(mon.stages)) {
						const positive = cmd === '-clearpositiveboost';
						if ((mon.stages[stat] ?? 0) > 0 === positive) delete mon.stages[stat];
					}
				}
				break;
			}
			case '-invertboost': {
				const mon = this.byIdent(parts[2] ?? '');
				if (mon) for (const stat of Object.keys(mon.stages)) mon.stages[stat] = -(mon.stages[stat] ?? 0);
				break;
			}
			case '-clearallboost':
				for (const mon of this.members.values()) mon.stages = {};
				break;
			case '-sethp': {
				for (let i = 2; i + 1 < parts.length; i += 2) {
					const mon = this.byIdent(parts[i] ?? '');
					if (mon) this.applyCondition(mon, parts[i + 1] ?? '');
				}
				break;
			}
			case '-status': {
				const mon = this.byIdent(parts[2] ?? '');
				const status = parts[3] ?? '';
				if (mon && status) {
					mon.status = status;
					this.pushLog(`${mon.name} is ${labelStatus(status)}!`);
				}
				break;
			}
			case '-curestatus': {
				const mon = this.byIdent(parts[2] ?? '');
				const status = parts[3] ?? '';
				if (mon) {
					mon.status = null;
					this.pushLog(`${mon.name} was cured of ${labelStatus(status)}!`);
				}
				break;
			}
			case '-activate': {
				const mon = this.byIdent(parts[2] ?? '');
				const rawEffect = parts[3] ?? '';
				const effect = cleanEffect(rawEffect);
				if (mon && effect) this.pushLog(`${mon.name}'s ${effect} activated!`);
				// "ability: X" activations double as ability reveals.
				if (mon && /^ability:/i.test(rawEffect)) mon.ability = rawEffect.replace(/^ability:\s*/i, '');
				break;
			}
			case '-item': {
				const mon = this.byIdent(parts[2] ?? '');
				const item = parts[3] ?? '';
				if (mon && item) mon.item = item.replace(/^item:\s*/i, '');
				break;
			}
			case '-enditem': {
				const mon = this.byIdent(parts[2] ?? '');
				const item = cleanEffect(parts[3] ?? '');
				if (mon) {
					mon.item = null;
					if (item) this.pushLog(`${mon.name} lost its ${item}!`);
				}
				break;
			}
			case '-ability': {
				const mon = this.byIdent(parts[2] ?? '');
				// Trailing args are "[of]"-style brackets or an effect hint such
				// as "boost" - neither belongs to the name. When an ability was
				// replaced/copied (e.g. Trace) both names appear and the
				// effective one comes last.
				const args = parts.slice(3).filter((arg) => !arg.startsWith('[') && arg !== 'boost');
				if (mon && args.length > 0) mon.ability = args[args.length - 1];
				break;
			}
			case '-endability': {
				const mon = this.byIdent(parts[2] ?? '');
				if (mon) mon.ability = null;
				break;
			}
			case '-prepare': {
				const mon = this.byIdent(parts[2] ?? '');
				const move = cleanEffect(parts[3] ?? '');
				if (mon && move) this.pushLog(`${mon.name} readied ${move}!`);
				break;
			}
			case '-mustrecharge': {
				const mon = this.byIdent(parts[2] ?? '');
				if (mon) this.pushLog(`${mon.name} must recharge!`);
				break;
			}
			case 'cant': {
				// e.g. "|cant|p2b: Hisuian Lilligant|flinch" - a mon failed to act.
				const mon = this.byIdent(parts[2] ?? '');
				if (!mon) break;
				const reason = cleanEffect(parts[3] ?? '');
				if (reason === 'FLINCH') this.pushLog(`${mon.name} FLINCHED!`);
				else if (reason === 'SLEEP') this.pushLog(`${mon.name} is fast asleep!`);
				else if (reason === 'FRZ') this.pushLog(`${mon.name} is frozen solid!`);
				else if (reason === 'RECHARGE') this.pushLog(`${mon.name} must recharge!`);
				else if (reason === 'PAR') this.pushLog(`${mon.name} is paralyzed! It cannot move!`);
				else {
					const move = cleanEffect(parts[4] ?? '');
					this.pushLog(move ? `${mon.name} cannot use ${move}!` : `${mon.name} cannot move!`);
				}
				break;
			}
			case '-nothing':
				this.pushLog('BUT NOTHING HAPPENED!');
				break;
			case '-hitcount': {
				// "|-hitcount|p1a: Slaking|3" - parts[2] is the mon, parts[3] the count.
				const count = Number(parts[3]) || 0;
				if (count > 0) this.pushLog(`HIT ${count} TIME${count === 1 ? '' : 'S'}!`);
				break;
			}
			case 'faint': {
				const mon = this.byIdent(parts[2] ?? '');
				if (mon) {
					mon.fainted = true;
					mon.hp = 0;
					mon.hpPct = 0;
					mon.status = null;
					if (mon.activeSlot !== null) {
						this.clearActiveSlot(mon.side, mon.activeSlot);
						mon.activeSlot = null;
					}
					this.pushLog(`${mon.name} FAINTED!`);
				}
				break;
			}
			case '-weather': {
				const previous = this.weather;
				const id = (parts[2] ?? '').toLowerCase();
				const upkeep = parts.includes('[upkeep]');
				this.weather = !id || id === 'none' ? null : id;
				if (this.weather) {
					// Fresh activation resets the timer; upkeep ticks keep it running.
					if (!upkeep || this.weatherStart === null) this.weatherStart = this.turn;
					if (!upkeep) this.pushLog(labelWeather(this.weather));
				} else {
					this.weatherStart = null;
					if (previous) this.pushLog(`${labelWeather(previous)} faded!`);
				}
				break;
			}
			case '-terrain': {
				const previous = this.terrain;
				const id = (parts[2] ?? '').toLowerCase();
				const upkeep = parts.includes('[upkeep]');
				this.terrain = !id || id === 'none' ? null : id;
				if (this.terrain) {
					if (!upkeep || this.terrainStart === null) this.terrainStart = this.turn;
					if (!upkeep) this.pushLog(labelTerrain(this.terrain));
				} else {
					this.terrainStart = null;
					if (previous) this.pushLog(`${labelTerrain(previous)} faded!`);
				}
				break;
			}
			case '-sidestart': {
				const side = ((parts[2] ?? '').startsWith('p1') ? 'p1' : 'p2') as 'p1' | 'p2';
				// "move:Aurora Veil" style args -> compact ids matching EFFECT_DURATIONS.
				const cond = (parts[3] ?? '').replace(/^move:/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
				this.sideConditions[side].add(cond);
				this.sideStarts[side].set(cond, this.turn);
				this.pushLog(`${side === 'p1' ? 'YOUR SIDE' : 'FOE SIDE'}: ${labelSideCondition(cond)}`);
				break;
			}
			case '-sideend': {
				const side = ((parts[2] ?? '').startsWith('p1') ? 'p1' : 'p2') as 'p1' | 'p2';
				const cond = (parts[3] ?? '').replace(/^move:/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
				if (this.sideConditions[side].delete(cond)) {
					this.sideStarts[side].delete(cond);
					this.pushLog(`${side === 'p1' ? 'YOUR SIDE' : 'FOE SIDE'}: ${labelSideCondition(cond)} faded!`);
				}
				break;
			}
			case '-terastallize': {
				const mon = this.byIdent(parts[2] ?? '');
				const type = cleanEffect(parts[3] ?? '');
				if ((parts[2] ?? '').startsWith('p1')) this.teamTeraUsed = true;
				if (mon) {
					if (type) mon.types = [type];
					this.pushLog(`${mon.name} TERASTALLIZED${type ? ` into ${type}` : ''}!`);
				}
				break;
			}
			case '-start': {
				const mon = this.byIdent(parts[2] ?? '');
				const volatile = (parts[3] ?? '').replace(/^move:/, '');
				if (!mon || !volatile) break;
				if (volatile === 'typechange') {
					// e.g. Protean / Colour Change / Terastallization follow-up.
					// "[silent]" follow-ups from Terastallize still update state.
					const types = (parts[4] ?? '').split('/').filter(Boolean).map((t) => cleanEffect(t));
					if (types.length > 0) {
						const silent = parts.some((p) => p === '[silent]');
						if (!silent) this.pushLog(`${mon.name} changed its type to ${types.join('/')}!`);
					}
				} else if (volatile === 'typeadd') {
					const type = cleanEffect(parts[4] ?? '');
					if (type) {
						const base = mon.types ?? [...(POKEMON_TYPES[mon.name] ?? [])];
						if (!base.includes(type)) base.push(type);
						mon.types = base;
						this.pushLog(`${mon.name} gained the ${type} type!`);
					}
				} else if (!volatile.startsWith('perish') && !mon.volatiles.includes(volatile)) {
					mon.volatiles.push(volatile);
				}
				break;
			}
			case '-end': {
				const mon = this.byIdent(parts[2] ?? '');
				const volatile = (parts[3] ?? '').replace(/^move:/, '');
				if (mon) mon.volatiles = mon.volatiles.filter((v) => v !== volatile);
				break;
			}
			case '-supereffective':
			case '-resisted': {
				// In doubles these can fire once per target, so name the mon hit.
				const mon = parts[2] ? this.byIdent(parts[2]) : undefined;
				this.pushLog(mon ? `IT'S ${cmd === '-resisted' ? 'NOT VERY EFFECTIVE...' : 'SUPER EFFECTIVE!'} (${mon.name.toUpperCase()})` : cmd === '-resisted' ? "IT'S NOT VERY EFFECTIVE..." : "IT'S SUPER EFFECTIVE!");
				break;
			}
			case '-crit':
				this.pushLog('A CRITICAL HIT!');
				break;
			case '-miss': {
				const attacker = parts[2] ? this.byIdent(parts[2]) : undefined;
				const targetPart = parts.slice(3).find((part) => looksLikeIdent(part));
				const target = targetPart ? this.byIdent(targetPart) : undefined;
				if (attacker && target) this.pushLog(`${attacker.name}'s attack missed ${target.name}!`);
				else if (attacker) this.pushLog(`${attacker.name}'s attack missed!`);
				else this.pushLog('THE ATTACK MISSED!');
				break;
			}
			case '-fail': {
				const mon = parts[2] ? this.byIdent(parts[2]) : undefined;
				this.pushLog(mon ? `${mon.name}'s move failed!` : 'BUT IT FAILED!');
				break;
			}
			case '-immune': {
				const mon = parts[2] ? this.byIdent(parts[2]) : undefined;
				this.pushLog(mon ? `${mon.name} is unaffected!` : "IT DOESN'T AFFECT THE TARGET...");
				break;
			}
			case 'win': {
				const winner = parts[2] ?? '';
				this.ended = true;
				this.pushLog(winner === HUMAN_NAME ? 'YOU WIN!' : `${winner} WINS!`);
				this.onEnd({ win: winner === HUMAN_NAME, tie: false });
				break;
			}
			case 'tie': {
				this.ended = true;
				this.pushLog('TIE GAME!');
				this.onEnd({ win: false, tie: true });
				break;
			}
			case 'error':
				this.pushLog(`! ${(parts.slice(2).join('|') || 'INVALID CHOICE').toUpperCase()}`);
				break;
		}
		return false;
	}

	private upsertMember(ident: string, details: string, condition: string): GymMonView {
		const side = (ident.startsWith('p1') ? 'p1' : 'p2') as 'p1' | 'p2';
		const detailsParts = details.split(', ');
		const detailsName = detailsParts[0] ?? '???';
		const levelPart = detailsParts.find((p) => p.startsWith('L'));
		let mon = this.members.get(ident);
		if (!mon) {
			mon = {
				ident,
				side,
				name: displayName(detailsName),
				level: levelPart ? Number(levelPart.slice(1)) || GYM_LEVEL : GYM_LEVEL,
				hp: 0,
				maxHp: 1,
				hpPct: 100,
				fainted: false,
				status: null,
				volatiles: [],
				stages: {},
				...seedSet(displayName(detailsName)),
				types: null,
				activeSlot: null,
				teamPos: 0,
			};
			this.members.set(ident, mon);
		}
		this.applyCondition(mon, condition);
		return mon;
	}

	/**
	 * Rebuilds our team view from |request|'s side.pokemon. Unlike protocol
	 * events this lists every member - even unrevealed ones - in the CURRENT
	 * slot order the sim expects for "switch N" choices.
	 */
	private syncRoster(request: { side?: { pokemon?: { ident?: string; details?: string; condition?: string; active?: boolean }[] } }): void {
		const list = request.side?.pokemon;
		if (!Array.isArray(list)) return;
		this.p1Roster = list.map((entry, i) => {
			const ident = entry.ident ?? '';
			const name = displayName(ident.slice(ident.indexOf(':') + 2) || ident);
			const prev = this.p1Roster.find((m) => m.name === name);
			const mon: GymMonView =
				prev ?? {
					ident,
					side: 'p1',
					name,
					level: parseLevel(entry.details) || GYM_LEVEL,
					hp: 0,
					maxHp: 1,
					hpPct: 100,
					fainted: false,
					status: null,
					volatiles: [],
					stages: {},
					...seedSet(name),
				types: null,
					activeSlot: null,
					teamPos: i + 1,
				};
			mon.level = parseLevel(entry.details) || mon.level;
			this.applyCondition(mon, entry.condition ?? '');
			mon.activeSlot = entry.active ? 0 : null;
			mon.teamPos = i + 1;
			return mon;
		});
	}

	private applyCondition(mon: GymMonView, condition: string): void {
		const parsed = parseCondition(condition);
		mon.hp = parsed.hp;
		mon.maxHp = parsed.maxHp || 1;
		mon.hpPct = Math.max(0, Math.min(100, Math.round((parsed.hp / (parsed.maxHp || 1)) * 100)));
		if (parsed.fainted) {
			mon.fainted = true;
			mon.status = null;
		} else {
			mon.status = parsed.status;
		}
	}

	private byIdent(ident: string): GymMonView | undefined {
		if (!ident) return undefined;
		let mon = this.members.get(ident);
		if (!mon) {
			mon = {
				ident,
				side: (ident.startsWith('p1') ? 'p1' : 'p2') as 'p1' | 'p2',
				name: displayName(ident.slice(5) || ident),
				level: GYM_LEVEL,
				hp: 0,
				maxHp: 1,
				hpPct: 100,
				fainted: false,
				status: null,
				volatiles: [],
				stages: {},
				...seedSet(displayName(ident.slice(5) || ident)),
				types: null,
				activeSlot: null,
				teamPos: 0,
			};
			this.members.set(ident, mon);
		}
		return mon;
	}

	private setActive(ident: string, letter: string): void {
		const side = ident.startsWith('p1') ? 'p1' : 'p2';
		const slot = letter === 'b' ? 1 : 0;
		const activeIdents = side === 'p1' ? this.p1ActiveIdents : this.p2ActiveIdents;
		const previous = activeIdents[slot];
		if (previous && previous !== ident) {
			const prevMon = this.members.get(previous);
			if (prevMon) prevMon.activeSlot = null;
		}
		activeIdents[slot] = ident;
		this.lastActiveIdents[side][slot] = ident;
		const mon = this.byIdent(ident);
		if (mon) mon.activeSlot = slot;
	}

	private clearActiveSlot(side: 'p1' | 'p2', slot: number): void {
		const activeIdents = side === 'p1' ? this.p1ActiveIdents : this.p2ActiveIdents;
		if (slot >= 0 && slot < activeIdents.length) activeIdents[slot] = null;
	}

	private pushLog(text: string): void {
		this.logLines.push(text);
		if (this.logLines.length > 200) this.logLines.splice(0, this.logLines.length - 200);
	}

	private emitSnapshot(): void {
		const all = [...this.members.values()];
		const sideConditions = (side: 'p1' | 'p2'): TimedCondition[] =>
			[...this.sideConditions[side]].map((id) => {
				const start = this.sideStarts[side].get(id);
				return { id, timer: start === undefined ? null : turnsFor(id, start, this.turn) };
			});
		this.onSnapshot({
			turn: this.turn,
			p1Mons: all.filter((m) => m.side === 'p1'),
			p2Mons: all.filter((m) => m.side === 'p2'),
			p1Roster: [...this.p1Roster],
			p1ActiveIdents: [...this.p1ActiveIdents],
			p2ActiveIdents: [...this.p2ActiveIdents],
			weather: this.weather,
			terrain: this.terrain,
			weatherTimer:
				this.weather && this.weatherStart !== null ? turnsFor(this.weather, this.weatherStart, this.turn) : null,
			terrainTimer:
				this.terrain && this.terrainStart !== null ? turnsFor(this.terrain, this.terrainStart, this.turn) : null,
			p1SideConditions: sideConditions('p1'),
			p2SideConditions: sideConditions('p2'),
			log: [...this.logLines],
		});
	}

	/** Builds a UI prompt from the raw request; returns false for requests that need no input. */
	private emitPrompt(request: Record<string, unknown>): boolean {
		if (request.teamPreview) {
			this.onPrompt({ kind: 'team' });
			return true;
		}
		if (Array.isArray(request.forceSwitch)) {
			const forceSwitch = request.forceSwitch as boolean[];
			// The sim expects one choice (switch or pass) per active slot in
			// order, so expose every slot - `must` marks the ones that fainted.
			const slots = forceSwitch.map((must, i) => {
				const ident =
					this.p1ActiveIdents[i] ?? this.lastActiveIdents.p1[i] ?? `p1${i === 1 ? 'b' : 'a'}: ???`;
				return { index: i, must, mon: this.p1ActiveIdents[i] || this.lastActiveIdents.p1[i] ? this.byIdent(ident) ?? null : null };
			});
			this.onPrompt({ kind: 'switch', slots });
			return true;
		}
		if (Array.isArray(request.active)) {
			const activeData = request.active as ActiveRequestData[];
			if (activeData.length === 0) return false;
			const actives: GymActivePromptData[] = [];
			activeData.forEach((active, i) => {
				const ident = this.p1ActiveIdents[i] ?? this.lastActiveIdents.p1[i] ?? `p1${i === 1 ? 'b' : 'a'}: ???`;
				const mon = this.byIdent(ident);
				// Fainted (or Commanded-absorbing) slots are auto-passed by the
				// sim - they expect no choice, so don't prompt for them.
				if (!mon || mon.fainted || mon.volatiles.includes('commanding')) return;
				const moves: GymMoveInfo[] = (active.moves ?? []).map((m, j) => ({
					slot: j + 1,
					name: String(m.name ?? m.move ?? '?'),
					target: String(m.target ?? 'normal'),
					disabled: Boolean(m.disabled),
					pp: Number(m.pp ?? 0),
					maxpp: Number(m.maxpp ?? 0),
				}));
				actives.push({
					mon,
					moves,
					trapped: Boolean(active.trapped),
					// Gen 9 requests carry the Tera type itself ("Water"); anything
					// else means Terastallization is unavailable. Once the team's
					// single use is spent, hide it everywhere.
					canTerastallize:
						!this.teamTeraUsed && typeof active.canTerastallize === 'string' && active.canTerastallize
							? active.canTerastallize
							: null,
				});
			});
			this.onPrompt({ kind: 'move', actives });
			return true;
		}
		return false;
	}
}
