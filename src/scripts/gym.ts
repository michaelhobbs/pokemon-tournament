import { findPlayer, PLAYERS, type Player } from '../data/players';
import { POKEMON_TYPES } from '../data/pokemon';
import { POKEMON_SPRITES } from '../data/pokemon-sprites';
import { spriteFor } from '../data/trainer-sprites';
import { TROPHY_SPRITE } from '../data/trophy';
import { applySwaps, swapsFor } from '../data/midseason';
import { speciesToKey } from '../lib/battle';
import {
	GymBattle,
	HUMAN_NAME,
	needsTarget,
	targetOptionsFor,
	moveEffectiveness,
	labelStatus,
	labelWeather,
	labelTerrain,
	labelSideCondition,
	type GymSnapshot,
	type GymPrompt,
	type GymMonView,
	type GymActivePromptData,
} from '../lib/gym-battle';
import { describeRule, ruleChipLabel } from '../lib/gym-descriptions';
import { dexTypes, importTeamText, monSprite, onMonSprites, spreadText, type ImportedMon } from '../lib/team-import';

type Step = 'trainer' | 'foe-draft' | 'custom-import' | 'draft' | 'battle';

interface PendingMove {
	type: 'move';
	slotIndex: number;
	moveSlot: number;
	locStr?: string;
}

interface PendingSwitch {
	type: 'switch';
	slotIndex: number;
	pos: number;
}

type PendingAction = PendingMove | PendingSwitch;

/** Mid-season team: initial draft with swaps applied. */
function currentTeam(player: Player): string[] {
	return applySwaps(player.team, swapsFor(player.number));
}

const ALL_POOL: string[] = [...new Set(PLAYERS.flatMap(currentTeam))];

let step: Step = 'trainer';
let opponentNumber: number | null = null;
let foeTeam: string[] = [];
let pickedTeam: string[] = [];
let customFoeTeam: ImportedMon[] | null = null;
let foeImportOpen = false;
let foeImportText = '';
let foeImportError: string | null = null;
let ownImportTeam: ImportedMon[] | null = null;
let ownImportOpen = false;
let ownImportText = '';
let ownImportError: string | null = null;
let battle: GymBattle | null = null;
let snapshot: GymSnapshot | null = null;
let prompt: GymPrompt | null = null;
let outcome: { win: boolean; tie: boolean } | null = null;
let pending: (PendingAction | null)[] = [null, null];
let awaitingTarget: { slotIndex: number; moveSlot: number } | null = null;
let teraFlags: boolean[] = [false, false];
let teamOrder: number[] = [];
let forcedPicks: Record<number, number> = {};
let battleError: string | null = null;

interface GymWindow extends Window {
	ceefaxGymInstalled?: boolean;
	ceefaxGymPageLoadAttached?: boolean;
}

const gymWindow = window as GymWindow;

export function initGym(): void {
	if (!gymWindow.ceefaxGymInstalled) {
		gymWindow.ceefaxGymInstalled = true;
		document.addEventListener('click', onClick);
		document.addEventListener('mouseover', onDescInspect);
		document.addEventListener('focusin', onDescInspect);
		document.addEventListener('mouseout', onDescLeave);
		document.addEventListener('focusout', onDescLeave);
		document.addEventListener('scroll', hideDescTip, true);
		onMonSprites(() => {
			if (mount()) render();
		});
	}
	if (!gymWindow.ceefaxGymPageLoadAttached) {
		gymWindow.ceefaxGymPageLoadAttached = true;
		document.addEventListener('astro:page-load', render);
	}
	render();
}

function mount(): HTMLElement | null {
	return document.getElementById('gym-app');
}

function render(): void {
	const root = mount();
	if (!root) return;
	switch (step) {
		case 'trainer':
			root.innerHTML = trainerHtml();
			break;
		case 'foe-draft':
			root.innerHTML = foeDraftHtml();
			break;
		case 'custom-import':
			root.innerHTML = customImportHtml();
			break;
		case 'draft':
			root.innerHTML = draftHtml();
			break;
		case 'battle':
			root.innerHTML = battleHtml();
			scrollLog();
			break;
	}
	syncDescTip();
}

/* ---------- step 1: trainer select ---------- */

function trainerHtml(): string {
	const cards = PLAYERS.map((player) => {
		const sprite = spriteFor(player.number);
		return `
			<div class="gym-card">
				<div class="gym-card-head">
					${pixelSpriteHtml(sprite.map, sprite.palette)}
					<div>
						<div class="gym-card-name">${esc(player.name)}</div>
						<div class="gym-card-epithet">${esc(player.epithet)}</div>
						<div class="gym-card-hometown">${esc(player.hometown.toUpperCase())}</div>
					</div>
				</div>
				<div class="gym-team-chips">${currentTeam(player).map((name) => monChipHtml(name)).join('')}</div>
				<button class="mgr-btn gym-btn-wide" data-gym="pick-trainer" data-num="${player.number}">CHALLENGE ${esc(player.name.toUpperCase())}</button>
			</div>`;
	}).join('');
	return `
		<section class="gym-section">
			<h2 class="gym-title">CHOOSE YOUR OPPONENT</h2>
			<p class="gym-note">DOUBLES BATTLE - BOTH SIDES BRING 4. PICK THEIR TEAM, OR LET FATE DECIDE.</p>
			<div class="gym-trainer-grid">${cards}${customTrainerCardHtml()}</div>
		</section>`;
}

/** Same-size tile as the trainer cards, offering the Showdown import flow. */
function customTrainerCardHtml(): string {
	return `
		<div class="gym-card gym-card-custom">
			<div class="gym-card-head">
				${pixelSpriteHtml(TROPHY_SPRITE.map, TROPHY_SPRITE.palette)}
				<div>
					<div class="gym-card-name">CUSTOM CHALLENGE</div>
					<div class="gym-card-epithet">IMPORT A TEAM</div>
					<div class="gym-card-hometown">POKEMON SHOWDOWN FORMAT</div>
				</div>
			</div>
			<div class="gym-team-chips"><span class="gym-chip">THE GYM USES ANY 4 POKEMON YOU BRING</span></div>
			<button class="mgr-btn gym-btn-wide" data-gym="pick-custom">CUSTOM: IMPORT A CUSTOM TEAM</button>
		</div>`;
}

/* ---------- step 2: opponent team ---------- */

