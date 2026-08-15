export const TYPES = [
	'Normal',
	'Fire',
	'Water',
	'Electric',
	'Grass',
	'Ice',
	'Fighting',
	'Poison',
	'Ground',
	'Flying',
	'Psychic',
	'Bug',
	'Rock',
	'Ghost',
	'Dragon',
	'Dark',
	'Steel',
	'Fairy',
] as const;

export type TypeName = (typeof TYPES)[number];

/** Multipliers for each attacking type; omitted pairings are neutral (1×). */
const CHART: Record<TypeName, Partial<Record<TypeName, number>>> = {
	Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
	Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
	Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
	Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
	Grass: {
		Water: 2,
		Ground: 2,
		Rock: 2,
		Fire: 0.5,
		Grass: 0.5,
		Poison: 0.5,
		Flying: 0.5,
		Bug: 0.5,
		Dragon: 0.5,
		Steel: 0.5,
	},
	Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
	Fighting: {
		Normal: 2,
		Ice: 2,
		Rock: 2,
		Dark: 2,
		Steel: 2,
		Poison: 0.5,
		Flying: 0.5,
		Psychic: 0.5,
		Bug: 0.5,
		Fairy: 0.5,
		Ghost: 0,
	},
	Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
	Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
	Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
	Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
	Bug: {
		Grass: 2,
		Psychic: 2,
		Dark: 2,
		Fire: 0.5,
		Fighting: 0.5,
		Poison: 0.5,
		Flying: 0.5,
		Ghost: 0.5,
		Steel: 0.5,
		Fairy: 0.5,
	},
	Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
	Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
	Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
	Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
	Steel: { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
	Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
};

/** Types of every Pokémon in the tournament, keyed by the exact team string. */
export const POKEMON_TYPES: Record<string, TypeName[]> = {
	'Hisuian Typhlosion': ['Fire', 'Ghost'],
	'Murkrow': ['Dark', 'Flying'],
	'Torkoal': ['Fire'],
	'Hisuian Lilligant': ['Grass', 'Fighting'],
	'Pachirisu': ['Electric'],
	'Hisuian Goodra': ['Dragon', 'Steel'],
	'Alolan Ninetales': ['Ice', 'Fairy'],
	'Galarian Weezing': ['Poison', 'Fairy'],
	'Amoonguss': ['Grass', 'Poison'],
	'Blissey': ['Normal'],
	'Shuckle': ['Bug', 'Rock'],
	'Slaking': ['Normal'],
	'Aegislash': ['Steel', 'Ghost'],
	'Salamence': ['Dragon', 'Flying'],
	'Sylveon': ['Fairy'],
	'Gastrodon': ['Water', 'Ground'],
	'Hariyama': ['Fighting'],
	'Klefki': ['Steel', 'Fairy'],
	'Whimsicott': ['Grass', 'Fairy'],
	'Garchomp': ['Dragon', 'Ground'],
	'Hisuian Zoroark': ['Normal', 'Ghost'],
	'Charizard': ['Fire', 'Flying'],
	'Electabuzz': ['Electric'],
	'Empoleon': ['Water', 'Steel'],
	'Togekiss': ['Fairy', 'Flying'],
	'Dragonite': ['Dragon', 'Flying'],
	'Metagross': ['Steel', 'Psychic'],
	'Hitmontop': ['Fighting'],
	'Blastoise': ['Water'],
	'Gengar': ['Ghost', 'Poison'],
	'Scizor': ['Bug', 'Steel'],
	'Greninja': ['Water', 'Dark'],
	'Excadrill': ['Ground', 'Steel'],
	'Tyranitar': ['Rock', 'Dark'],
	'Chansey': ['Normal'],
	'Slowbro': ['Water', 'Psychic'],
	'Ferrothorn': ['Grass', 'Steel'],
	'Clefable': ['Fairy'],
	'Politoed': ['Water'],
	'Ludicolo': ['Water', 'Grass'],
	'Blaziken': ['Fire', 'Fighting'],
	'Gothitelle': ['Psychic'],
	'Raichu': ['Electric'],
	'Cloyster': ['Water', 'Ice'],
	'Meowstic (M)': ['Psychic'],
	'Abomasnow': ['Grass', 'Ice'],
	'Chandelure': ['Ghost', 'Fire'],
	'Milotic': ['Water'],
	'Alolan Muk': ['Poison', 'Dark'],
	'Talonflame': ['Fire', 'Flying'],
	'Mamoswine': ['Ice', 'Ground'],
	'Weavile': ['Dark', 'Ice'],
	'Rotom (W)': ['Electric', 'Water'],
	'Hydreigon': ['Dark', 'Dragon'],
	'Pelipper': ['Water', 'Flying'],
	'Kingdra': ['Water', 'Dragon'],
	'Lapras': ['Water', 'Ice'],
	'Magnezone': ['Electric', 'Steel'],
	'Lucario': ['Fighting', 'Steel'],
	'Swampert': ['Water', 'Ground'],
	'Porygon2': ['Normal'],
	'Arcanine': ['Fire'],
	'Kangaskhan': ['Normal'],
	'Gardevoir': ['Psychic', 'Fairy'],
	'Sableye': ['Dark', 'Ghost'],
	'Gyarados': ['Water', 'Flying'],
	'Breloom': ['Grass', 'Fighting'],
};

/** Stable URL fragment for a Pokémon's dossier section on its trainer's page. */
export const pokemonAnchor = (name: string): string =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

/** Damage multiplier of an attacking type against a set of defending types. */
export const multiplier = (attack: TypeName, defending: TypeName[]): number =>
	defending.reduce((product, type) => product * (CHART[attack][type] ?? 1), 1);

/** Defensive matchup: which attacking types this Pokémon resists (0.5x or less) and is weak to (2x or more). */
export function defensiveMatchups(types: TypeName[]): { resists: TypeName[]; weakTo: TypeName[] } {
	const resists: TypeName[] = [];
	const weakTo: TypeName[] = [];
	for (const attack of TYPES) {
		const m = multiplier(attack, types);
		if (m >= 2) weakTo.push(attack);
		else if (m <= 0.5) resists.push(attack);
	}
	return { resists, weakTo };
}

/** Offensive matchup: which types this Pokémon hits for 2x+ (strong vs) and can barely hurt (0.5x or less for all its attacking types). */
export function offensiveMatchups(types: TypeName[]): { strongVs: TypeName[]; weakVs: TypeName[] } {
	const strongVs: TypeName[] = [];
	const weakVs: TypeName[] = [];
	for (const target of TYPES) {
		let best = 1;
		for (const atk of types) best = Math.max(best, CHART[atk][target] ?? 1);
		if (best >= 2) strongVs.push(target);
		else if (best <= 0.5) weakVs.push(target);
	}
	return { strongVs, weakVs };
}

export interface TeamWeakness {
	/** Attacking type that hits at least one team member super effectively. */
	type: TypeName;
	/** Number of team members it hits for 2× or 4×. */
	count: number;
	/** True if it hits at least one member for 4×. */
	quad: boolean;
}

export interface TeamResistance {
	/** Attacking type that at least two team members resist or are immune to. */
	type: TypeName;
	/** Number of team members resisting (0.5×, 0.25×, or 0×). */
	count: number;
}

export interface TeamAnalysis {
	weaknesses: TeamWeakness[];
	resistances: TeamResistance[];
}

export function analyzeTeam(team: string[]): TeamAnalysis {
	const weak: TeamWeakness[] = [];
	const resist: TeamResistance[] = [];

	for (const attack of TYPES) {
		let weakCount = 0;
		let quad = false;
		let resistCount = 0;
		for (const name of team) {
			const types = POKEMON_TYPES[name];
			if (!types) continue;
			const m = multiplier(attack, types);
			if (m >= 2) {
				weakCount += 1;
				if (m >= 4) quad = true;
			}
			if (m <= 0.5) resistCount += 1;
		}
		if (weakCount > 0) weak.push({ type: attack, count: weakCount, quad });
		if (resistCount >= 2) resist.push({ type: attack, count: resistCount });
	}

	weak.sort((a, b) => b.count - a.count || Number(b.quad) - Number(a.quad));
	resist.sort((a, b) => b.count - a.count);

	return { weaknesses: weak, resistances: resist };
}
