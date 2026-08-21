export interface BattleEvent {
	text: string;
	type: 'move' | 'faint' | 'heal' | 'supereffective' | 'resisted' | 'crit' | 'status' | 'switch' | 'fail' | 'immune' | 'info' | 'miss' | 'boost' | 'volatile';
}

export type MemberStatus = 'active' | 'benched' | 'fainted';

export interface BattleTeamMember {
	species: string;
	nickname: string;
	hp: number;
	maxHp: number;
	status: MemberStatus;
	hpPct: number;
	item: string | null;
	condition: string | null;
}

export interface BattleFieldState {
	weather: string | null;
	terrain: string | null;
	room: string | null;
}

export interface BattleTurn {
	turn: number;
	events: BattleEvent[];
	p1: BattleTeamMember[];
	p2: BattleTeamMember[];
	field: BattleFieldState;
	sideConditions: { p1: string[]; p2: string[] };
	raw: string[];
}

function clean(name: string): string {
	return name.replace(/^p[12]a: /, '').replace(/, L\d+.*$/, '').replace(/-\*$/, '').trim();
}

function speciesOf(name: string): string {
	return name.replace(/^p[12]a: /, '').replace(/, L\d+, [MF]\b/, '').replace(/-\*$/, '').trim();
}

function parseHp(hp: string): { hp: number; maxHp: number; pct: number } | null {
	const match = hp.match(/^(\d+)\/(\d+)/);
	if (!match) return null;
	const cur = parseInt(match[1], 10);
	const max = parseInt(match[2], 10);
	return { hp: cur, maxHp: max, pct: max > 0 ? Math.round((cur / max) * 100) : 0 };
}

function snapshotSide(team: Map<string, BattleTeamMember>, active: string): BattleTeamMember[] {
	const members: BattleTeamMember[] = [];
	for (const [species, m] of team) {
		members.push({
			...m,
			status: m.status === 'fainted' ? 'fainted' : species === active ? 'active' : 'benched',
		});
	}
	return members;
}

function snapshotField(field: BattleFieldState): BattleFieldState {
	return { ...field };
}