function foeDraftHtml(): string {
	const foe = opponent();
	if (!foe) return trainerHtml();
	const mons = currentTeam(foe)
		.map((name) => {
			const index = foeTeam.indexOf(name);
			const selected = index >= 0;
			return `
				<button class="gym-mon-pick${selected ? ' is-selected' : ''}" data-gym="toggle-foe-mon" data-name="${esc(name)}">
					<span class="gym-pick-order">${selected ? index + 1 : ''}</span>
					<img src="${POKEMON_SPRITES[name] ?? ''}" alt="" loading="lazy" />
					<span class="gym-mon-name">${esc(name)}</span>
					<span class="gym-mon-types">${typesHtml(name)}</span>
				</button>`;
		})
		.join('');
	const ready = foeTeam.length === 4;
	return `
		<section class="gym-section">
			<h2 class="gym-title">CHOOSE ${esc(foe.name.toUpperCase())}'S TEAM</h2>
			<p class="gym-note">THEY BRING 4 OF THEIR 6 - HANDPICK A GAUNTLET OR SPIN THE WHEEL.</p>
			<div class="gym-draft-bar">
				<span class="gym-count">SELECTED <strong>${foeTeam.length}</strong>/4</span>
				<button class="mgr-btn" data-gym="back-to-trainers">&larr; BACK</button>
				<button class="mgr-btn mgr-btn-danger" data-gym="clear-foe-draft" ${foeTeam.length === 0 ? 'disabled' : ''}>CLEAR</button>
				<button class="mgr-btn" data-gym="random-foe">RANDOM 4 &raquo;</button>
				<button class="mgr-btn" data-gym="confirm-foe" ${ready ? '' : 'disabled'}>NEXT: YOUR DRAFT &raquo;</button>
			</div>
			<div class="gym-draft-grid">${mons}</div>
		</section>`;
}

/* ---------- step 2: imported foe team ---------- */

const IMPORT_PLACEHOLDER = [
	'Garchomp @ Choice Scarf',
	'Ability: Rough Skin',
	'Tera Type: Dragon',
	'EVs: 252 Atk / 4 SpD / 252 Spe',
	'Jolly Nature',
	'- Earthquake',
	'- Dragon Claw',
	'',
	'Typhlosion-Hisui @ Choice Specs',
	'Ability: Flash Fire',
	'...',
].join('\n');

function customImportHtml(): string {
	return `
		<section class="gym-section">
			<h2 class="gym-title">CUSTOM CHALLENGE - THE GYM'S TEAM</h2>
			<p class="gym-note">IMPORT A TEAM IN POKEMON SHOWDOWN EXPORT FORMAT FOR THE GYM TO USE AGAINST YOU. IT MUST CONTAIN EXACTLY 4 POKEMON AND PASS VALIDATION BEFORE YOU DRAFT.</p>
			<div class="gym-draft-bar">
				<button class="mgr-btn" data-gym="back-to-trainers">&larr; BACK</button>
				${customFoeTeam
					? `<button class="mgr-btn" data-gym="reimport-foe">IMPORT A DIFFERENT TEAM</button>
				<button class="mgr-btn" data-gym="confirm-custom-foe">NEXT: YOUR DRAFT &raquo;</button>`
					: `<button class="mgr-btn" data-gym="open-foe-import">IMPORT TEAM TEXT</button>`}
			</div>
			${foeImportOpen && !customFoeTeam ? importFormHtml('foe', foeImportText, foeImportError) : ''}
			${customFoeTeam ? importedPreviewHtml(customFoeTeam) : ''}
		</section>`;
}

function importFormHtml(kind: 'foe' | 'own', text: string, error: string | null): string {
	return `
		<div class="gym-import">
			<label class="gym-sub" for="gym-import-text">${kind === 'foe' ? 'GYM TEAM TEXT' : 'YOUR TEAM TEXT'} - SHOWDOWN EXPORT FORMAT</label>
			<textarea id="gym-import-text" class="gym-import-text" rows="16" spellcheck="false" placeholder="${esc(IMPORT_PLACEHOLDER)}">${esc(text)}</textarea>
			<div class="gym-draft-bar">
				<button class="mgr-btn" data-gym="submit-${kind}-import">PARSE &amp; VALIDATE &raquo;</button>
				<button class="mgr-btn mgr-btn-danger" data-gym="cancel-${kind}-import">CANCEL</button>
			</div>
			${error ? `<p class="gym-import-error">${esc(error)}</p>` : ''}
		</div>`;
}

function importedPreviewHtml(mons: ImportedMon[]): string {
	return `<div class="gym-import-grid">${mons.map((mon, i) => importedMonCardHtml(mon, i)).join('')}</div>`;
}

function importedMonCardHtml(mon: ImportedMon, index: number): string {
	const natureRow =
		mon.nature || mon.teraType
			? `<div class="gym-import-row"><span class="gym-sub">NATURE:</span> ${esc((mon.nature ?? '-').toUpperCase())}${
					mon.teraType ? ` <span class="gym-chip">TERA ${esc(mon.teraType.toUpperCase())}</span>` : ''
				}</div>`
			: '';
	return `
		<div class="gym-mon-pick gym-import-card">
			<span class="gym-pick-order">${index + 1}</span>
			${monImgHtml(mon.species)}
			<span class="gym-mon-name">${esc(mon.label.toUpperCase())}${mon.nickname ? ` <small>(${esc(mon.species.toUpperCase())})</small>` : ''}</span>
			<span class="gym-mon-types">${typesHtml(mon.species)}</span>
			<div class="gym-import-detail">
				${mon.item ? `<div class="gym-import-row"><span class="gym-sub">ITEM:</span> ${esc(mon.item.toUpperCase())}</div>` : ''}
				${mon.ability ? `<div class="gym-import-row"><span class="gym-sub">ABILITY:</span> ${esc(mon.ability.toUpperCase())}</div>` : ''}
				${natureRow}
				<div class="gym-import-moves">${mon.moves.length > 0 ? mon.moves.map((move) => esc(move.toUpperCase())).join(' &middot; ') : '-'}</div>
				<div class="gym-import-spread">EVs: ${esc(spreadText(mon.evs) || 'NONE SPENT')}</div>
				${mon.ivs.length > 0 ? `<div class="gym-import-spread gym-import-ivs">IVs: ${esc(spreadText(mon.ivs))}</div>` : ''}
				<div class="gym-import-spread">LV ${mon.level}</div>
			</div>
		</div>`;
}

/* ---------- step 2: draft ---------- */

function draftPool(): string[] {
	if (customFoeTeam) {
		const banned = new Set(customFoeTeam.flatMap((mon) => [mon.species, speciesToKey(mon.species)]));
		return ALL_POOL.filter((name) => !banned.has(name));
	}
	const foe = opponent();
	if (!foe) return ALL_POOL;
	const banned = new Set(currentTeam(foe));
	return ALL_POOL.filter((name) => !banned.has(name));
}

interface NameSpecies {
	label: string;
	species: string;
}

/** Everything the opponent owns, hence off-limits in your draft - imported teams bring exactly their four. */
function foeBannedList(): NameSpecies[] {
	if (customFoeTeam) return customFoeTeam.map((mon) => ({ label: mon.label, species: mon.species }));
	return currentTeamOfOpponent().map((name) => ({ label: name, species: name }));
}

/** The foe's chosen four as label/species pairs - imported teams included. */
function foeNameList(): NameSpecies[] {
	if (customFoeTeam) return customFoeTeam.map((mon) => ({ label: mon.label, species: mon.species }));
	return foeTeam.map((name) => ({ label: name, species: name }));
}

function currentTeamOfOpponent(): string[] {
	const foe = opponent();
	return foe ? currentTeam(foe) : [];
}

function humanReady(): boolean {
	return ownImportTeam !== null || pickedTeam.length === 4;
}

