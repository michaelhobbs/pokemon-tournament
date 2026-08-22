import { Dex } from '@pkmn/sim';

export interface RuleDescription {
	title: string;
	text: string;
}

const STATUS_DESCRIPTIONS: Record<string, RuleDescription> = {
	brn: { title: 'BURN (BRN)', text: 'Loses 1/16 of max HP at the end of each turn and its ATTACK is halved. Fire types are immune.' },
	psn: { title: 'POISON (PSN)', text: 'Loses 1/8 of max HP at the end of each turn. Poison and Steel types are immune.' },
	tox: { title: 'TOXIC (TOX)', text: 'Badly poisoned - damage starts at 1/16 of max HP and doubles each turn. Poison-type moves cure it.' },
	par: { title: 'PARALYSIS (PAR)', text: 'SPEED is cut in half and there is a 25% chance of being fully paralyzed each turn. Electric types are immune.' },
	slp: { title: 'ASLEEP (SLP)', text: 'Cannot move for 1-3 turns. Waking up consumes the turn. Rest cures it completely.' },
	frz: { title: 'FROZEN (FRZ)', text: 'Cannot move. Thaws 20% of the time each turn, or when hit by a Fire move or Scald. Ice types are immune.' },
};

const WEATHER_DESCRIPTIONS: Record<string, RuleDescription> = {
	sunnyday: { title: 'SUNNY DAY', text: 'Fire moves +50%, Water moves -50%. Lasts 5 turns (8 with Heat Rock).' },
	raindance: { title: 'RAIN', text: 'Water moves +50%, Fire moves -50%. Lasts 5 turns (8 with Damp Rock).' },
	sandstorm: { title: 'SANDSTORM', text: 'Non-Rock/Ground/Steel types lose 1/16 of max HP each turn. Rock types get +50% SP. DEF.' },
	hail: { title: 'HAIL', text: 'Non-Ice types lose 1/16 of max HP each turn. Lasts 5 turns (8 with Icy Rock).' },
	snow: { title: 'SNOW', text: 'Ice types get +50% DEF. Does not damage. Replaces Hail from Gen 9.' },
	snowscape: { title: 'SNOWSCAPE', text: 'Sets snow: Ice types get +50% DEF. Does not damage. Lasts 5 turns (8 with Icy Rock).' },
	desolateland: { title: 'DESOLATE LAND', text: "Primal Groudon's sunlight - Water moves fail entirely." },
	primordialsea: { title: 'PRIMORDIAL SEA', text: "Primal Kyogre's rain - Fire moves fail entirely." },
	deltastream: { title: 'DELTA STREAM', text: "Mega Rayquaza's winds - Flying-type weaknesses are negated." },
};

const TERRAIN_DESCRIPTIONS: Record<string, RuleDescription> = {
	electricterrain: { title: 'ELECTRIC TERRAIN', text: 'Grounded Pokemon cannot fall asleep; Electric moves +50%. Grounded = not Flying/Levitate.' },
	grassyterrain: { title: 'GRASSY TERRAIN', text: 'Heals grounded Pokemon 1/16 of max HP each turn; Grass moves +50%; halves Earthquake/Bulldoze/Magnitude.' },
	mistyterrain: { title: 'MISTY TERRAIN', text: 'Grounded Pokemon cannot be statused; Dragon moves -50% against grounded targets.' },
	psychicterrain: { title: 'PSYCHIC TERRAIN', text: 'Grounded Pokemon cannot be hit by priority moves; Psychic moves +50%.' },
};

const SIDE_CONDITION_DESCRIPTIONS: Record<string, RuleDescription> = {
	reflect: { title: 'REFLECT', text: 'Halves damage of physical attacks against that side for 5 turns (8 with Light Clay).' },
	lightscreen: { title: 'LIGHT SCREEN', text: 'Halves damage of special attacks against that side for 5 turns (8 with Light Clay).' },
	auroraveil: { title: 'AURORA VEIL', text: 'Halves damage of ALL attacks against that side for 5 turns (8 with Light Clay). Snow/Hail only.' },
	tailwind: { title: 'TAILWIND', text: "That side's Pokemon act first via doubled SPEED for 4 turns." },
	stickyweb: { title: 'STICKY WEB', text: 'Switched-in grounded foes have their SPEED lowered one stage.' },
	stealthrock: { title: 'STEALTH ROCK', text: 'Switched-in foes lose HP based on their Rock weakness (up to 50%).' },
	spikes: { title: 'SPIKES', text: 'Switched-in grounded foes lose 1/8 of max HP per layer (max 3 layers).' },
	toxicspikes: { title: 'TOXIC SPIKES', text: 'Switched-in grounded foes are poisoned; 2 layers = badly poisoned. Cleared by grounded Poison types.' },
	safeguard: { title: 'SAFEGUARD', text: 'That side cannot be statused for 5 turns.' },
	gmaxsteelsurge: { title: 'STEELSURGE', text: 'Switched-in foes lose HP scaled by Steel resistance (up to 25%) - Calyrex-Steel beware.' },
};

