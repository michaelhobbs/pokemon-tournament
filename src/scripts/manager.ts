import { readCaught } from '../data/humon';
import { findPlayer } from '../data/players';
import { spriteFor } from '../data/trainer-sprites';
import { POKEMON_TYPES } from '../data/pokemon';
import { POKEMON_SPRITES } from '../data/pokemon-sprites';
import { POKEMON_SETS } from '../data/pokemon-sets';
import { SECRET_HUMONS, SECRET_HUMON_KEYS, type SecretHumonKey } from '../data/hidden-humons';
import type { BattleTurn } from '../lib/battle-log';
import { speciesToKey } from '../lib/battle';
import {
	type Action,
	type GameState,
	type Humon,
	loadState,
	saveState,
	markVisited,
	resolveActions,
	forceResolveAll,
	startAction,
	startGymAction,
	unlockSecret,
	useRareCandy,
	log,
	humonName,
	humonSprite,
	kindLabel,
	actionLabel,
	actionRemaining,
	humonById,
	XP_PER_LEVEL,
	catchChance,
	recommendedLevel,
	travelDurationMs,
	townCatchPool,
	bossTeamFor,
	TOWN_PLAYER_NUMBERS,
	BOSS_PLAYER_NUMBERS,
	HIDDEN_PAGE_NUMBERS,
	TRAIN_MS,
	GYM_MS,
} from '../data/manager';

type Feature = 'hub' | 'roster' | 'travel' | 'training' | 'gyms' | 'unlocks' | 'debug';

interface ManagerWindow extends Window {
	ceefaxManagerInstalled?: boolean;
	ceefaxManagerPageLoadAttached?: boolean;
}

const managerWindow = window as ManagerWindow;
const baseUrl = import.meta.env.BASE_URL;

let state: GameState | null = null;
let countdownTimer: number | undefined;
let battleViewTurn = 0;
let battleViewTurns: BattleTurn[] = [];

const PAGE_LABELS: Record<string, string> = {
	'000': 'THE SECRET PAGE',
	'123': 'PROFESSOR JOAK',
	'404': 'PAGE NOT FOUND',
	'666': 'DEVILMON',
	'999': 'COPMON',
};

export function initManager(): void {
	if (!managerWindow.ceefaxManagerInstalled) {
		managerWindow.ceefaxManagerInstalled = true;
		document.addEventListener('click', onClick);
		document.addEventListener('change', onChange);
		window.addEventListener('humon:caught', refresh);
	}
	if (!managerWindow.ceefaxManagerPageLoadAttached) {
		managerWindow.ceefaxManagerPageLoadAttached = true;
		document.addEventListener('astro:page-load', refresh);
	}
	refresh();
}

function refresh(): void {
	const mounts = document.querySelectorAll<HTMLElement>('[data-manager-feature], [data-manager-secret]');
	if (mounts.length === 0) return;
	if (!readCaught()) {
		state = null;
		stopCountdown();
		for (const mount of mounts) renderGate(mount);
		return;
	}
	state = loadState();
	const page = currentPage();
	if (page) markVisited(state, page);
	resolveActions(state);
	saveState(state);
	renderAll();
	startCountdown();
}

function renderAll(): void {
	if (!state) return;
	for (const mount of document.querySelectorAll<HTMLElement>('[data-manager-feature], [data-manager-secret]')) {
		const feature = mount.dataset.managerFeature as Feature | undefined;
		const secret = mount.dataset.managerSecret as SecretHumonKey | undefined;
		if (feature) renderFeature(mount, feature);
		else if (secret) renderSecret(mount, secret);
	}
}

function currentPage(): string | null {
	try {
		const raw = document.body.dataset.ceefaxPages;
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return typeof parsed?.current === 'string' ? parsed.current : null;
	} catch {
		return null;
	}
}

function renderGate(mount: HTMLElement): void {
	mount.innerHTML = `
		<div class="mgr-gate">
			<p>NO HUMON. NO MANAGER.</p>
			<p>CATCH YOUR HUMON ON <a href="${baseUrl}">PAGE 100</a> FIRST.</p>
		</div>`;
}

function renderFeature(mount: HTMLElement, feature: Feature): void {
	if (!state) {
		renderGate(mount);
		return;
	}
	mount.innerHTML = statusBarHtml(state) + featureHtml(state, feature);
}

function renderSecret(mount: HTMLElement, key: SecretHumonKey): void {
	if (!state) {
		renderGate(mount);
		return;
	}
	const spec = SECRET_HUMONS[key];
	const owned = state.unlocked.includes(key);
	const found = state.visited.includes(spec.page);
	const affordable = state.currency >= spec.cost;
	const buyLabel = key === 'joak' ? 'BUY A JOAK BALL' : 'ENLIST';
	const button = owned
		? `<p class="mgr-idle">${esc(spec.name)} IS IN YOUR SQUAD</p>`
		: `<button
				class="mgr-btn ${key === 'devil' || key === 'cop' ? 'mgr-btn-danger' : ''}"
				data-mgr-action="unlock"
				data-mgr-key="${key}"
				${!found || !affordable ? 'disabled' : ''}
			>${buyLabel} - $${spec.cost}</button>`;
	mount.innerHTML = `
		<div class="mgr-secret">
			<div class="mgr-status">
				<span class="mgr-status-item">CASH <strong>$${state.currency}</strong></span>
			</div>
			${owned ? '' : `<p class="mgr-busy">REQUIRES PAGE ${spec.page}</p>`}
			${owned ? '' : `<p class="mgr-busy">COST $${spec.cost}</p>`}
			${button}
		</div>`;
}