function draftHtml(): string {
	if (!customFoeTeam && !opponent()) return trainerHtml();
	const bannedChips = foeBannedList()
		.map(({ label, species }) => `<span class="gym-banned">${bannedChipHtml(label, species)}</span>`)
		.join('');
	if (ownImportTeam) {
		return `
			<section class="gym-section">
				<h2 class="gym-title">DRAFT VS ${esc(opponentLabel().toUpperCase())}</h2>
				<p class="gym-note">YOUR IMPORTED TEAM PASSED VALIDATION - IT WILL BE USED AS-IS.</p>
				<p class="gym-note">BANNED (THEIR TEAM): ${bannedChips}</p>
				<div class="gym-draft-bar">
					<button class="mgr-btn" data-gym="back-to-trainers">&larr; BACK</button>
					<button class="mgr-btn mgr-btn-danger" data-gym="clear-own-import">CLEAR IMPORT</button>
					<button class="mgr-btn" data-gym="start-battle">START BATTLE &raquo;</button>
				</div>
				${importedPreviewHtml(ownImportTeam)}
			</section>`;
	}
	const pool = draftPool();
	const mons = pool
		.map((name) => {
			const index = pickedTeam.indexOf(name);
			const selected = index >= 0;
			return `
				<button class="gym-mon-pick${selected ? ' is-selected' : ''}" data-gym="toggle-mon" data-name="${esc(name)}">
					<span class="gym-pick-order">${selected ? index + 1 : ''}</span>
					<img src="${POKEMON_SPRITES[name] ?? ''}" alt="" loading="lazy" />
					<span class="gym-mon-name">${esc(name)}</span>
					<span class="gym-mon-types">${typesHtml(name)}</span>
				</button>`;
		})
		.join('');
	const ready = pickedTeam.length === 4;
	return `
		<section class="gym-section">
			<h2 class="gym-title">DRAFT VS ${esc(opponentLabel().toUpperCase())}</h2>
			<p class="gym-note">PICK 4 POKEMON - YOU CHOOSE YOUR 2 LEADS AT TEAM PREVIEW.</p>
			<p class="gym-note">BANNED (THEIR TEAM): ${bannedChips}</p>
			<div class="gym-draft-bar">
				<span class="gym-count">SELECTED <strong>${pickedTeam.length}</strong>/4</span>
				<button class="mgr-btn" data-gym="back-to-trainers">&larr; BACK</button>
				<button class="mgr-btn mgr-btn-danger" data-gym="clear-draft" ${pickedTeam.length === 0 ? 'disabled' : ''}>CLEAR</button>
				<button class="mgr-btn" data-gym="open-own-import">IMPORT A CUSTOM TEAM</button>
				<button class="mgr-btn" data-gym="start-battle" ${ready ? '' : 'disabled'}>START BATTLE &raquo;</button>
			</div>
			${ownImportOpen ? importFormHtml('own', ownImportText, ownImportError) : ''}
			<div class="gym-draft-grid">${mons}</div>
		</section>`;
}

/* ---------- step 3: battle ---------- */

function battleHtml(): string {
	if (!snapshot) return '<p class="gym-note">CONNECTING TO BATTLE SIMULATOR...</p>';
	const foeActive = activeMons('p2');
	const youActive = activeMons('p1');
	const fieldBits: string[] = [];
	if (snapshot.weather) {
		const t = snapshot.weatherTimer;
		fieldBits.push(
			`<span class="gym-field-bit" tabindex="0" data-gym-desc="weather:${esc(snapshot.weather)}">&#9728; ${esc(labelWeather(snapshot.weather))}${t ? ` &middot; ${t.elapsed}/${t.total}T` : ''}</span>`,
		);
	}
	if (snapshot.terrain) {
		const t = snapshot.terrainTimer;
		fieldBits.push(
			`<span class="gym-field-bit" tabindex="0" data-gym-desc="terrain:${esc(snapshot.terrain)}">&#8779; ${esc(labelTerrain(snapshot.terrain))}${t ? ` &middot; ${t.elapsed}/${t.total}T` : ''}</span>`,
		);
	}
	return `
		<section class="gym-section gym-battle">
			<div class="gym-battle-head">
				<h2 class="gym-title">VS ${esc(opponentLabel().toUpperCase())}</h2>
				<span class="gym-turn">TURN ${snapshot.turn}</span>
			</div>
			${outcome ? resultOverlayHtml() : ''}
			<div class="gym-battle-columns">
				<div class="gym-main">
					<div class="gym-field">
						<div class="gym-side gym-side-foe">
							<div class="gym-side-title">${esc(opponentLabel().toUpperCase())}${sideConditionsHtml('p2')}</div>
							<div class="gym-active-row">${foeActive.map((mon, i) => activeCardHtml(mon, i)).join('') ?? '<span class="gym-empty-slot">...</span>'}</div>
							<div class="gym-bench-row">${benchHtml('p2')}</div>
						</div>
						<div class="gym-mid">${fieldBits.length > 0 ? fieldBits.join('<span class="gym-mid-sep"></span>') : 'NO FIELD EFFECTS'}</div>
						<div class="gym-side gym-side-you">
							<div class="gym-side-title">${HUMAN_NAME}${sideConditionsHtml('p1')}</div>
							<div class="gym-active-row">${youActive.map((mon, i) => activeCardHtml(mon, i)).join('') ?? '<span class="gym-empty-slot">...</span>'}</div>
							<div class="gym-bench-row">${benchHtml('p1')}</div>
						</div>
					</div>
					<div class="gym-action" id="gym-action">${actionHtml()}</div>
				</div>
				<aside class="gym-log-box"><div class="gym-log" id="gym-log">${logHtml()}</div></aside>
			</div>
		</section>`;
}

const STAGE_LABELS: Record<string, string> = {
	atk: 'ATK',
	def: 'DEF',
	spa: 'SPA',
	spd: 'SPD',
	spe: 'SPE',
	accuracy: 'ACC',
	evasion: 'EVA',
};

/** Stat-stage chips ("ATK +2"), green when raised, red when lowered. */
function stageChipsHtml(mon: GymMonView): string {
	return Object.entries(mon.stages)
		.sort((a, b) => b[1] - a[1])
		.map(
			([stat, delta]) =>
				`<span class="gym-stage ${delta > 0 ? 'is-pos' : 'is-neg'}" tabindex="0" data-gym-desc="stage:${esc(stat)}">${STAGE_LABELS[stat] ?? stat.toUpperCase()} ${delta > 0 ? '+' : ''}${delta}</span>`,
		)
		.join('');
}