const VOLATILE_DESCRIPTIONS: Record<string, RuleDescription> = {
	leechseed: { title: 'LEECH SEED', text: 'Seeded Pokemon loses 1/8 of max HP at turn end; the seeder heals the same amount. Grass types immune.' },
	confusion: { title: 'CONFUSION', text: '33% chance each turn to hurt itself instead of acting (40 base power, typeless). Lasts 2-5 turns.' },
	protect: { title: 'PROTECT', text: 'Blocks all effects aimed at this Pokemon this turn. Consecutive uses halve success chance.' },
	taunt: { title: 'TAUNT', text: 'Cannot use STATUS moves for 3-4 turns (Mental Herb blocks it once).' },
	encore: { title: 'ENCORE', text: 'Locked into its last used move for 3 turns.' },
	torment: { title: 'TORMENT', text: 'Cannot use the same move twice in a row.' },
	curse: { title: 'CURSE (GHOST)', text: 'Loses 1/4 of max HP at the end of each turn while the curser remains.' },
	nightmare: { title: 'NIGHTMARE', text: 'Sleeping Pokemon lose 1/4 of max HP at the end of each turn.' },
	substitute: { title: 'SUBSTITUTE', text: 'A doll absorbs status moves and single-hit damage until broken.' },
	focusenergy: { title: 'FOCUS ENERGY', text: 'Critical hit rate raised sharply (+2 stages).' },
	ingrain: { title: 'INGRAIN', text: 'Heals 1/16 of max HP per turn but the Pokemon cannot switch or be forced out.' },
	aquaring: { title: 'AQUA RING', text: 'Heals 1/16 of max HP at the end of each turn.' },
	healblock: { title: 'HEAL BLOCK', text: 'Cannot restore HP for 3 turns (healing moves, Leftovers, Drain Punch...).' },
	embargo: { title: 'EMBARGO', text: 'Its item is unusable for 5 turns.' },
	commanding: { title: 'COMMANDER', text: 'This Pokemon has jumped inside Tatsugiri - it takes no direct action until Tatsugiri faints.' },
	typechange: { title: 'TYPE CHANGE', text: "This Pokemon's typing has changed (e.g. Protean, Terastallization)." },
};

function prettify(id: string): string {
	return id.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/-/g, ' ').toUpperCase();
}

/** Resolves a `kind:id` rule key (from data-gym-desc attributes) to a description. */
export function describeRule(key: string): RuleDescription | null {
	const sep = key.indexOf(':');
	if (sep < 0) return null;
	const kind = key.slice(0, sep);
	const id = key.slice(sep + 1);
	if (!id) return null;
	switch (kind) {
		case 'ability': {
			const info = Dex.forGen(9).abilities.get(id);
			return info ? { title: info.name.toUpperCase(), text: info.shortDesc || info.desc || '' } : { title: prettify(id), text: '' };
		}
		case 'item': {
			const info = Dex.forGen(9).items.get(id);
			return info ? { title: info.name.toUpperCase(), text: info.shortDesc || info.desc || '' } : { title: prettify(id), text: '' };
		}
		case 'status':
			return STATUS_DESCRIPTIONS[id] ?? { title: prettify(id), text: '' };
		case 'weather':
			return WEATHER_DESCRIPTIONS[id] ?? { title: prettify(id), text: '' };
		case 'terrain':
			return TERRAIN_DESCRIPTIONS[id] ?? { title: prettify(id), text: '' };
		case 'sidecond':
			return SIDE_CONDITION_DESCRIPTIONS[id] ?? { title: prettify(id), text: '' };
		case 'volatile':
			return VOLATILE_DESCRIPTIONS[id] ?? { title: prettify(id), text: '' };
		case 'stage':
			return {
				title: `${prettify(id)} STAGE`,
				text: 'Stat stages multiply a stat in battle: +1 = x1.5, +2 = x2, +3 = x2.5; -1 = x0.66, -2 = x0.5, -3 = x0.4. Stages range from -6 to +6 and reset on switching out.',
			};
		case 'move': {
			const info = Dex.forGen(9).moves.get(id);
			if (!info) return { title: prettify(id), text: '' };
			const meta = [
				`${String(info.type).toUpperCase()}/${String(info.category).toUpperCase()}`,
				info.basePower > 1 ? `${info.basePower} BP` : null,
				typeof info.accuracy === 'number' ? `${info.accuracy}% ACC` : null,
				info.pp ? `${info.pp} PP` : null,
			].filter(Boolean);
			return {
				title: info.name.toUpperCase(),
				text: [meta.join(' · '), info.shortDesc || info.desc || ''].filter(Boolean).join(' — '),
			};
		}
		case 'tera': {
			const type = prettify(id);
			return {
				title: `${type} TERASTALLIZATION`,
				text: `Terastallizing changes this Pokemon's type to ${type} for the rest of the battle (one use). Moves matching the Tera type gain a 2x power boost - or 1.5x if they already matched a base type - and keep their category.`,
			};
		}
		default:
			return null;
	}
}

/** Human label for an ability/item id when rendering chips ("protean" -> "PROTEAN"). */
export function ruleChipLabel(kind: string, id: string): string {
	switch (kind) {
		case 'ability': {
			const info = Dex.forGen(9).abilities.get(id);
			return (info?.name ?? id).toUpperCase();
		}
		case 'item': {
			const info = Dex.forGen(9).items.get(id);
			return (info?.name ?? id).toUpperCase();
		}
		default:
			return prettify(id);
	}
}