function statusBarHtml(game: GameState): string {
	const busy = game.humons.filter((humon) => humon.action).length;
	const badges = game.humons.filter((humon) => humon.kind === 'boss').length;
	return `
		<div class="mgr-status">
			<span class="mgr-status-item">CASH <strong>$${game.currency}</strong></span>
			<span class="mgr-status-item">SQUAD <strong>${game.humons.length}</strong></span>
			<span class="mgr-status-item">BUSY <strong>${busy}</strong></span>
			<span class="mgr-status-item">RARE CANDY <strong>${game.items['rare-candy']}</strong></span>
			<span class="mgr-status-item">MAX REPEL <strong>${game.items['max-repel']}</strong></span>
			<span class="mgr-status-item">BADGES <strong>${badges}</strong>/10</span>
		</div>`;
}

function featureHtml(game: GameState, feature: Feature): string {
	switch (feature) {
		case 'hub':
			return hubHtml(game);
		case 'roster':
			return rosterHtml(game);
		case 'travel':
			return travelHtml(game);
		case 'training':
			return trainingHtml(game);
		case 'gyms':
			return gymsHtml(game);
		case 'unlocks':
			return unlocksHtml(game);
		case 'debug':
			return debugHtml(game);
	}
}

function hubHtml(game: GameState): string {
	const busy = game.humons.filter((humon) => humon.action);
	return `
		<section class="mgr-section">
			<h2 class="mgr-section-title">ACTIVE ACTIONS (${busy.length})</h2>
			<div class="mgr-section-body">
				${busy.length === 0 ? '<p class="mgr-empty">ALL HUMONS ARE IDLE. GIVE THEM ORDERS.</p>' : busy.map(humonStatusCard).join('')}
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">SQUAD (${game.humons.length})</h2>
			<div class="mgr-section-body mgr-grid">
				${game.humons.map(humonCard).join('')}
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">RECENT ACTIVITY</h2>
			<div class="mgr-section-body">${logHtml(game)}</div>
		</section>`;
}

function humonStatusCard(humon: Humon): string {
	if (!humon.action) return '';
	return `
		<div class="mgr-card">
			<div class="mgr-card-head">
				${spriteHtml(humonSprite(humon), '2.5rem')}
				<span class="mgr-name">${esc(humonName(humon))}</span>
				<span class="mgr-lvl">LV ${humon.level}</span>
				<span class="mgr-busy">${esc(actionLabel(humon.action))}</span>
				${countdownHtml(humon.action)}
			</div>
		</div>`;
}

function humonCard(humon: Humon): string {
	return `
		<div class="mgr-card">
			<div class="mgr-card-head">
				${spriteHtml(humonSprite(humon), '3rem')}
				<span class="mgr-name">${esc(humonName(humon))}</span>
				<span class="mgr-tag">${esc(kindLabel(humon))}</span>
			</div>
			<div>
				<span class="mgr-lvl">LV ${humon.level}</span>
				<span class="mgr-xp"> ${xpProgress(humon)}</span>
				${xpBarHtml(humon)}
			</div>
			<div>
				${humon.action ? `<span class="mgr-busy">${esc(actionLabel(humon.action))}</span> ${countdownHtml(humon.action)}` : '<span class="mgr-idle">IDLE</span>'}
			</div>
			<div>${teamSummaryHtml(humon)}</div>
		</div>`;
}

function rosterHtml(game: GameState): string {
	return `
		<section class="mgr-section">
			<h2 class="mgr-section-title">ROSTER (${game.humons.length})</h2>
			<div class="mgr-section-body mgr-grid">
				${game.humons.map(rosterCard).join('')}
			</div>
		</section>`;
}

function rosterCard(humon: Humon): string {
	const candyButton =
		state && state.items['rare-candy'] > 0
			? `<button class="mgr-btn" data-mgr-action="use-rare-candy" data-humon="${humon.id}">USE RARE CANDY</button>`
			: '';
	const teamHtml = humon.team.length === 0 ? '<span class="mgr-empty">NO TEAM YET - SEND TRAVELLING</span>' : `<div class="mgr-team">${humon.team.map((name) => monHtml(name)).join('')}</div>`;
	return `
		<div class="mgr-card">
			<div class="mgr-card-head">
				${spriteHtml(humonSprite(humon), '3rem')}
				<span class="mgr-name">${esc(humonName(humon))}</span>
				<span class="mgr-tag">${esc(kindLabel(humon))}</span>
			</div>
			<div>
				<span class="mgr-lvl">LV ${humon.level}</span>
				<span class="mgr-xp"> ${xpProgress(humon)}</span>
				${xpBarHtml(humon)}
			</div>
			<div>
				${humon.action ? `<span class="mgr-busy">${esc(actionLabel(humon.action))}</span> ${countdownHtml(humon.action)}` : '<span class="mgr-idle">IDLE</span>'}
			</div>
			${teamHtml}
			${candyButton}
		</div>`;
}

function xpProgress(humon: Humon): string {
	return `${humon.xp % XP_PER_LEVEL}/${XP_PER_LEVEL} XP`;
}