function activeCardHtml(mon: GymMonView | null, slot: number): string {
	if (!mon) return '<span class="gym-empty-slot">EMPTY</span>';
	const hpColor = mon.fainted ? 'var(--ceefax-red)' : mon.hpPct > 50 ? 'var(--ceefax-green)' : mon.hpPct > 20 ? 'var(--ceefax-yellow)' : 'var(--ceefax-red)';
	const img = monImgHtml(mon.name, mon.species);
	return `
		<div class="gym-active${mon.fainted ? ' is-fainted' : ''}">
			<div class="gym-active-top">
				${img}
				<div class="gym-active-id">
					<span class="gym-active-name">${esc(mon.name)}</span>
					<span class="gym-active-lv">LV ${mon.level}</span>
				</div>
			</div>
			<div class="gym-hpbar"><span style="width:${mon.hpPct}%;background:${hpColor}"></span></div>
			<div class="gym-hplabel" style="color:${hpColor}">${mon.fainted ? 'FAINTED' : `${mon.hp}/${mon.maxHp} (${mon.hpPct}%)`}</div>
			<div class="gym-cond-row">
				${mon.status ? `<span class="gym-status-chip" tabindex="0" data-gym-desc="status:${esc(mon.status)}">${labelStatus(mon.status)}</span>` : ''}
				${stageChipsHtml(mon)}
				${mon.volatiles
					.slice(0, 5)
					.map(
						(v) =>
							`<span class="gym-volatile" tabindex="0" data-gym-desc="volatile:${esc(v)}">${esc(describeRule(`volatile:${v}`)?.title ?? v.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase())}</span>`,
					)
					.join('')}
				${mon.ability ? `<span class="gym-rule-chip gym-rule-ability" tabindex="0" data-gym-desc="ability:${esc(mon.ability)}">AB: ${esc(ruleChipLabel('ability', mon.ability))}</span>` : ''}
				${mon.item ? `<span class="gym-rule-chip gym-rule-item" tabindex="0" data-gym-desc="item:${esc(mon.item)}">IT: ${esc(ruleChipLabel('item', mon.item))}</span>` : ''}
			</div>
			<div class="gym-mon-types">${typesHtml(mon.name, mon.types, mon.species)}</div>
			${slot >= 0 ? `<span class="gym-slot-tag">SLOT ${slot + 1}</span>` : ''}
		</div>`;
}

/** The foe's four, with whatever state the sim has revealed - unrevealed counts as healthy bench. */
function foeTeamEntries(): OwnMon[] {
	return foeNameList().map(({ label, species }) => {
		// Illusion leaves two entries per name (the disguise + the real mon);
		// prefer whichever is on the field, else the most recently revealed.
		const matches = snapshot?.p2Mons.filter((m) => m.name === label || (species && m.species === species)) ?? [];
		const mon = matches.find((m) => m.activeSlot !== null) ?? matches[matches.length - 1];
		return {
			name: label,
			species: mon?.species ?? species,
			pos: 0,
			hpPct: mon?.hpPct ?? 100,
			fainted: mon?.fainted ?? false,
			status: mon?.status ?? null,
			active: !!mon && !mon.fainted && mon.activeSlot !== null,
		};
	});
}

function benchChipsHtml(bench: OwnMon[]): string {
	if (bench.length === 0) return `<span class="gym-bench-empty">NO BENCH</span>`;
	return bench
		.map(
			(mon) => `
			<span class="gym-bench-mon${mon.fainted ? ' is-fainted' : ''}" title="${esc(mon.name)}">
				${monImgHtml(mon.name, mon.species)}
				<span class="gym-bench-meta">${mon.fainted ? '&#10005;' : `${mon.hpPct}%`}${
					mon.status
						? ` <span class="gym-bench-status" tabindex="0" data-gym-desc="status:${esc(mon.status)}">${labelStatus(mon.status)}</span>`
						: ''
				}</span>
			</span>`,
		)
		.join('');
}

function benchHtml(side: 'p1' | 'p2'): string {
	if (!snapshot) return '';
	// Nothing has been sent out yet (team preview) - neither bench is decided.
	const preStart =
		snapshot.turn === 0 && snapshot.p1ActiveIdents.every((ident) => ident === null) && snapshot.p2ActiveIdents.every((ident) => ident === null);
	if (preStart) return '<span class="gym-bench-empty">...</span>';
	if (side === 'p1') return benchChipsHtml(myBench());
	return benchChipsHtml(foeTeamEntries().filter((mon) => !mon.active));
}

function activeMons(side: 'p1' | 'p2'): (GymMonView | null)[] {
	if (!snapshot) return [null, null];
	const idents = side === 'p1' ? snapshot.p1ActiveIdents : snapshot.p2ActiveIdents;
	const pool = snapshot[side === 'p1' ? 'p1Mons' : 'p2Mons'];
	return [0, 1].map((slot) => {
		const ident = idents[slot];
		if (!ident) {
			// fall back to any member flagged as this slot (pre-request state)
			return pool.find((mon) => !mon.fainted && mon.activeSlot === slot) ?? null;
		}
		return pool.find((mon) => mon.ident === ident) ?? null;
	});
}

function sideConditionsHtml(side: 'p1' | 'p2'): string {
	if (!snapshot) return '';
	const conds = side === 'p1' ? snapshot.p1SideConditions : snapshot.p2SideConditions;
	if (conds.length === 0) return '';
	return `<span class="gym-sideconds">${conds
		.map(
			(c) =>
				`<span class="gym-sidecond" tabindex="0" data-gym-desc="sidecond:${esc(c.id)}">${esc(labelSideCondition(c.id))}${c.timer ? ` ${c.timer.elapsed}/${c.timer.total}T` : ''}</span>`,
		)
		.join('')}</span>`;
}

/* ---------- description tooltip ---------- */

let descTarget: Element | null = null;

function ensureDescTip(): HTMLElement {
	let tip = document.getElementById('gym-desc-tip');
	if (!tip) {
		tip = document.createElement('div');
		tip.id = 'gym-desc-tip';
		tip.className = 'gym-desc-tip';
		tip.setAttribute('role', 'tooltip');
		document.body.appendChild(tip);
	}
	return tip;
}

/** Anchors the tip just below the focused element (flips above near the viewport bottom). */
function placeDescTip(): void {
	if (!descTarget) return;
	const tip = ensureDescTip();
	const rect = descTarget.getBoundingClientRect();
	const tipRect = tip.getBoundingClientRect();
	const margin = 8;
	let left = rect.left + rect.width / 2 - tipRect.width / 2;
	left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));
	let top = rect.bottom + 6;
	if (top + tipRect.height > window.innerHeight - margin) top = Math.max(margin, rect.top - tipRect.height - 6);
	tip.style.left = `${Math.round(left)}px`;
	tip.style.top = `${Math.round(top)}px`;
	tip.style.visibility = 'visible';
}

function showDescTip(target: Element): void {
	const tip = ensureDescTip();
	const key = target.getAttribute('data-gym-desc') ?? '';
	const desc = describeRule(key);
	if (!desc || (!desc.text && !desc.title)) {
		hideDescTip();
		return;
	}
	descTarget = target;
	tip.innerHTML =
		`<span class="gym-desc-title">${esc(desc.title)}</span><span class="gym-desc-text">${esc(desc.text)}</span>${key.startsWith('move:') ? moveMatchupHtml(key.slice('move:'.length)) : ''}`;
	placeDescTip();
}

/** Per-foe effectiveness lines for a move tooltip, colored like the old badges. */
function moveMatchupHtml(moveName: string): string {
	if (!snapshot) return '';
	const segs = activeMons('p2')
		.filter((m): m is GymMonView => !!m && !m.fainted)
		.map((mon) => {
			const eff = moveEffectiveness(moveName, mon);
			if (!eff) return null;
			const cls = eff.startsWith('NO EFFECT') ? ' gym-eff-none' : eff.includes('SUPER') ? ' gym-eff-super' : '';
			return `<span class="gym-eff${cls}">${esc(mon.name.toUpperCase())} ${esc(eff.toUpperCase())}</span>`;
		})
		.filter(Boolean);
	return segs.length ? `<span class="gym-desc-match">${segs.join('<span class="gym-eff-sep"> &middot; </span>')}</span>` : '';
}

