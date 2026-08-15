import { TYPES, multiplier, POKEMON_TYPES, type TypeName } from './pokemon';

export interface TeraFixedType {
	type: TypeName;
	/** Number of opposing team members whose STAB includes this type. */
	oppCount: number;
}

export interface TeraDefensiveSuggestion {
	teraType: TypeName;
	pokemon: string;
	/** Total exploitable weakness load after this tera (lower is better). */
	score: number;
	/** Team weaknesses this tera removes that the opponent could actually exploit. */
	fixed: TeraFixedType[];
	/** New weaknesses this tera introduces that the opponent could exploit. */
	introduced: TeraFixedType[];
}

export interface TeraOffensiveSuggestion {
	teraType: TypeName;
	/** Preferred carrier: a team member who does NOT already have this type. */
	pokemon: string;
	/** Number of opposing members hit super-effectively (4× counts double). */
	score: number;
	/** Opposing team members hit for 2× or more by this type's STAB. */
	hits: string[];
}

export interface TeraAnalysis {
	defensive: TeraDefensiveSuggestion[];
	offensive: TeraOffensiveSuggestion[];
}

/** How many team members have each type in their STAB. */
const teamTypeCounts = (team: string[]): Record<TypeName, number> => {
	const counts = Object.fromEntries(TYPES.map((type) => [type, 0])) as Record<TypeName, number>;
	for (const name of team) {
		for (const type of POKEMON_TYPES[name] ?? []) counts[type] += 1;
	}
	return counts;
};

/** Per attacking type: total super-effective load of a team (2× counts 1, 4× counts 2). */
const weaknessMap = (team: string[]): Record<TypeName, number> => {
	const map = Object.fromEntries(TYPES.map((type) => [type, 0])) as Record<TypeName, number>;
	for (const name of team) {
		const types = POKEMON_TYPES[name];
		if (!types) continue;
		for (const attack of TYPES) {
			const m = multiplier(attack, types);
			if (m >= 2) map[attack] += m >= 4 ? 2 : 1;
		}
	}
	return map;
};

/**
 * Exploitable weakness load: each weakness is weighted by how many opposing
 * members can actually attack with that type. Fixing a weakness the opponent
 * can't hit is worthless; fixing one they spam is critical.
 */
const threatScore = (map: Record<TypeName, number>, oppCounts: Record<TypeName, number>): number =>
	TYPES.reduce((sum, type) => sum + map[type] * oppCounts[type], 0);

/**
 * Which tera type (and carrier) best removes the team's weaknesses that the
 * opponent can actually exploit. Terastallizing switches the carrier's
 * defensive typing to the single tera type.
 */
export function analyzeTeraDefensive(team: string[], opponent: string[]): TeraDefensiveSuggestion[] {
	const oppCounts = teamTypeCounts(opponent);
	const base = weaknessMap(team);
	const results: TeraDefensiveSuggestion[] = [];

	for (const teraType of TYPES) {
		let best:
			| { pokemon: string; score: number; fixed: TeraFixedType[]; introduced: TeraFixedType[] }
			| undefined;

		for (const carrier of team) {
			// Tera to a type the carrier already has keeps its original defensive
			// typing — no defensive change — so it's never a worthwhile suggestion.
			if ((POKEMON_TYPES[carrier] ?? []).includes(teraType)) continue;
			const others = team.filter((name) => name !== carrier);
			const map = weaknessMap(others);
			for (const attack of TYPES) {
				if (multiplier(attack, [teraType]) >= 2) map[attack] += 1;
			}
			const score = threatScore(map, oppCounts);
			if (!best || score < best.score) {
				const fixed = TYPES.filter((type) => oppCounts[type] > 0 && base[type] > map[type]).map(
					(type) => ({ type, oppCount: oppCounts[type] }),
				);
				const introduced = TYPES.filter(
					(type) => oppCounts[type] > 0 && map[type] > base[type],
				).map((type) => ({ type, oppCount: oppCounts[type] }));
				best = { pokemon: carrier, score, fixed, introduced };
			}
		}

		if (best) results.push({ teraType, ...best });
	}

	results.sort(
		(a, b) =>
			a.score - b.score ||
			a.introduced.length - b.introduced.length ||
			b.fixed.length - a.fixed.length,
	);
	return results.slice(0, 3);
}

/**
 * Which tera type the most opposing members are weak to — the offensive payoff
 * of giving a STAB boost to that type's moves (Tera Blast is universal).
 */
export function analyzeTeraOffensive(team: string[], opponent: string[]): TeraOffensiveSuggestion[] {
	const results: TeraOffensiveSuggestion[] = [];

	for (const teraType of TYPES) {
		let score = 0;
		const hits: string[] = [];
		for (const name of opponent) {
			const m = multiplier(teraType, POKEMON_TYPES[name] ?? []);
			if (m >= 2) {
				score += m >= 4 ? 2 : 1;
				hits.push(name);
			}
		}
		const carrier = team.find(
			(name) => !(POKEMON_TYPES[name] ?? []).includes(teraType),
		);
		if (!carrier) continue;
		results.push({ teraType, pokemon: carrier, score, hits });
	}

	results.sort((a, b) => b.score - a.score || a.hits.length - b.hits.length);
	return results.slice(0, 3);
}

/** Both sides of the tera recommendation for a single trainer. */
export function analyzeTera(team: string[], opponent: string[]): TeraAnalysis {
	return {
		defensive: analyzeTeraDefensive(team, opponent),
		offensive: analyzeTeraOffensive(team, opponent),
	};
}