function xpBarHtml(humon: Humon): string {
	const pct = Math.min(100, Math.floor(((humon.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100));
	return `<div class="mgr-xp-bar"><span class="mgr-xp-fill" style="width:${pct}%"></span></div>`;
}

function teamSummaryHtml(humon: Humon): string {
	if (humon.team.length === 0) return '<span class="mgr-empty">NO TEAM YET</span>';
	return `<span class="mgr-note">${humon.team.map((name) => esc(name)).join(', ')}</span>`;
}

function travelHtml(game: GameState): string {
	const mount = document.querySelector<HTMLElement>('[data-manager-feature="travel"]');
	const idle = game.humons.filter((humon) => !humon.action);
	const currentHumon = mount?.querySelector<HTMLSelectElement>('[data-mgr-select="humon"]')?.value ?? idle[0]?.id ?? '';
	const humonOpts =
		idle.length === 0
			? '<option value="">NO IDLE HUMONS</option>'
			: idle.map((humon) => option(humon.id, `${humonName(humon)} LV ${humon.level}`, humon.id === currentHumon)).join('');
	const currentTown = Number(mount?.querySelector<HTMLSelectElement>('[data-mgr-select="town"]')?.value ?? TOWN_PLAYER_NUMBERS[0]);
	const townOpts = TOWN_PLAYER_NUMBERS.map((number) => {
		const player = findPlayer(number);
		const town = player?.hometown ?? '???';
		return option(String(number), town, number === currentTown);
	}).join('');
	const trips = game.humons.filter((humon) => humon.action?.kind === 'travel');
	return `
		<section class="mgr-section">
			<h2 class="mgr-section-title">SEND A HUMON TRAVELLING</h2>
			<div class="mgr-section-body">
				<p class="mgr-note">TRAVEL UNLOCKS THE TOWN'S CATCH POOL. RETURNING HUMONS TRY TO CATCH ONE POKEMON.</p>
				<div class="mgr-form">
					<label class="mgr-label">HUMON <select class="mgr-select" data-mgr-select="humon">${humonOpts}</select></label>
					<label class="mgr-label">TOWN <select class="mgr-select" data-mgr-select="town">${townOpts}</select></label>
					<button class="mgr-btn" data-mgr-action="travel" ${idle.length ? '' : 'disabled'}>TRAVEL</button>
				</div>
				<div data-mgr-preview="travel">${travelPreviewHtml(game, mount)}</div>
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">CURRENT TRIPS (${trips.length})</h2>
			<div class="mgr-section-body">
				${trips.length === 0 ? '<p class="mgr-empty">NO HUMONS ON THE ROAD.</p>' : trips.map(humonStatusCard).join('')}
			</div>
		</section>`;
}

function travelPreviewHtml(game: GameState, mount: HTMLElement | null): string {
	const scope = mount ?? document.querySelector<HTMLElement>('[data-manager-feature="travel"]');
	const humonId = scope?.querySelector<HTMLSelectElement>('[data-mgr-select="humon"]')?.value ?? game.humons[0]?.id ?? '';
	const town = Number(scope?.querySelector<HTMLSelectElement>('[data-mgr-select="town"]')?.value ?? TOWN_PLAYER_NUMBERS[0]);
	const humon = humonById(game, humonId);
	const player = findPlayer(town);
	const pool = townCatchPool(town);
	const duration = travelDurationMs(town);
	const chance = humon ? Math.round(catchChance(humon.level) * 100) : 0;
	return `
		<p class="mgr-note">DESTINATION: ${esc(player?.hometown ?? '???')} (${esc(player?.name ?? '???')})</p>
		<p class="mgr-note">TRIP DURATION: ${formatDuration(duration)}</p>
		<p class="mgr-note">CATCH CHANCE: ${chance}%${humon ? ` (LV ${humon.level})` : ''}</p>
		<div class="mgr-pool">
			<span class="mgr-note">CATCH POOL:</span>
			${pool.map((name) => monHtml(name)).join('')}
		</div>`;
}

function trainingHtml(game: GameState): string {
	const mount = document.querySelector<HTMLElement>('[data-manager-feature="training"]');
	const idle = game.humons.filter((humon) => !humon.action);
	const currentHumon = mount?.querySelector<HTMLSelectElement>('[data-mgr-select="humon"]')?.value ?? idle[0]?.id ?? '';
	const humonOpts =
		idle.length === 0
			? '<option value="">NO IDLE HUMONS</option>'
			: idle.map((humon) => option(humon.id, `${humonName(humon)} LV ${humon.level}`, humon.id === currentHumon)).join('');
	return `
		<section class="mgr-section">
			<h2 class="mgr-section-title">TRAIN A HUMON</h2>
			<div class="mgr-section-body">
				<p class="mgr-note">TRAINING TAKES ${formatDuration(TRAIN_MS)} AND GRANTS XP AND CASH. RARE CANDIES DROP SOMETIMES.</p>
				<div class="mgr-form">
					<label class="mgr-label">HUMON <select class="mgr-select" data-mgr-select="humon">${humonOpts}</select></label>
					<button class="mgr-btn" data-mgr-action="train" ${idle.length ? '' : 'disabled'}>TRAIN</button>
				</div>
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">SQUAD STATUS</h2>
			<div class="mgr-section-body mgr-grid">
				${game.humons.map(humonCard).join('')}
			</div>
		</section>`;
}

function gymsHtml(game: GameState): string {
	const mount = document.querySelector<HTMLElement>('[data-manager-feature="gyms"]');
	const idle = game.humons.filter((humon) => !humon.action);

	const gymBattles = game.humons.filter((h) => (h.action?.kind === 'gym' && h.action.battleTurns && h.action.battleTurns.length > 0) || (h.lastBattle && h.lastBattle.turns.length > 0));
	const viewerHtml = gymBattles.length > 0 ? gymBattles.map((h) => battleViewerHtml(h)).join('') : '';

	const bossCards = BOSS_PLAYER_NUMBERS.map((number) => {
		const player = findPlayer(number);
		if (!player) return '';
		const joined = !!humonById(game, `boss-${number}`);
		const team = bossTeamFor(number);
		const rec = recommendedLevel(number);
		const currentHumon = mount?.querySelector<HTMLSelectElement>(`[data-mgr-select="humon"][data-boss="${number}"]`)?.value ?? idle[0]?.id ?? '';
		const humonOpts =
			idle.length === 0
				? '<option value="">NO IDLE HUMONS</option>'
				: idle.map((humon) => option(humon.id, `${humonName(humon)} LV ${humon.level}`, humon.id === currentHumon)).join('');
		return `
			<div class="mgr-card" ${joined ? 'data-dim="true"' : ''}>
				<div class="mgr-card-head">
					${spriteHtml(spriteFor(number), '3rem')}
					<span class="mgr-name">${esc(player.name)}</span>
					<span class="mgr-tag">GYM ${player.number}</span>
					<span class="mgr-tag">${joined ? 'JOINED' : 'UNBEATEN'}</span>
				</div>
				<p class="mgr-note">HOMETOWN: ${esc(player.hometown)}</p>
				<div class="mgr-pool">
					<span class="mgr-note">TEAM:</span>
					${team.map((name) => monHtml(name)).join('')}
				</div>
				<p class="mgr-note">RECOMMENDED LV: ${rec}</p>
				<div class="mgr-form">
					<label class="mgr-label">CHALLENGER <select class="mgr-select" data-mgr-select="humon" data-boss="${number}">${humonOpts}</select></label>
					<button class="mgr-btn" data-mgr-action="gym" data-boss="${number}" ${!idle.length || joined ? 'disabled' : ''}>CHALLENGE</button>
				</div>
			</div>`;
	}).join('');
	return `
		${viewerHtml}
		<section class="mgr-section">
			<h2 class="mgr-section-title">GYM LEADERS (${game.humons.filter((humon) => humon.kind === 'boss').length}/10 BEATEN)</h2>
			<div class="mgr-section-body">
				<p class="mgr-note">GYM BATTLES USE REAL SHOWDOWN SIMULATION. BEATING A LEADER ADDS THEM TO YOUR SQUAD.</p>
				<div class="mgr-grid">${bossCards}</div>
			</div>
		</section>`;
}

function battleMemberHtml(m: { species: string; nickname: string; hp: number; maxHp: number; status: string; hpPct: number; item: string | null; condition: string | null }): string {
	const statusIcon = m.status === 'active' ? '▶' : m.status === 'fainted' ? '✕' : '·';
	const statusCls = m.status === 'active' ? 'mgr-bm-active' : m.status === 'fainted' ? 'mgr-bm-faint' : 'mgr-bm-bench';
	let hpLabel: string;
	let hpColor: string;
	if (m.status === 'fainted') {
		hpLabel = 'FAINTED';
		hpColor = 'var(--ceefax-red)';
	} else if (m.status === 'active') {
		hpLabel = `${m.hp}/${m.maxHp}`;
		hpColor = m.hpPct > 50 ? 'var(--ceefax-green)' : m.hpPct > 20 ? 'var(--ceefax-yellow)' : 'var(--ceefax-red)';
	} else {
		hpLabel = 'READY';
		hpColor = 'var(--ceefax-white)';
	}
	const itemHtml = m.item ? `<span class="mgr-bm-item">${esc(m.item)}</span>` : '';
	const condLabel: Record<string, string> = { brn: 'BRN', psn: 'PSN', tox: 'TOX', par: 'PAR', slp: 'SLP', frz: 'FRZ' };
	const condColor: Record<string, string> = { brn: 'var(--ceefax-red)', psn: '#c040c0', tox: '#c040c0', par: 'var(--ceefax-yellow)', slp: 'var(--ceefax-cyan)', frz: 'var(--ceefax-blue)' };
	const condHtml = m.condition ? `<span class="mgr-bm-cond" style="color:${condColor[m.condition] ?? 'var(--ceefax-white)'}">${condLabel[m.condition] ?? m.condition.toUpperCase()}</span>` : '';
	const key = speciesToKey(m.species);
	const types = POKEMON_TYPES[key];
	const ability = POKEMON_SETS[key]?.ability;
	const typesHtml = types ? types.map((t) => `<span class="mgr-type" data-type="${esc(t)}">${esc(t)}</span>`).join('') : '';
	const abilityHtml = ability ? `<span class="mgr-bm-ability">${esc(ability)}</span>` : '';
	return `<div class="mgr-bm ${statusCls}">
		<span class="mgr-bm-icon">${statusIcon}</span>
		<span class="mgr-bm-name">${esc(m.species)}${itemHtml}${condHtml}</span>
		<span class="mgr-bm-info">${typesHtml}${abilityHtml}</span>
		<span class="mgr-bm-hp" style="color:${hpColor}">${hpLabel}</span>
	</div>`;
}

function sideConditionsHtml(conds: string[]): string {
	if (conds.length === 0) return '';
	return `<div class="mgr-bt-sideconds">${conds.map((c) => `<span class="mgr-bt-sidecond">${esc(c)}</span>`).join('')}</div>`;
}

function activeConditionHtml(condition: string): string {
	const labels: Record<string, string> = { brn: 'BRN', psn: 'PSN', tox: 'TOX', par: 'PAR', slp: 'SLP', frz: 'FRZ' };
	const colors: Record<string, string> = { brn: 'var(--ceefax-red)', psn: '#c040c0', tox: '#c040c0', par: 'var(--ceefax-yellow)', slp: 'var(--ceefax-cyan)', frz: 'var(--ceefax-blue)' };
	const anims: Record<string, string> = { brn: 'mgr-anim-burn', psn: 'mgr-anim-poison', tox: 'mgr-anim-poison', par: 'mgr-anim-paralyze', slp: 'mgr-anim-sleep', frz: 'mgr-anim-freeze' };
	const label = labels[condition] ?? condition.toUpperCase();
	const color = colors[condition] ?? 'var(--ceefax-white)';
	const anim = anims[condition] ?? '';
	return `<span class="mgr-bm-cond mgr-bt-active-cond ${anim}" style="color:${color}">${label}</span>`;
}

function battleFieldHtml(field: { weather: string | null; terrain: string | null; room: string | null }): string {
	const effects: string[] = [];
	if (field.weather) effects.push(`<span class="mgr-bf-weather">☁ ${esc(field.weather)}</span>`);
	if (field.terrain) effects.push(`<span class="mgr-bf-terrain">≋ ${esc(field.terrain)}</span>`);
	if (field.room) effects.push(`<span class="mgr-bf-room">⊞ ${esc(field.room)}</span>`);
	if (effects.length === 0) return '<span class="mgr-bf-none">NO EFFECTS</span>';
	return effects.join('');
}

function battleViewerHtml(humon: Humon): string {
	const action = humon.action;
	const turns = action?.battleTurns ?? humon.lastBattle?.turns;
	const win = action?.battleResult ?? humon.lastBattle?.win;
	const opponent = action?.target ? (findPlayer(action.target)?.name ?? '???') : humon.lastBattle?.opponent ?? '???';
	if (!turns || turns.length === 0) return '';
	const totalTurns = turns.length;
	if (battleViewTurns !== turns) {
		battleViewTurns = turns;
		battleViewTurn = 0;
		console.log('[battle log] raw lines:', turns.map((t) => ({ turn: t.turn, raw: t.raw })));
	}
	const cur = Math.min(battleViewTurn, totalTurns - 1);
	const turn = turns[cur];
	const events = turn.events.map((e) => {
		const cls = e.type === 'faint' ? 'mgr-bt-faint' : e.type === 'supereffective' ? 'mgr-bt-se' : e.type === 'crit' ? 'mgr-bt-crit' : e.type === 'move' ? 'mgr-bt-move' : e.type === 'switch' ? 'mgr-bt-switch' : e.type === 'fail' || e.type === 'immune' ? 'mgr-bt-fail' : e.type === 'status' ? 'mgr-bt-status' : e.type === 'heal' ? 'mgr-bt-heal' : e.type === 'miss' ? 'mgr-bt-fail' : e.type === 'boost' ? 'mgr-bt-info' : e.type === 'volatile' ? 'mgr-bt-info' : '';
		return `<div class="mgr-bt-event ${cls}">${esc(e.text)}</div>`;
	}).join('');
	const p1Html = (turn.p1 ?? []).map(battleMemberHtml).join('');
	const p2Html = (turn.p2 ?? []).map(battleMemberHtml).join('');
	const fieldHtml = battleFieldHtml(turn.field ?? { weather: null, terrain: null, room: null });
	const p1Active = (turn.p1 ?? []).find((m) => m.status === 'active');
	const p2Active = (turn.p2 ?? []).find((m) => m.status === 'active');
	const p1SpriteHtml = p1Active ? pokemonSpriteHtml(p1Active.species, 'p1') : '';
	const p2SpriteHtml = p2Active ? pokemonSpriteHtml(p2Active.species, 'p2') : '';
	const p1CondHtml = sideConditionsHtml(turn.sideConditions?.p1 ?? []);
	const p2CondHtml = sideConditionsHtml(turn.sideConditions?.p2 ?? []);
	const p1ActiveCondHtml = p1Active?.condition ? activeConditionHtml(p1Active.condition) : '';
	const p2ActiveCondHtml = p2Active?.condition ? activeConditionHtml(p2Active.condition) : '';
	const resultBar = cur === totalTurns - 1
		? `<div class="mgr-bt-result ${win ? 'mgr-bt-win' : 'mgr-bt-loss'}">${win ? 'YOU WIN!' : 'DEFEATED!'}</div>`
		: '';
	return `
		<section class="mgr-section">
			<h2 class="mgr-section-title">BATTLE REPLAY: ${esc(humonName(humon))} VS ${esc(opponent)}</h2>
			<div class="mgr-section-body">
				<div class="mgr-bt-viewer">
					<div class="mgr-bt-nav">
						<button class="mgr-btn mgr-btn-sm" data-mgr-action="bt-prev" ${cur <= 0 ? 'disabled' : ''}>&lt;</button>
						<span class="mgr-bt-counter">TURN ${turn.turn} / ${totalTurns}</span>
						<button class="mgr-btn mgr-btn-sm" data-mgr-action="bt-next" ${cur >= totalTurns - 1 ? 'disabled' : ''}>&gt;</button>
					</div>
					<div class="mgr-bt-teams">
						<div class="mgr-bt-side">
							<div class="mgr-bt-side-title">HUMON</div>
							<div class="mgr-bt-sprite-row">
								<div class="mgr-bt-sideconds-col">${p1CondHtml}</div>
								${p1SpriteHtml}
								<div class="mgr-bt-cond-col">${p1ActiveCondHtml}</div>
							</div>
							${p1Html}
						</div>
						<div class="mgr-bt-field">
							${fieldHtml}
						</div>
						<div class="mgr-bt-side">
							<div class="mgr-bt-side-title">${esc(opponent)}</div>
							<div class="mgr-bt-sprite-row">
								<div class="mgr-bt-sideconds-col">${p2CondHtml}</div>
								${p2SpriteHtml}
								<div class="mgr-bt-cond-col">${p2ActiveCondHtml}</div>
							</div>
							${p2Html}
						</div>
					</div>
					<div class="mgr-bt-log">${events}</div>
					${resultBar}
				</div>
			</div>
		</section>`;
}

function debugHtml(game: GameState): string {
	const busy = game.humons.filter((h) => h.action);
	const idle = game.humons.filter((h) => !h.action);
	const humonOpts =
		idle.length === 0
			? '<option value="">NO IDLE HUMONS</option>'
			: idle.map((h) => option(h.id, `${humonName(h)} LV ${h.level}`, false)).join('');
	return `
		<section class="mgr-section">
			<h2 class="mgr-section-title">DEBUG CONTROLS</h2>
			<div class="mgr-section-body">
				<p class="mgr-note">ALL ACTIONS RESOLVE IMMEDIATELY. NO TIMERS.</p>
				<div class="mgr-form">
					<button class="mgr-btn mgr-btn-danger" data-mgr-action="debug-resolve-all" ${busy.length === 0 ? 'disabled' : ''}>RESOLVE ALL (${busy.length} PENDING)</button>
				</div>
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">INSTANT TRAIN</h2>
			<div class="mgr-section-body">
				<div class="mgr-form">
					<label class="mgr-label">HUMON <select class="mgr-select" data-mgr-select="humon">${humonOpts}</select></label>
					<button class="mgr-btn" data-mgr-action="debug-train" ${idle.length === 0 ? 'disabled' : ''}>TRAIN NOW</button>
				</div>
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">INSTANT TRAVEL</h2>
			<div class="mgr-section-body">
				<div class="mgr-form">
					<label class="mgr-label">HUMON <select class="mgr-select" data-mgr-select="humon-travel">${humonOpts}</select></label>
					<label class="mgr-label">TOWN <select class="mgr-select" data-mgr-select="town">${TOWN_PLAYER_NUMBERS.map((n) => {
						const p = findPlayer(n);
						return option(String(n), p?.hometown ?? '???', false);
					}).join('')}</select></label>
					<button class="mgr-btn" data-mgr-action="debug-travel" ${idle.length === 0 ? 'disabled' : ''}>TRAVEL NOW</button>
				</div>
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">INSTANT GYM BATTLE</h2>
			<div class="mgr-section-body">
				<p class="mgr-note">RUNS REAL SHOWDOWN BATTLE, THEN RESOLVES IMMEDIATELY.</p>
				<div class="mgr-form">
					<label class="mgr-label">HUMON <select class="mgr-select" data-mgr-select="humon-gym">${humonOpts}</select></label>
					<label class="mgr-label">GYM <select class="mgr-select" data-mgr-select="boss">${BOSS_PLAYER_NUMBERS.map((n) => {
						const p = findPlayer(n);
						return option(String(n), p?.name ?? '???', false);
					}).join('')}</select></label>
					<button class="mgr-btn" data-mgr-action="debug-gym" ${idle.length === 0 ? 'disabled' : ''}>BATTLE NOW</button>
				</div>
			</div>
		</section>
		${game.humons.filter((h) => h.lastBattle && h.lastBattle.turns.length > 0).map((h) => battleViewerHtml(h)).join('')}
		<section class="mgr-section">
			<h2 class="mgr-section-title">ALL HUMONS (${game.humons.length})</h2>
			<div class="mgr-section-body mgr-grid">
				${game.humons.map(humonCard).join('')}
			</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">RECENT ACTIVITY</h2>
			<div class="mgr-section-body">${logHtml(game)}</div>
		</section>`;
}

function unlocksHtml(game: GameState): string {
	const visitRows = HIDDEN_PAGE_NUMBERS.map((page) => {
		const visited = game.visited.includes(page);
		return `
			<div class="mgr-visit-row">
				<span class="mgr-visit-num">${page}</span>
				<span>${PAGE_LABELS[page] ?? '???'}</span>
				<span class="mgr-visit-state ${visited ? 'mgr-visit-ok' : 'mgr-visit-miss'}">${visited ? 'VISITED' : 'NOT FOUND'}</span>
			</div>`;
	}).join('');
	const shop = SECRET_HUMON_KEYS.map((key) => {
		const spec = SECRET_HUMONS[key];
		const owned = game.unlocked.includes(key);
		const found = game.visited.includes(spec.page);
		const affordable = game.currency >= spec.cost;
		const disabled = owned || !found || !affordable;
		const label = owned
			? 'IN SQUAD'
			: !found
				? `FIND PAGE ${spec.page}`
				: !affordable
					? `NEED $${spec.cost}`
					: key === 'joak'
						? 'BUY JOAK BALL'
						: 'ENLIST';
		return `
			<div class="mgr-card" ${owned ? 'data-dim="true"' : ''}>
				<div class="mgr-card-head">
					${spriteHtml(spec.sprite, '3rem')}
					<span class="mgr-name">${esc(spec.name)}</span>
					<span class="mgr-tag">$${spec.cost}</span>
				</div>
				<p class="mgr-note">${esc(spec.blurb)}</p>
				<p class="mgr-note">FOUND ON PAGE ${spec.page}</p>
				<button class="mgr-btn" data-mgr-action="unlock" data-mgr-key="${key}" ${disabled ? 'disabled' : ''}>${label}</button>
			</div>`;
	}).join('');
	return `
		<section class="mgr-section">
			<h2 class="mgr-section-title">VISITED PAGES</h2>
			<div class="mgr-section-body">${visitRows}</div>
		</section>
		<section class="mgr-section">
			<h2 class="mgr-section-title">SECRET HUMON SHOP</h2>
			<div class="mgr-section-body mgr-grid">${shop}</div>
		</section>`;
}

function countdownHtml(action: Action): string {
	if (actionRemaining(action) <= 0) return '<span class="mgr-busy">RESOLVING...</span>';
	return `<span class="mgr-countdown" data-countdown data-countdown-start="${action.startedAt}" data-countdown-duration="${action.durationMs}">${formatDuration(actionRemaining(action))}</span>`;
}

function logHtml(game: GameState): string {
	if (game.log.length === 0) return '<p class="mgr-empty">NO ACTIVITY YET.</p>';
	return `<ul class="mgr-log">${game.log.map((entry) => `<li><span class="mgr-log-time">${timeStamp(entry.at)}</span>${esc(entry.text)}</li>`).join('')}</ul>`;
}

function timeStamp(at: number): string {
	const date = new Date(at);
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function spriteHtml(sprite: { map: string[]; palette: Record<string, string> }, size = '3rem'): string {
	const cols = sprite.map[0]?.length ?? 0;
	const cells = sprite.map
		.flatMap((row) =>
			[...row].map((char) =>
				char === '.' ? '<span></span>' : `<span style="background:${sprite.palette[char]}"></span>`,
			),
		)
		.join('');
	return `<span class="mgr-sprite" style="--mgr-cols:${cols};--mgr-size:${size}">${cells}</span>`;
}

function monHtml(name: string): string {
	const sprite = POKEMON_SPRITES[name];
	const types = POKEMON_TYPES[name];
	const img = sprite ? `<img class="mgr-mon-img" src="${sprite}" alt="" loading="lazy">` : '';
	const typeHtml = types ? types.map((type) => `<span class="mgr-type" data-type="${esc(type)}">${esc(type)}</span>`).join('') : '';
	return `<span class="mgr-mon">${img}<span class="mgr-mon-name">${esc(name)}</span><span class="mgr-mon-types">${typeHtml}</span></span>`;
}

function pokemonSpriteHtml(species: string, side: string): string {
	const key = speciesToKey(species);
	const sprite = POKEMON_SPRITES[key];
	if (!sprite) return '';
	return `<div class="mgr-bt-sprite" data-bt-side="${esc(side)}"><img src="${sprite}" alt="${esc(species)}" loading="lazy" /></div>`;
}

function triggerSpriteAnimations(): void {
	const turn = battleViewTurns[battleViewTurn];
	if (!turn) return;
	const hitSides = new Set<string>();
	const healSides = new Set<string>();
	for (const ev of turn.events) {
		if (ev.type === 'move' || ev.type === 'crit' || ev.type === 'supereffective') {
			const m = ev.text.match(/on (.+?)!/);
			if (m) {
				const targetName = m[1];
				for (const p of (turn.p2 ?? [])) { if (p.nickname === targetName || p.species === targetName) hitSides.add('p2'); }
				for (const p of (turn.p1 ?? [])) { if (p.nickname === targetName || p.species === targetName) hitSides.add('p1'); }
			}
			const m2 = ev.text.match(/used .+ on (.+)/);
			if (m2) {
				const targetName = m2[1];
				for (const p of (turn.p2 ?? [])) { if (p.nickname === targetName || p.species === targetName) hitSides.add('p2'); }
				for (const p of (turn.p1 ?? [])) { if (p.nickname === targetName || p.species === targetName) hitSides.add('p1'); }
			}
		}
		if (ev.type === 'heal') {
			const m = ev.text.match(/^(.+?) healed/);
			if (m) {
				const name = m[1];
				for (const p of (turn.p1 ?? [])) { if (p.nickname === name || p.species === name) healSides.add('p1'); }
				for (const p of (turn.p2 ?? [])) { if (p.nickname === name || p.species === name) healSides.add('p2'); }
			}
		}
	}
	for (const side of hitSides) {
		const el = document.querySelector(`.mgr-bt-sprite[data-bt-side="${side}"]`);
		if (el) { el.classList.remove('mgr-bt-sprite-hit'); void (el as HTMLElement).offsetWidth; el.classList.add('mgr-bt-sprite-hit'); }
	}
	for (const side of healSides) {
		const el = document.querySelector(`.mgr-bt-sprite[data-bt-side="${side}"]`);
		if (el) { el.classList.remove('mgr-bt-sprite-heal'); void (el as HTMLElement).offsetWidth; el.classList.add('mgr-bt-sprite-heal'); }
	}
}

function option(value: string, label: string, selected: boolean): string {
	return `<option value="${value}"${selected ? ' selected' : ''}>${esc(label)}</option>`;
}

function formatDuration(ms: number): string {
	const total = Math.max(0, Math.ceil(ms / 1000));
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const seconds = total % 60;
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function esc(value: string): string {
	return value.replace(/[&<>"']/g, (char) => {
		const map: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
		};
		return map[char] ?? char;
	});
}

function onClick(event: Event): void {
	const target = event.target as HTMLElement | null;
	if (!target || typeof target.closest !== 'function') return;
	const el = target.closest('[data-mgr-action]') as HTMLElement | null;
	if (!el) return;
	const action = el.dataset.mgrAction ?? '';
	handleAction(action, el);
}

function handleAction(action: string, el: HTMLElement): void {
	if (!state) return;
	const mount = el.closest('[data-manager-feature], [data-manager-secret]') as HTMLElement | null;
	const selectValue = (attr: string): string =>
		mount?.querySelector<HTMLSelectElement>(`[data-mgr-select="${attr}"]`)?.value ?? '';
	let result: { ok: true } | { ok: false; error: string };
	switch (action) {
		case 'train': {
			const humonId = selectValue('humon');
			result = humonId ? startAction(state, humonId, 'train') : { ok: false, error: 'PICK A HUMON' };
			break;
		}
		case 'travel': {
			const humonId = selectValue('humon');
			const town = Number(selectValue('town'));
			result =
				humonId && !Number.isNaN(town)
					? startAction(state, humonId, 'travel', town)
					: { ok: false, error: 'PICK A HUMON AND A TOWN' };
			break;
		}
		case 'gym': {
			const boss = Number(el.dataset.boss);
			const humonId = mount?.querySelector<HTMLSelectElement>(`[data-mgr-select="humon"][data-boss="${boss}"]`)?.value ?? '';
			if (!humonId) { result = { ok: false, error: 'PICK A HUMON' }; break; }
			result = { ok: true };
			// Disable the button while the battle runs
			el.setAttribute('disabled', '');
			el.textContent = 'BATTLE IN PROGRESS...';
			startGymAction(state, humonId, boss).then((battleResult) => {
				if (!battleResult.ok) {
					log(state, battleResult.error);
				} else {
					// Log the battle replay
					const winner = battleResult.win ? 'WIN' : 'LOSS';
					log(state, `BATTLE RESULT: ${winner}`);
					for (const line of battleResult.log) {
						if (line.startsWith('|move|')) {
							const parts = line.split('|');
							const attacker = parts[2] ?? '';
							const move = parts[3] ?? '';
							const defender = parts[4] ?? '';
							if (attacker && move && defender) {
								log(state, `${attacker} USED ${move} VS ${defender}`);
							}
						} else if (line.startsWith('|faint|')) {
							const parts = line.split('|');
							const fainted = parts[2] ?? '';
							if (fainted) log(state, `${fainted} FAINTED!`);
						} else if (line.startsWith('|-supereffective|')) {
							const parts = line.split('|');
							const target = parts[2] ?? '';
							if (target) log(state, `SUPER EFFECTIVE ON ${target}!`);
						}
					}
				}
				saveState(state);
				renderAll();
				startCountdown();
			});
			return;
		}
		case 'unlock': {
			const key = el.dataset.mgrKey as SecretHumonKey;
			result = unlockSecret(state, key);
			break;
		}
		case 'use-rare-candy': {
			const humonId = el.dataset.humon ?? '';
			result = useRareCandy(state, humonId);
			break;
		}
		case 'debug-resolve-all': {
			forceResolveAll(state);
			log(state, 'DEBUG: ALL ACTIONS FORCE-RESOLVED');
			result = { ok: true };
			break;
		}
		case 'debug-train': {
			const humonId = selectValue('humon');
			if (!humonId) { result = { ok: false, error: 'PICK A HUMON' }; break; }
			const trainResult = startAction(state, humonId, 'train');
			if (!trainResult.ok) { result = trainResult; break; }
			forceResolveAll(state);
			log(state, 'DEBUG: TRAINING FORCE-RESOLVED');
			result = { ok: true };
			break;
		}
		case 'debug-travel': {
			const humonId = selectValue('humon-travel');
			const town = Number(selectValue('town'));
			if (!humonId || Number.isNaN(town)) { result = { ok: false, error: 'PICK A HUMON AND A TOWN' }; break; }
			const travelResult = startAction(state, humonId, 'travel', town);
			if (!travelResult.ok) { result = travelResult; break; }
			forceResolveAll(state);
			log(state, 'DEBUG: TRAVEL FORCE-RESOLVED');
			result = { ok: true };
			break;
		}
		case 'debug-gym': {
			const humonId = selectValue('humon-gym');
			const boss = Number(selectValue('boss'));
			if (!humonId || Number.isNaN(boss)) { result = { ok: false, error: 'PICK A HUMON AND A GYM' }; break; }
			result = { ok: true };
			el.setAttribute('disabled', '');
			el.textContent = 'BATTLE IN PROGRESS...';
			startGymAction(state, humonId, boss).then((battleResult) => {
				if (!battleResult.ok) {
					log(state, battleResult.error);
				} else {
					const winner = battleResult.win ? 'WIN' : 'LOSS';
					log(state, `DEBUG: BATTLE RESULT: ${winner}`);
					for (const line of battleResult.log) {
						if (line.startsWith('|move|')) {
							const parts = line.split('|');
							const attacker = parts[2] ?? '';
							const move = parts[3] ?? '';
							const defender = parts[4] ?? '';
							if (attacker && move && defender) log(state, `${attacker} USED ${move} VS ${defender}`);
						} else if (line.startsWith('|faint|')) {
							const parts = line.split('|');
							const fainted = parts[2] ?? '';
							if (fainted) log(state, `${fainted} FAINTED!`);
						} else if (line.startsWith('|-supereffective|')) {
							const parts = line.split('|');
							const target = parts[2] ?? '';
							if (target) log(state, `SUPER EFFECTIVE ON ${target}!`);
						}
					}
					forceResolveAll(state);
					log(state, 'DEBUG: GYM ACTION FORCE-RESOLVED');
				}
				saveState(state);
				renderAll();
				startCountdown();
			});
			return;
		}
		case 'bt-prev': {
			if (battleViewTurn > 0) battleViewTurn--;
			const t = battleViewTurns[battleViewTurn];
			if (t) console.log(`[battle turn ${t.turn}]`, t.raw);
			result = { ok: true };
			break;
		}
		case 'bt-next': {
			if (battleViewTurn < battleViewTurns.length - 1) battleViewTurn++;
			const t = battleViewTurns[battleViewTurn];
			if (t) console.log(`[battle turn ${t.turn}]`, t.raw);
			result = { ok: true };
			break;
		}
		default:
			return;
	}
	if (!result.ok) log(state, result.error);
	saveState(state);
	renderAll();
	triggerSpriteAnimations();
	startCountdown();
}

function onChange(event: Event): void {
	const target = event.target as HTMLSelectElement | null;
	if (!target || typeof target.matches !== 'function' || !target.matches('[data-mgr-select]')) return;
	const mount = target.closest('[data-manager-feature]') as HTMLElement | null;
	if (!mount || !state) return;
	const feature = mount.dataset.managerFeature as Feature | undefined;
	if (feature === 'travel') {
		const preview = mount.querySelector<HTMLElement>('[data-mgr-preview="travel"]');
		if (preview) preview.innerHTML = travelPreviewHtml(state, mount);
	}
}

function startCountdown(): void {
	stopCountdown();
	if (!state) return;
	const tick = (): void => {
		let needsResolve = false;
		for (const el of document.querySelectorAll<HTMLElement>('[data-countdown]')) {
			const started = Number(el.dataset.countdownStart);
			const duration = Number(el.dataset.countdownDuration);
			const remaining = Math.max(0, started + duration - Date.now());
			el.textContent = remaining > 0 ? formatDuration(remaining) : 'RESOLVING...';
			if (remaining <= 0) needsResolve = true;
		}
		if (needsResolve) refresh();
	};
	tick();
	countdownTimer = window.setInterval(tick, 1000);
}

function stopCountdown(): void {
	if (countdownTimer !== undefined) {
		window.clearInterval(countdownTimer);
		countdownTimer = undefined;
	}
}