function hideDescTip(): void {
	descTarget = null;
	const tip = document.getElementById('gym-desc-tip');
	if (tip) tip.style.visibility = 'hidden';
}

/** Re-anchors after battle re-renders; drops the tip if its host element is gone. */
function syncDescTip(): void {
	if (descTarget && descTarget.isConnected) showDescTip(descTarget);
	else hideDescTip();
}

function onDescInspect(event: Event): void {
	const target = event.target instanceof Element ? event.target.closest('[data-gym-desc]') : null;
	if (target) showDescTip(target);
}

function onDescLeave(event: Event): void {
	const from = event.target instanceof Element ? event.target.closest('[data-gym-desc]') : null;
	if (!from || from !== descTarget) return;
	const related = (event as MouseEvent).relatedTarget ?? (event as FocusEvent).relatedTarget;
	const to = related instanceof Element ? related.closest('[data-gym-desc]') : null;
	if (to === from) return;
	hideDescTip();
}

function logHtml(): string {
	if (!snapshot || snapshot.log.length === 0) return '<p class="gym-note">BATTLE STARTING...</p>';
	const tail = snapshot.log.slice(-60);
	return tail.map((line) => {
		let cls = '';
		if (/^--- TURN/.test(line)) cls = ' gym-log-turn';
		else if (line.startsWith('!')) cls = ' gym-log-error';
		else if (/FAINTED|YOU WIN|WINS!|TIE GAME/.test(line)) cls = ' gym-log-big';
		else if (/SUPER EFFECTIVE|CRITICAL/.test(line)) cls = ' gym-log-se';
		return `<div class="gym-log-line${cls}">${esc(line)}</div>`;
	}).join('');
}

/* ---------- action panel ---------- */

function actionHtml(): string {
	if (outcome) {
		return `<div class="gym-action-wait">${outcome.tie ? 'TIE GAME.' : outcome.win ? 'VICTORY!' : 'DEFEATED.'}</div>`;
	}
	if (battleError) {
		return `<div class="gym-action-wait gym-action-error">${esc(battleError)}</div>`;
	}
	if (!prompt) {
		return `<div class="gym-action-wait">${snapshot && snapshot.turn === 0 ? 'STARTING BATTLE...' : 'RESOLVING TURN...'}</div>`;
	}
	switch (prompt.kind) {
		case 'team':
			return teamPreviewHtml();
		case 'move':
			return movePromptHtml();
		case 'switch':
			return forcedSwitchHtml();
	}
}

function teamPreviewHtml(): string {
	const slots = ownImportTeam
		? ownImportTeam.map((mon) => ({ label: mon.label, species: mon.species }))
		: pickedTeam.map((name) => ({ label: name, species: undefined as string | undefined }));
	const buttons = slots
		.map(({ label, species }, i) => {
			const leadPos = teamOrder.indexOf(i);
			return `
				<button class="gym-mon-pick gym-team-order${leadPos >= 0 ? ' is-selected' : ''}" data-gym="team-order" data-pos="${i}">
					<span class="gym-pick-order">${leadPos >= 0 ? leadPos + 1 : ''}</span>
					${monImgHtml(label, species)}
					<span class="gym-mon-name">${esc(label)}</span>
				</button>`;
		})
		.join('');
	return `
		<div class="gym-prompt">
			<div class="gym-prompt-title">TEAM PREVIEW - PICK YOUR 2 LEADS</div>
			<div class="gym-draft-grid gym-draft-grid-sm">${buttons}</div>
			<div class="gym-prompt-actions">
				<button class="mgr-btn" data-gym="team-reset" ${teamOrder.length === 0 ? 'disabled' : ''}>RESET</button>
				<button class="mgr-btn" data-gym="team-confirm" ${teamOrder.length === 2 ? '' : 'disabled'}>SEND THEM OUT &raquo;</button>
			</div>
		</div>`;
}

function movePromptHtml(): string {
	if (!prompt || prompt.kind !== 'move') return '';
	const panels = prompt.actives.map((active, i) => slotPanelHtml(active, i)).join('');
	const needed = prompt.actives.length;
	const allReady = pending.slice(0, needed).every(Boolean);
	return `
		<div class="gym-prompt">
			<div class="gym-prompt-title">CHOOSE ACTIONS FOR BOTH POKEMON</div>
			<div class="gym-slot-panels">${panels}</div>
			<div class="gym-prompt-actions">
				<button class="mgr-btn mgr-btn-danger" data-gym="undo-all" ${allReady || teraFlags.slice(0, needed).some(Boolean) ? '' : 'disabled'}>UNDO ALL</button>
				<button class="mgr-btn" data-gym="send-turn" ${allReady ? '' : 'disabled'}>SEND TURN &raquo;</button>
			</div>
		</div>`;
}

function slotPanelHtml(active: GymActivePromptData, i: number): string {
	const pend = pending[i];
	const head = `
		<div class="gym-slot-head">
			<span class="gym-slot-name">${esc(active.mon.name.toUpperCase())}</span>
			${pend ? `<span class="gym-slot-pending">${pendingLabel(pend)}</span>` : `<span class="gym-slot-open">CHOOSING...</span>`}
			${pend ? `<button class="mgr-btn mgr-btn-sm" data-gym="undo-slot" data-slot="${i}">UNDO</button>` : ''}
		</div>`;
	if (pend) return `<div class="gym-slot-panel is-done">${head}<div class="gym-slot-body"></div></div>`;
	if (awaitingTarget && awaitingTarget.slotIndex === i) {
		const { moveSlot } = awaitingTarget;
		const move = active.moves.find((m) => m.slot === moveSlot);
		const mp = prompt && prompt.kind === 'move' ? prompt : null;
		const foeActive = mp ? activeMons('p2').filter((m): m is GymMonView => !!m) : [];
		const options = move && mp ? targetOptionsFor(move.target, move.name, mp.actives, i, foeActive) : [];
		const list =
			!move || options.length === 0
				? `<p class="gym-note">NO VALID TARGETS${move ? ` FOR ${esc(move.name.toUpperCase())}` : ''}</p>`
				: `
					<div class="gym-target-list">
						${options
							.map(
								(o) =>
									`<span class="gym-target-row"><button class="mgr-btn mgr-btn-sm" data-gym="choose-target" data-slot="${i}" data-move="${moveSlot}" data-loc="${o.loc}">${esc(o.label.toUpperCase())}</button>${o.effect ? ` <span class="gym-eff${o.effect.startsWith('NO EFFECT') ? ' gym-eff-none' : o.effect.includes('SUPER') ? ' gym-eff-super' : ''}">${esc(o.effect.toUpperCase())}</span>` : ''}</span>`,
							)
							.join('')}
					</div>
					<div class="gym-switches"><button class="mgr-btn mgr-btn-sm mgr-btn-danger" data-gym="cancel-target" data-slot="${i}">CANCEL</button></div>`;
		return `<div class="gym-slot-panel is-targeting">${head}<div class="gym-slot-body">
			<div class="gym-target-label">TARGET FOR ${esc((move?.name ?? '?').toUpperCase())}?</div>
			${list}
		</div></div>`;
	}
	const moves = active.moves
		.map((move) => {
			const disabled = move.disabled ? 'disabled' : '';
			const pp = move.maxpp > 0 ? ` <small>${move.pp}/${move.maxpp}</small>` : '';
			return `<button class="mgr-btn mgr-btn-sm gym-move-btn" data-gym="choose-move" data-slot="${i}" data-move="${move.slot}" data-gym-desc="move:${esc(move.name)}" ${disabled}>${esc(move.name.toUpperCase())}${pp}</button>`;
		})
		.join('');
	const bench = switchableBench(i);
	const switches = active.trapped
		? '<span class="gym-note">TRAPPED - NO SWITCH</span>'
		: bench.length === 0
			? '<span class="gym-note">NO BENCH LEFT</span>'
			: bench
					.map(
						(mon) =>
							`<button class="mgr-btn mgr-btn-sm" data-gym="choose-switch" data-slot="${i}" data-pos="${mon.pos}">${esc(mon.name.toUpperCase())} ${mon.hpPct}%</button>`,
					)
					.join('');
	const teraBtn = active.canTerastallize
		? `<button class="mgr-btn mgr-btn-sm gym-tera-btn${teraFlags[i] ? ' is-on' : ''}" data-gym="tera-toggle" data-slot="${i}" data-gym-desc="tera:${esc(active.canTerastallize)}">TERASTALLIZE &rarr; <span class="mgr-type" data-type="${esc(active.canTerastallize)}">${esc(active.canTerastallize.toUpperCase())}</span>${teraFlags[i] ? ' &#10003;' : ''}</button>`
		: '';
	return `
		<div class="gym-slot-panel">
			${head}
			<div class="gym-slot-body">
				<div class="gym-moves">${moves}</div>
				<div class="gym-switches"><span class="gym-sub">SWITCH:</span>${switches}</div>
				${teraBtn ? `<div class="gym-tera-row"><span class="gym-sub">MECHANIC:</span>${teraBtn}</div>` : ''}
			</div>
		</div>`;
}