export function parseBattleLog(raw: string[], items?: Record<string, string>): BattleTurn[] {
	const turns: BattleTurn[] = [];
	let current: BattleTurn | null = null;
	let turnNum = 0;
	let turn0Created = false;

	const preTurnEvents: BattleEvent[] = [];
	const preTurnRaw: string[] = [];

	const p1Team: Map<string, BattleTeamMember> = new Map();
	const p2Team: Map<string, BattleTeamMember> = new Map();
	const nickToSpecies: Map<string, string> = new Map();
	let p1Active = '';
	let p2Active = '';
	let snapP1Active = '';
	let snapP2Active = '';
	const field: BattleFieldState = { weather: null, terrain: null, room: null };
	const p1SideConds: Set<string> = new Set();
	const p2SideConds: Set<string> = new Set();
	let snapP1SideConds: string[] = [];
	let snapP2SideConds: string[] = [];

	function finalizeCurrent(): void {
		if (current) {
			current.p1 = snapshotSide(p1Team, snapP1Active);
			current.p2 = snapshotSide(p2Team, snapP2Active);
			current.field = snapshotField(field);
			current.sideConditions = { p1: [...snapP1SideConds], p2: [...snapP2SideConds] };
		}
	}

	function startTurn(num: number): void {
		snapP1Active = p1Active;
		snapP2Active = p2Active;
		snapP1SideConds = [...p1SideConds];
		snapP2SideConds = [...p2SideConds];
		finalizeCurrent();
		current = { turn: num, events: [], p1: [], p2: [], field: { weather: null, terrain: null, room: null }, sideConditions: { p1: [], p2: [] }, raw: [] };
		turns.push(current);
		turnNum = num;
	}

	function resolveMember(who: string): { team: Map<string, BattleTeamMember>; member: BattleTeamMember | undefined } {
		const nickname = who.replace(/^p[12]a: /, '');
		const species = nickToSpecies.get(nickname) ?? speciesOf(who);
		const team = who.startsWith('p1') ? p1Team : p2Team;
		return { team, member: team.get(species) };
	}

	function pushEvent(ev: BattleEvent): void {
		if (current) current.events.push(ev);
		else preTurnEvents.push(ev);
	}

	for (const chunk of raw) {
		const lines = chunk.split('\n');
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || trimmed === '|' || trimmed.startsWith('|t:') || trimmed === '|upkeep' || trimmed.startsWith('|debug')) continue;
			if (current) current.raw.push(trimmed); else preTurnRaw.push(trimmed);

			const parts = trimmed.split('|');

			// === Team preview ===
			if (trimmed.startsWith('|poke|')) {
				const side = parts[2] ?? '';
				const info = parts[3] ?? '';
				const itemField = parts[4] ?? '';
				const species = info.replace(/, L\d+, [MF]\b/, '').replace(/, L\d+.*$/, '').replace(/-\*$/, '').trim();
				const team = side === 'p1' ? p1Team : p2Team;
				if (!team.has(species)) {
					team.set(species, { species, nickname: species, hp: 0, maxHp: 0, status: 'benched', hpPct: 100, item: itemField || (items?.[species] ?? null), condition: null });
				}
				continue;
			}

			// === Initialization lines (skip silently) ===
			if (trimmed.startsWith('|teampreview') || trimmed.startsWith('|clearpoke') || trimmed.startsWith('|start') || trimmed.startsWith('|teamsize|') || trimmed.startsWith('|gametype|') || trimmed.startsWith('|player|') || trimmed.startsWith('|gen|') || trimmed.startsWith('|tier|') || trimmed.startsWith('|rule|') || trimmed.startsWith('|rated')) {
				continue;
			}

			// === Major actions ===

			// |switch| or |drag| — Pokémon sent out
			if (trimmed.startsWith('|switch|') || trimmed.startsWith('|drag|')) {
				const who = parts[2] ?? '';
				const details = parts[3] ?? '';
				const hpRaw = parts[4] ?? '';
				const isP1 = who.startsWith('p1');
				const team = isP1 ? p1Team : p2Team;
				const species = details.replace(/, L\d+, [MF]\b/, '').replace(/, L\d+.*$/, '').trim();
				const nickname = who.replace(/^p[12]a: /, '');
				nickToSpecies.set(nickname, species);
				const hpData = parseHp(hpRaw);
				if (!team.has(species)) {
					team.set(species, { species, nickname: species, hp: 0, maxHp: 0, status: 'benched', hpPct: 100, item: items?.[species] ?? null, condition: null });
				}
				const member = team.get(species)!;
				member.nickname = nickname;
				if (hpData) {
					member.hp = hpData.hp;
					member.maxHp = hpData.maxHp;
					member.hpPct = hpData.pct;
				}
				// Read status from HP STATUS field (e.g. "38/148 brn")
				const statusPart = (hpRaw.split(' ')[1] ?? '').trim();
				if (statusPart) member.condition = statusPart;
				const label = trimmed.startsWith('|drag|') ? 'was dragged out' : 'was sent out';
				pushEvent({ type: 'switch', text: `${clean(who)} ${label} (${details.replace(/, L\d+.*$/, '').trim()})` });
				if (isP1) p1Active = species; else p2Active = species;
				continue;
			}

			// |detailschange| — permanent forme change (e.g. Mega Evolution)
			if (trimmed.startsWith('|detailschange|')) {
				const who = parts[2] ?? '';
				const details = parts[3] ?? '';
				const hpRaw = parts[4] ?? '';
				const { team, member } = resolveMember(who);
				const newSpecies = details.replace(/, L\d+, [MF]\b/, '').replace(/, L\d+.*$/, '').trim();
				if (member && newSpecies !== member.species) {
					const oldSpecies = member.species;
					const nickname = member.nickname;
					const hpData = parseHp(hpRaw);
					const newMember = { ...member, species: newSpecies };
					if (hpData) {
						newMember.hp = hpData.hp;
						newMember.maxHp = hpData.maxHp;
						newMember.hpPct = hpData.pct;
					}
					team.delete(oldSpecies);
					team.set(newSpecies, newMember);
					nickToSpecies.set(nickname, newSpecies);
					const isP1 = who.startsWith('p1');
					if (isP1 && p1Active === oldSpecies) p1Active = newSpecies;
					if (!isP1 && p2Active === oldSpecies) p2Active = newSpecies;
					pushEvent({ type: 'switch', text: `${clean(who)} transformed into ${newSpecies}` });
				}
				continue;
			}

			// |-formechange| — temporary forme change
			if (trimmed.startsWith('|-formechange|')) {
				const who = parts[2] ?? '';
				const species = parts[3] ?? '';
				const { member } = resolveMember(who);
				if (member && species) member.species = species;
				continue;
			}

			// |replace| — Illusion ended
			if (trimmed.startsWith('|replace|')) {
				const who = parts[2] ?? '';
				const details = parts[3] ?? '';
				const hpRaw = parts[4] ?? '';
				const nickname = who.replace(/^p[12]a: /, '');
				const newSpecies = details.replace(/, L\d+, [MF]\b/, '').replace(/, L\d+.*$/, '').trim();
				const hpData = parseHp(hpRaw);
				const isP1 = who.startsWith('p1');
				const team = isP1 ? p1Team : p2Team;
				if (!team.has(newSpecies)) {
					team.set(newSpecies, { species: newSpecies, nickname, hp: 0, maxHp: 0, status: 'benched', hpPct: 100, item: items?.[newSpecies] ?? null, condition: null });
				}
				const member = team.get(newSpecies)!;
				member.nickname = nickname;
				if (hpData) {
					member.hp = hpData.hp;
					member.maxHp = hpData.maxHp;
					member.hpPct = hpData.pct;
				}
				nickToSpecies.set(nickname, newSpecies);
				if (isP1) p1Active = newSpecies; else p2Active = newSpecies;
				pushEvent({ type: 'switch', text: `${clean(who)}'s Illusion wore off` });
				continue;
			}

			// |cant| — Pokémon couldn't move
			if (trimmed.startsWith('|cant|')) {
				const who = parts[2] ?? '';
				const reason = parts[3] ?? '';
				const move = parts[4] ?? '';
				let text = `${clean(who)} can't move`;
				if (reason) text += ` (${reason.replace(/^move: /, '')})`;
				if (move) text += ` — ${move}`;
				pushEvent({ type: 'fail', text });
				continue;
			}

			// |faint|
			if (trimmed.startsWith('|faint|')) {
				const who = parts[2] ?? '';
				const { member } = resolveMember(who);
				if (member) {
					member.status = 'fainted';
					member.hp = 0;
					member.hpPct = 0;
					member.condition = null;
				}
				pushEvent({ type: 'faint', text: `${clean(who)} fainted!` });
				continue;
			}

			// |move|
			if (trimmed.startsWith('|move|')) {
				const attacker = clean(parts[2] ?? '');
				const move = parts[3] ?? '';
				const target = clean(parts[4] ?? '');
				if (!attacker || !move) continue;
				pushEvent({ type: 'move', text: target ? `${attacker} used ${move} on ${target}` : `${attacker} used ${move}` });
				continue;
			}

			// |win|
			if (trimmed.startsWith('|win|')) {
				const winner = parts[2] ?? '';
				if (!current) startTurn(turnNum);
				current!.events.push({ type: 'info', text: `${winner} wins the battle!` });
				finalizeCurrent();
				continue;
			}

			// |tie|
			if (trimmed === '|tie') {
				if (!current) startTurn(turnNum);
				current!.events.push({ type: 'info', text: 'The battle ended in a tie!' });
				finalizeCurrent();
				continue;
			}

			// === Minor actions ===

			// |-damage|
			if (trimmed.startsWith('|-damage|')) {
				const who = parts[2] ?? '';
				const hpRaw = parts[3] ?? '';
				if (hpRaw.endsWith('fnt')) continue;
				const hpData = parseHp(hpRaw);
				const { member } = resolveMember(who);
				if (member && hpData) {
					member.hp = hpData.hp;
					member.hpPct = hpData.pct;
				}
				// Read status from HP STATUS field
				const statusPart = (hpRaw.split(' ')[1] ?? '').trim();
				if (member && statusPart) member.condition = statusPart;
				continue;
			}

			// |-heal|
			if (trimmed.startsWith('|-heal|')) {
				const who = parts[2] ?? '';
				const hpRaw = parts[3] ?? '';
				const src = parts[4] ?? '';
				const hpData = parseHp(hpRaw);
				const { member } = resolveMember(who);
				if (member && hpData) {
					member.hp = hpData.hp;
					if (hpData.maxHp > 0) member.maxHp = hpData.maxHp;
					member.hpPct = hpData.pct;
				}
				const itemMatch = src.match(/^\[from\] item: (.+)$/);
				if (member && itemMatch) member.item = itemMatch[1];
				// Read status from HP STATUS field
				const statusPart = (hpRaw.split(' ')[1] ?? '').trim();
				if (member && statusPart) member.condition = statusPart;
				const srcClean = src.replace(/^\[from\] /, '');
				const suffix = srcClean ? ` (${srcClean})` : '';
				pushEvent({ type: 'heal', text: `${clean(who)} healed to ${hpRaw}${suffix}` });
				continue;
			}

			// |-sethp|
			if (trimmed.startsWith('|-sethp|')) {
				const who = parts[2] ?? '';
				const hpRaw = parts[3] ?? '';
				const hpData = parseHp(hpRaw);
				const { member } = resolveMember(who);
				if (member && hpData) {
					member.hp = hpData.hp;
					member.hpPct = hpData.pct;
				}
				continue;
			}

			// |-status|
			if (trimmed.startsWith('|-status|')) {
				const who = parts[2] ?? '';
				const status = parts[3] ?? '';
				const { member } = resolveMember(who);
				if (member) member.condition = status;
				const label = status === 'brn' ? 'burned' : status === 'psn' ? 'poisoned' : status === 'par' ? 'paralyzed' : status === 'slp' ? 'asleep' : status === 'frz' ? 'frozen' : status === 'tox' ? 'badly poisoned' : status;
				pushEvent({ type: 'status', text: `${clean(who)} was ${label}` });
				continue;
			}

			// |-curestatus|
			if (trimmed.startsWith('|-curestatus|')) {
				const who = parts[2] ?? '';
				const status = parts[3] ?? '';
				const { member } = resolveMember(who);
				if (member) member.condition = null;
				const msg = status === 'slp' ? `${clean(who)} woke up`
					: status === 'brn' ? `${clean(who)}'s burn was healed`
					: status === 'psn' || status === 'tox' ? `${clean(who)} was cured of poison`
					: status === 'par' ? `${clean(who)} is no longer paralyzed`
					: status === 'frz' ? `${clean(who)} thawed out`
					: `${clean(who)} was cured of ${status}`;
				pushEvent({ type: 'status', text: msg });
				continue;
			}

			// |-cureteam|
			if (trimmed.startsWith('|-cureteam|')) {
				const who = parts[2] ?? '';
				const team = who.startsWith('p1') ? p1Team : p2Team;
				for (const m of team.values()) m.condition = null;
				pushEvent({ type: 'status', text: `${clean(who)}'s team was cured of status` });
				continue;
			}

			// |-boost|
			if (trimmed.startsWith('|-boost|')) {
				const who = parts[2] ?? '';
				const stat = parts[3] ?? '';
				const amt = parseInt(parts[4] ?? '1', 10);
				const statNames: Record<string, string> = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', evasion: 'evasion', accuracy: 'accuracy' };
				const label = statNames[stat] ?? stat;
				const desc = amt >= 2 ? 'sharply rose' : amt >= 1 ? 'rose' : amt <= -2 ? 'harshly fell' : amt <= -1 ? 'fell' : `changed by ${amt}`;
				pushEvent({ type: 'boost', text: `${clean(who)}'s ${label} ${desc}!` });
				continue;
			}

			// |-unboost| (same handler as |-boost| for display purposes, handled by above since both start with |-boost|)
			// Actually |-unboost| does NOT start with |-boost|. Handle separately.
			if (trimmed.startsWith('|-unboost|')) {
				const who = parts[2] ?? '';
				const stat = parts[3] ?? '';
				const amt = parseInt(parts[4] ?? '1', 10);
				const statNames: Record<string, string> = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', evasion: 'evasion', accuracy: 'accuracy' };
				const label = statNames[stat] ?? stat;
				const desc = amt >= 2 ? 'sharply fell' : amt >= 1 ? 'fell' : amt <= -2 ? 'rose sharply' : amt <= -1 ? 'rose' : `changed by ${amt}`;
				pushEvent({ type: 'boost', text: `${clean(who)}'s ${label} ${desc}!` });
				continue;
			}

			// |-setboost|
			if (trimmed.startsWith('|-setboost|')) {
				const who = parts[2] ?? '';
				const stat = parts[3] ?? '';
				const amt = parts[4] ?? '0';
				const statNames: Record<string, string> = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
				const label = statNames[stat] ?? stat;
				pushEvent({ type: 'boost', text: `${clean(who)}'s ${label} was set to ${amt}` });
				continue;
			}

			// |-clearboost| / |-clearallboost| / |-invertboost| / |-copyboost| / |-swapboost| / |-clearpositiveboost| / |-clearnegativeboost|
			if (trimmed.startsWith('|-clearboost|') || trimmed.startsWith('|-clearallboost') || trimmed.startsWith('|-invertboost|') || trimmed.startsWith('|-copyboost|') || trimmed.startsWith('|-swapboost|') || trimmed.startsWith('|-clearpositiveboost|') || trimmed.startsWith('|-clearnegativeboost|')) {
				if (trimmed.startsWith('|-clearallboost')) {
					pushEvent({ type: 'boost', text: 'All stat changes were reset!' });
				} else {
					const who = parts[2] ?? '';
					if (who) pushEvent({ type: 'boost', text: `${clean(who)}'s stat changes were reset` });
				}
				continue;
			}

			// |-supereffective|
			if (trimmed.startsWith('|-supereffective|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'supereffective', text: `Super effective on ${clean(who)}!` });
				continue;
			}
			// |-resisted|
			if (trimmed.startsWith('|-resisted|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'resisted', text: `Resisted on ${clean(who)}` });
				continue;
			}
			// |-crit|
			if (trimmed.startsWith('|-crit|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'crit', text: `Critical hit on ${clean(who)}!` });
				continue;
			}
			// |-immune|
			if (trimmed.startsWith('|-immune|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'immune', text: `${clean(who)} is immune` });
				continue;
			}

			// |-miss|
			if (trimmed.startsWith('|-miss|')) {
				const source = parts[2] ?? '';
				const target = parts[3] ?? '';
				const src = clean(source);
				const tgt = target ? ` on ${clean(target)}` : '';
				pushEvent({ type: 'miss', text: `${src}'s attack missed${tgt}` });
				continue;
			}

			// |-fail|
			if (trimmed.startsWith('|-fail|')) {
				const who = parts[2] ?? '';
				const reason = parts[3] ?? '';
				const r = reason ? ` (${reason.replace(/^move: /, '')})` : '';
				pushEvent({ type: 'fail', text: `${clean(who)}'s action failed${r}` });
				continue;
			}

			// |-block|
			if (trimmed.startsWith('|-block|')) {
				const who = parts[2] ?? '';
				const effect = parts[3] ?? '';
				const move = parts[4] ?? '';
				let text = `${clean(who)}'s ${move || 'action'} was blocked`;
				if (effect) text += ` by ${effect}`;
				pushEvent({ type: 'fail', text });
				continue;
			}

			// |-start| — volatile status applied
			if (trimmed.startsWith('|-start|')) {
				const who = parts[2] ?? '';
				const effect = parts[3] ?? '';
				const effectClean = effect.replace(/^(move|ability|item): /, '');
				// typechange is cosmetic (Protean, Libero) — show briefly
				if (effect === 'typechange') {
					const typeTag = parts[4] ?? '';
					if (typeTag) pushEvent({ type: 'volatile', text: `${clean(who)}'s type changed to ${typeTag.replace(/^\[from\] /, '')}` });
				} else {
					pushEvent({ type: 'volatile', text: `${clean(who)} became affected by ${effectClean}` });
				}
				continue;
			}

			// |-end| — volatile status ended
			if (trimmed.startsWith('|-end|')) {
				const who = parts[2] ?? '';
				const effect = parts[3] ?? '';
				const effectClean = effect.replace(/^(move|ability|item): /, '');
				pushEvent({ type: 'volatile', text: `${clean(who)} is no longer affected by ${effectClean}` });
				continue;
			}

			// |-item| — item revealed or changed
			if (trimmed.startsWith('|-item|')) {
				const who = parts[2] ?? '';
				const item = parts[3] ?? '';
				const { member } = resolveMember(who);
				if (member && item) member.item = item;
				continue;
			}

			// |-enditem| — item destroyed or consumed
			if (trimmed.startsWith('|-enditem|')) {
				const who = parts[2] ?? '';
				const { member } = resolveMember(who);
				if (member) member.item = null;
				continue;
			}

			// |-ability|
			if (trimmed.startsWith('|-ability|')) {
				const who = parts[2] ?? '';
				const ability = parts[3] ?? '';
				if (ability) pushEvent({ type: 'info', text: `${clean(who)}'s ${ability} activated` });
				continue;
			}

			// |-endability|
			if (trimmed.startsWith('|-endability|')) {
				continue;
			}

			// |-singleturn| (Protect, etc.)
			if (trimmed.startsWith('|-singleturn|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'info', text: `${clean(who)} is protecting itself` });
				continue;
			}

			// |-singlemove| (Destiny Bond, Grudge)
			if (trimmed.startsWith('|-singlemove|')) {
				const who = parts[2] ?? '';
				const move = parts[3] ?? '';
				if (move) pushEvent({ type: 'info', text: `${clean(who)} is using ${move}` });
				continue;
			}

			// |-hitcount|
			if (trimmed.startsWith('|-hitcount|')) {
				const who = parts[2] ?? '';
				const count = parts[3] ?? '';
				if (count && count !== '1') pushEvent({ type: 'info', text: `Hit ${count} times!` });
				continue;
			}

			// |-weather| or |weather|
			if (trimmed.startsWith('|-weather|') || trimmed.startsWith('|weather|')) {
				const w = parts[2] ?? '';
				const from = parts[3] ?? '';
				const isUpkeep = trimmed.includes('[upkeep]');
				if (w === 'none' || w === '') {
					field.weather = null;
					if (!isUpkeep) pushEvent({ type: 'info', text: 'The weather cleared' });
				} else {
					field.weather = w;
					if (!isUpkeep) pushEvent({ type: 'info', text: `${w} started${from ? ` (${from.replace(/^\[from\] /, '')})` : ''}` });
				}
				continue;
			}
			// |-weatherend| or |weatherend|
			if (trimmed.startsWith('|-weatherend|') || trimmed.startsWith('|weatherend|')) {
				const w = parts[2] ?? '';
				if (field.weather === w) field.weather = null;
				pushEvent({ type: 'info', text: `${w} ended` });
				continue;
			}

			// |-fieldstart|
			if (trimmed.startsWith('|-fieldstart|') || trimmed.startsWith('|fieldstart|')) {
				const condition = parts[2] ?? '';
				if (/trick room/i.test(condition)) field.room = 'Trick Room';
				else if (/magic room/i.test(condition)) field.room = 'Magic Room';
				else if (/wonder room/i.test(condition)) field.room = 'Wonder Room';
				else field.terrain = condition;
				continue;
			}
			// |-fieldend|
			if (trimmed.startsWith('|-fieldend|') || trimmed.startsWith('|fieldend|')) {
				const condition = parts[2] ?? '';
				if (/trick room/i.test(condition)) field.room = null;
				else if (/magic room/i.test(condition)) field.room = null;
				else if (/wonder room/i.test(condition)) field.room = null;
				else field.terrain = null;
				continue;
			}

			// |-terrainstart| / |-terrainend| (older gens)
			if (trimmed.startsWith('|-terrainstart|')) {
				field.terrain = parts[2] ?? null;
				continue;
			}
			if (trimmed.startsWith('|-terrainend|')) {
				field.terrain = null;
				continue;
			}

			// |-sidestart| / |-sideend| — side conditions (Stealth Rock, Tailwind, etc.)
			if (trimmed.startsWith('|-sidestart|') || trimmed.startsWith('|-sideend|')) {
				const side = parts[2] ?? '';
				const condition = (parts[3] ?? '').replace(/^(move|ability|item): /, '');
				const isStart = trimmed.startsWith('|-sidestart|');
				const conds = side.startsWith('p1') ? p1SideConds : p2SideConds;
				const sideLabel = side.startsWith('p1') ? 'HUMON' : 'GYM';
				if (isStart) {
					conds.add(condition);
					pushEvent({ type: 'info', text: `${sideLabel}: ${condition}` });
				} else {
					conds.delete(condition);
					pushEvent({ type: 'info', text: `${sideLabel}'s ${condition} ended` });
				}
				continue;
			}

			// |-swapsideconditions| — Court Change
			if (trimmed.startsWith('|-swapsideconditions')) {
				const tmp = new Set(p1SideConds);
				p1SideConds.clear();
				for (const c of p2SideConds) p1SideConds.add(c);
				p2SideConds.clear();
				for (const c of tmp) p2SideConds.add(c);
				pushEvent({ type: 'info', text: 'Side conditions were swapped!' });
				continue;
			}

			// |-fieldactivate| — single-event field effect (Perish Song, etc.)
			if (trimmed.startsWith('|-fieldactivate|')) {
				const effect = parts[2] ?? '';
				if (effect) pushEvent({ type: 'info', text: effect.replace(/^(move): /, '') });
				continue;
			}

			// |-activate| — miscellaneous effect
			if (trimmed.startsWith('|-activate|')) {
				const effect = parts[2] ?? '';
				if (effect) pushEvent({ type: 'info', text: effect.replace(/^\w+: /, '') });
				continue;
			}

			// |-message|
			if (trimmed.startsWith('|-message|')) {
				const msg = parts[2] ?? '';
				if (msg) pushEvent({ type: 'info', text: msg });
				continue;
			}

			// |-hint| — skip
			if (trimmed.startsWith('|-hint|')) continue;

			// |-center| — triples centering, skip
			if (trimmed.startsWith('|-center')) continue;

			// |-nothing| — deprecated, skip
			if (trimmed.startsWith('|-nothing')) continue;

			// |-mustrecharge|
			if (trimmed.startsWith('|-mustrecharge|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'info', text: `${clean(who)} must recharge` });
				continue;
			}

			// |-notarget| — Gen 1-4, skip
			if (trimmed.startsWith('|-notarget')) continue;

			// |-prepare| — charge move (Dig, Fly)
			if (trimmed.startsWith('|-prepare|')) {
				const who = parts[2] ?? '';
				const move = parts[3] ?? '';
				if (move) pushEvent({ type: 'info', text: `${clean(who)} is using ${move}` });
				continue;
			}

			// |-transform|
			if (trimmed.startsWith('|-transform|')) {
				const who = parts[2] ?? '';
				const species = parts[3] ?? '';
				const { member } = resolveMember(who);
				if (member && species) member.species = species;
				pushEvent({ type: 'volatile', text: `${clean(who)} transformed into ${species}` });
				continue;
			}

			// |-mega| / |-primal| / |-burst| — cosmetic forme changes
			if (trimmed.startsWith('|-mega|') || trimmed.startsWith('|-primal|') || trimmed.startsWith('|-burst|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'switch', text: `${clean(who)} underwent a forme change` });
				continue;
			}

			// |-zpower| / |-zbroken| — Z-moves
			if (trimmed.startsWith('|-zpower|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'info', text: `${clean(who)} used its Z-Power` });
				continue;
			}
			if (trimmed.startsWith('|-zbroken|')) {
				const who = parts[2] ?? '';
				pushEvent({ type: 'info', text: `Z-Move broke through Protect on ${clean(who)}` });
				continue;
			}

			// |-combine| / |-waiting| — skip
			if (trimmed.startsWith('|-combine') || trimmed.startsWith('|-waiting')) continue;

			// |swap| — doubles positioning, skip
			if (trimmed.startsWith('|swap|')) continue;

			// |inactive| / |inactiveoff| — timer messages, skip
			if (trimmed.startsWith('|inactive')) continue;

			// |request| — choice request, skip
			if (trimmed.startsWith('|request|')) continue;

			// |turn|
			if (trimmed.startsWith('|turn|')) {
				const num = parseInt(parts[2] ?? '0', 10);
				if (!turn0Created && preTurnEvents.length > 0) {
					current = { turn: 0, events: preTurnEvents, p1: [], p2: [], field: { weather: null, terrain: null, room: null }, sideConditions: { p1: [], p2: [] }, raw: preTurnRaw };
					finalizeCurrent();
					turns.push(current);
					turn0Created = true;
				}
				startTurn(num);
				continue;
			}

			// |error| — skip
			if (trimmed.startsWith('|error|')) continue;
		}
	}

	finalizeCurrent();
	return turns;
}