function pendingLabel(pend: PendingAction): string {
	if (pend.type === 'switch') return `SWITCH &rarr; ${esc(pokemonAt(pend.pos)?.toUpperCase() ?? '?')}`;
	const move = prompt?.kind === 'move' ? prompt.actives[pend.slotIndex]?.moves.find((m) => m.slot === pend.moveSlot) : undefined;
	return `MOVE &rarr; ${esc((move?.name ?? '?').toUpperCase())}${pend.locStr ? ` &rarr; ${targetLabel(pend)}` : ''}${teraFlags[pend.slotIndex] ? ' +TERA' : ''}`;
}

function targetLabel(pend: PendingMove): string {
	if (!prompt || prompt.kind !== 'move' || pend.locStr === undefined) return '';
	const loc = Number(pend.locStr);
	const move = prompt.actives[pend.slotIndex]?.moves.find((m) => m.slot === pend.moveSlot);
	const foeActive = activeMons('p2').filter((m): m is GymMonView => !!m);
	const options = targetOptionsFor(move?.target ?? 'normal', move?.name ?? null, prompt.actives, pend.slotIndex, foeActive);
	return (options.find((o) => o.loc === loc)?.label ?? pend.locStr).toUpperCase();
}

function forcedSwitchHtml(): string {
	if (!prompt || prompt.kind !== 'switch') return '';
	const slots = prompt.slots
		.filter(({ must }) => must)
		.map(({ index }) => {
			const pickedPos = forcedPicks[index];
			const bench = switchableBench(index);
			const pass = !pickedPos && bench.length === 0;
			return `
				<div class="gym-slot-panel${pickedPos || pass ? ' is-done' : ''}">
					<div class="gym-slot-head">
						<span class="gym-slot-name">SLOT ${index + 1}</span>
						${
							pickedPos
								? `<span class="gym-slot-pending">&rarr; ${esc(pokemonAt(pickedPos)?.toUpperCase() ?? '?')}</span>`
								: pass
									? '<span class="gym-slot-open">NO ONE LEFT - PASS</span>'
									: '<span class="gym-slot-open">PICK REPLACEMENT</span>'
						}
					</div>
					${pickedPos || pass ? '' : `<div class="gym-slot-body"><div class="gym-switches">${bench
						.map((mon) => `<button class="mgr-btn mgr-btn-sm" data-gym="forced-pick" data-slot="${index}" data-pos="${mon.pos}">${esc(mon.name.toUpperCase())} ${mon.hpPct}%</button>`)
						.join('')}</div></div>`}
				</div>`;
		})
		.join('');
	// Every fainted slot needs either a replacement or an empty bench (pass).
	const allResolved = prompt.slots.filter(({ must }) => must).every(({ index }) => forcedPicks[index] !== undefined || switchableBench(index).length === 0);
	return `
		<div class="gym-prompt">
			<div class="gym-prompt-title gym-prompt-alert">A POKEMON FAINTED - CHOOSE REPLACEMENTS</div>
			<div class="gym-slot-panels">${slots}</div>
			<div class="gym-prompt-actions">
				<button class="mgr-btn" data-gym="forced-send" ${allResolved ? '' : 'disabled'}>SEND OUT &raquo;</button>
			</div>
		</div>`;
}

/* ---------- helpers ---------- */

function opponent(): Player | undefined {
	return opponentNumber === null ? undefined : findPlayer(opponentNumber);
}

/** Name shown for the opposing side - custom challenges have no trainer. */
function opponentLabel(): string {
	if (customFoeTeam) return 'CUSTOM GYM';
	return opponent()?.name ?? '???';
}

function pokemonAt(pos: number): string | undefined {
	return ownTeam().find((mon) => mon.pos === pos)?.name ?? pickedTeam[pos - 1];
}

interface OwnMon {
	name: string;
	species?: string;
	pos: number;
	hpPct: number;
	fainted: boolean;
	status: string | null;
	active: boolean;
}

/**
 * Our four drafted Pokemon, taken from the sim's own team listing.
 * Positions come from its live slot order - switches reshuffle it, so a
 * stale draft index would make "switch N" hit an active Pokemon.
 */
function ownTeam(): OwnMon[] {
	if (snapshot && snapshot.p1Roster.length > 0) {
		return [...snapshot.p1Roster]
			.sort((a, b) => a.teamPos - b.teamPos)
			.map((mon) => ({
				name: mon.name,
				species: mon.species,
				pos: mon.teamPos,
				hpPct: mon.hpPct,
				fainted: mon.fainted,
				status: mon.status,
				active: mon.activeSlot !== null,
			}));
	}
	const slots = ownImportTeam ?? pickedTeam.map((label) => ({ label, species: undefined }));
	return slots.map(({ label, species }, i) => {
		const mon = snapshot?.p1Mons.find((m) => m.name === label || (species && m.species === species));
		return {
			name: label,
			species: mon?.species ?? species,
			pos: i + 1,
			hpPct: mon?.hpPct ?? 100,
			fainted: mon?.fainted ?? false,
			status: mon?.status ?? null,
			active: !!mon && !mon.fainted && mon.activeSlot !== null,
		};
	});
}

function myBench(): OwnMon[] {
	return ownTeam().filter((mon) => !mon.active);
}

/** Team positions already claimed by another slot's pending replacement. */
function takenPositions(exceptSlot: number): Set<number> {
	const taken = new Set<number>();
	pending.forEach((pend, i) => {
		if (i !== exceptSlot && pend?.type === 'switch') taken.add(pend.pos);
	});
	for (const [slot, pos] of Object.entries(forcedPicks)) {
		if (Number(slot) !== exceptSlot) taken.add(pos);
	}
	return taken;
}

/** Bench Pokemon available to switch to, minus any already pending for the other slot. */
function switchableBench(slotIndex?: number): OwnMon[] {
	const taken = takenPositions(slotIndex ?? -1);
	return myBench().filter((mon) => !mon.fainted && !taken.has(mon.pos));
}

function monChipHtml(name: string): string {
	const sprite = POKEMON_SPRITES[name] ? `<img src="${POKEMON_SPRITES[name]}" alt="" loading="lazy" />` : '';
	return `<span class="gym-chip">${sprite}${esc(name)}</span>`;
}

/** Banned-list chip: sprite from our pool, else the pokedex fetcher. */
function bannedChipHtml(label: string, species?: string): string {
	const sprite = POKEMON_SPRITES[label] ? `<img src="${POKEMON_SPRITES[label]}" alt="" loading="lazy" />` : monImgHtml(species ?? label);
	return `<span class="gym-chip">${sprite}${esc(label)}</span>`;
}

/**
 * Sprite for any name: pool sprites win, then the async pokedex fetcher
 * (cached in team-import) fills in imported species; dots while loading.
 */
function monImgHtml(name: string, species?: string): string {
	if (POKEMON_SPRITES[name]) return `<img src="${POKEMON_SPRITES[name]}" alt="" loading="lazy" />`;
	if (species && POKEMON_SPRITES[species]) return `<img src="${POKEMON_SPRITES[species]}" alt="" loading="lazy" />`;
	const resolved = monSprite(species || name);
	if (resolved.url) return `<img src="${esc(resolved.url)}" alt="${esc(name)}" loading="lazy" />`;
	return `<span class="gym-sprite-wait${resolved.loading ? '' : ' is-missing'}" title="${esc(name)}">${resolved.loading ? '&middot;&middot;&middot;' : '?'}</span>`;
}

function typesHtml(name: string, currentTypes?: string[] | null, species?: string): string {
	const types = currentTypes ?? POKEMON_TYPES[name] ?? dexTypes(species || name);
	return types.map((t) => `<span class="mgr-type" data-type="${esc(t)}">${esc(String(t).toUpperCase())}</span>`).join('');
}

function pixelSpriteHtml(map: string[], palette: Record<string, string>, width = '4.5rem'): string {
	const cols = map[0]?.length ?? 0;
	const rows = map.length;
	const cells = map
		.flatMap((row) => [...row].map((char) => (char === '.' ? '<span></span>' : `<span style="background:${palette[char]}"></span>`)))
		.join('');
	return `<span class="gym-sprite" style="--gym-cols:${cols};--gym-rows:${rows};--gym-width:${width}">${cells}</span>`;
}

function resultOverlayHtml(): string {
	if (!outcome) return '';
	const title = outcome.tie ? 'TIE GAME!' : outcome.win ? 'YOU WIN!' : 'DEFEATED!';
	const cls = outcome.tie ? 'is-tie' : outcome.win ? 'is-win' : 'is-loss';
	return `
		<div class="gym-result ${cls}">
			<div class="gym-result-title">${title}</div>
			<div class="gym-result-actions">
				<button class="mgr-btn" data-gym="rematch">REMATCH</button>
				<button class="mgr-btn" data-gym="back-to-trainers">NEW BATTLE</button>
			</div>
		</div>`;
}

function scrollLog(): void {
	requestAnimationFrame(() => {
		const el = document.getElementById('gym-log');
		const box = el?.parentElement;
		if (box) box.scrollTop = box.scrollHeight;
	});
}

function esc(value: string): string {
	return value.replace(/[&<>"']/g, (char) => {
		const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
		return map[char] ?? char;
	});
}

/* ---------- events ---------- */

function onClick(event: Event): void {
	const target = event.target as HTMLElement | null;
	if (!target || typeof target.closest !== 'function') return;
	const el = target.closest('[data-gym]') as HTMLElement | null;
	if (!el || !mount()) return;
	handle(el.dataset.gym ?? '', el);
}

function handle(action: string, el: HTMLElement): void {
	switch (action) {
		case 'pick-trainer':
			opponentNumber = Number(el.dataset.num);
			pickedTeam = [];
			foeTeam = [];
			customFoeTeam = null;
			ownImportTeam = null;
			foeImportOpen = ownImportOpen = false;
			foeImportError = ownImportError = null;
			step = 'foe-draft';
			render();
			break;
		case 'pick-custom':
			resetBattleState();
			opponentNumber = null;
			foeTeam = [];
			pickedTeam = [];
			customFoeTeam = null;
			foeImportOpen = false;
			foeImportText = '';
			foeImportError = null;
			step = 'custom-import';
			render();
			break;
		case 'open-foe-import':
			foeImportOpen = true;
			render();
			break;
		case 'cancel-foe-import':
			foeImportOpen = false;
			foeImportError = null;
			render();
			break;
		case 'submit-foe-import': {
			const textarea = document.getElementById('gym-import-text');
			if (textarea instanceof HTMLTextAreaElement) foeImportText = textarea.value;
			const result = importTeamText(foeImportText);
			if (result.ok) {
				customFoeTeam = result.mons;
				foeImportOpen = false;
				foeImportError = null;
			} else {
				foeImportError = result.error;
			}
			render();
			break;
		}
		case 'reimport-foe':
			customFoeTeam = null;
			foeImportOpen = true;
			render();
			break;
		case 'confirm-custom-foe':
			if (customFoeTeam) {
				pickedTeam = [];
				ownImportTeam = null;
				ownImportOpen = false;
				ownImportText = '';
				ownImportError = null;
				step = 'draft';
				render();
			}
			break;
		case 'toggle-foe-mon': {
			const name = el.dataset.name ?? '';
			const at = foeTeam.indexOf(name);
			if (at >= 0) foeTeam.splice(at, 1);
			else if (foeTeam.length < 4) foeTeam.push(name);
			render();
			break;
		}
		case 'clear-foe-draft':
			foeTeam = [];
			render();
			break;
		case 'random-foe': {
			const foe = opponent();
			if (!foe) break;
			foeTeam = [...currentTeam(foe)];
			for (let i = foeTeam.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[foeTeam[i], foeTeam[j]] = [foeTeam[j]!, foeTeam[i]!];
			}
			foeTeam = foeTeam.slice(0, 4);
			step = 'draft';
			render();
			break;
		}
		case 'confirm-foe':
			if (foeTeam.length === 4) {
				step = 'draft';
				render();
			}
			break;
		case 'toggle-mon': {
			const name = el.dataset.name ?? '';
			const at = pickedTeam.indexOf(name);
			if (at >= 0) pickedTeam.splice(at, 1);
			else if (pickedTeam.length < 4) pickedTeam.push(name);
			render();
			break;
		}
		case 'clear-draft':
			pickedTeam = [];
			render();
			break;
		case 'open-own-import':
			ownImportOpen = true;
			render();
			break;
		case 'cancel-own-import':
			ownImportOpen = false;
			ownImportError = null;
			render();
			break;
		case 'submit-own-import': {
			const textarea = document.getElementById('gym-import-text');
			if (textarea instanceof HTMLTextAreaElement) ownImportText = textarea.value;
			const result = importTeamText(ownImportText);
			if (result.ok) {
				ownImportTeam = result.mons;
				pickedTeam = [];
				teamOrder = [];
				ownImportOpen = false;
				ownImportError = null;
			} else {
				ownImportError = result.error;
			}
			render();
			break;
		}
		case 'clear-own-import':
			ownImportTeam = null;
			ownImportText = '';
			ownImportError = null;
			ownImportOpen = false;
			render();
			break;
		case 'back-to-trainers':
			resetBattleState();
			opponentNumber = null;
			foeTeam = [];
			pickedTeam = [];
			customFoeTeam = null;
			ownImportTeam = null;
			foeImportOpen = ownImportOpen = false;
			foeImportText = ownImportText = '';
			foeImportError = ownImportError = null;
			step = 'trainer';
			render();
			break;
		case 'start-battle':
			if (humanReady() && (customFoeTeam || (opponentNumber !== null && foeTeam.length === 4))) startBattle();
			break;
		case 'team-order': {
			const pos = Number(el.dataset.pos);
			const at = teamOrder.indexOf(pos);
			if (at >= 0) teamOrder.splice(at, 1);
			else if (teamOrder.length < 2) teamOrder.push(pos);
			render();
			break;
		}
		case 'team-reset':
			teamOrder = [];
			render();
			break;
		case 'team-confirm':
			if (teamOrder.length === 2) {
				// Leads first, bench fills in draft order.
				const rest = [0, 1, 2, 3].filter((i) => !teamOrder.includes(i));
				battle?.submitTeamOrder([...teamOrder, ...rest].map((index) => index + 1));
				teamOrder = [];
				prompt = null;
				render();
			}
			break;
		case 'choose-move': {
			const slotIndex = Number(el.dataset.slot);
			const moveSlot = Number(el.dataset.move);
			if (!prompt || prompt.kind !== 'move') break;
			const move = prompt.actives[slotIndex]?.moves.find((m) => m.slot === moveSlot);
			if (!move || move.disabled) break;
			if (needsTarget(move.target)) {
				awaitingTarget = { slotIndex, moveSlot };
			} else {
				pending[slotIndex] = { type: 'move', slotIndex, moveSlot };
			}
			render();
			break;
		}
		case 'choose-target': {
			if (!awaitingTarget) break;
			const { slotIndex, moveSlot } = awaitingTarget;
			const rawLoc = el.dataset.loc ?? '0';
			awaitingTarget = null;
			pending[slotIndex] = { type: 'move', slotIndex, moveSlot, locStr: normalizeLoc(rawLoc) };
			render();
			break;
		}
		case 'cancel-target': {
			awaitingTarget = null;
			render();
			break;
		}
		case 'choose-switch': {
			const slotIndex = Number(el.dataset.slot);
			pending[slotIndex] = { type: 'switch', slotIndex, pos: Number(el.dataset.pos) };
			awaitingTarget = null;
			render();
			break;
		}
		case 'tera-toggle': {
			// Only one Terastallization per battle: arming one slot disarms the
			// other so a single turn can never send two Tera choices.
			const slotIndex = Number(el.dataset.slot);
			const turningOn = !teraFlags[slotIndex];
			teraFlags = teraFlags.map((_, idx) => idx === slotIndex && turningOn);
			render();
			break;
		}
		case 'undo-slot': {
			const slotIndex = Number(el.dataset.slot);
			pending[slotIndex] = null;
			teraFlags[slotIndex] = false;
			if (awaitingTarget?.slotIndex === slotIndex) awaitingTarget = null;
			render();
			break;
		}
		case 'undo-all':
			pending = [null, null];
			awaitingTarget = null;
			teraFlags = [false, false];
			render();
			break;
		case 'send-turn': {
			if (!prompt || prompt.kind !== 'move') break;
			const needed = prompt.actives.length;
			if (!pending.slice(0, needed).every(Boolean)) break;
			const choices = prompt.actives.map((_active, i) => choiceString(i));
			pending = [null, null];
			awaitingTarget = null;
			teraFlags = [false, false];
			prompt = null;
			battle?.submitChoices(choices);
			render();
			break;
		}
		case 'forced-pick': {
			forcedPicks[Number(el.dataset.slot)] = Number(el.dataset.pos);
			render();
			break;
		}
		case 'forced-send': {
			if (!prompt || prompt.kind !== 'switch') break;
			// The sim wants one choice per active slot in order: replacements
			// for fainted slots, pass for survivors. A mon can only switch in once.
			const used = new Set<number>();
			const choices = prompt.slots.map(({ index, must }) => {
				const pos = forcedPicks[index];
				if (!must || pos === undefined || used.has(pos)) return 'pass';
				used.add(pos);
				return `switch ${pos}`;
			});
			forcedPicks = {};
			prompt = null;
			battle?.submitChoices(choices);
			render();
			break;
		}
		case 'rematch':
			startBattle();
			break;
	}
}

function normalizeLoc(raw: string): string {
	const n = Number(raw);
	if (n > 0) return `+${n}`;
	return String(n);
}

function choiceString(slotIndex: number): string {
	const pend = pending[slotIndex];
	if (!pend) return 'pass';
	if (pend.type === 'switch') return `switch ${pend.pos}`;
	const parts = [`move ${pend.moveSlot}`];
	if (pend.locStr !== undefined) parts.push(pend.locStr);
	if (teraFlags[slotIndex]) parts.push('terastallize');
	return parts.join(' ');
}

function resetBattleState(): void {
	battle = null;
	snapshot = null;
	prompt = null;
	outcome = null;
	pending = [null, null];
	awaitingTarget = null;
	teraFlags = [false, false];
	teamOrder = [];
	forcedPicks = {};
	battleError = null;
}

function startBattle(): void {
	if (!humanReady() || !(customFoeTeam || (opponentNumber !== null && foeTeam.length === 4))) return;
	resetBattleState();
	step = 'battle';
	render();

	const engine = new GymBattle({
		humanTeam: pickedTeam,
		aiTeam: foeTeam,
		humanSets: ownImportTeam?.map((mon) => mon.set),
		aiSets: customFoeTeam?.map((mon) => mon.set),
		nameMap: Object.fromEntries([...(ownImportTeam ?? []), ...(customFoeTeam ?? [])].map((mon) => [mon.species, mon.label])),
		opponentName: opponentLabel(),
		onSnapshot: (snap) => {
			snapshot = snap;
			render();
		},
		onPrompt: (nextPrompt) => {
			prompt = nextPrompt;
			render();
		},
		onEnd: (result) => {
			outcome = result;
			render();
		},
	});
	battle = engine;
	engine.run().catch((err: unknown) => {
		battleError = err instanceof Error ? err.message : String(err);
		render();
	});
}
