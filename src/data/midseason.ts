export interface MidseasonSwap {
	/** Pokémon removed from the initial draft team */
	removed: string;
	/** Pokémon drafted to replace it */
	replacement: string;
}

/** Mid-season draft swaps, keyed by player number. Max 2 per player. */
export const MIDSEASON_SWAPS: Record<number, MidseasonSwap[]> = {
	1: [{ removed: 'Pachirisu', replacement: 'Porygon2' }],
	3: [{ removed: 'Klefki', replacement: 'Arcanine' }],
	5: [{ removed: 'Empoleon', replacement: 'Kangaskhan' }],
	7: [
		{ removed: 'Chansey', replacement: 'Gardevoir' },
		{ removed: 'Slowbro', replacement: 'Sableye' },
	],
	8: [{ removed: 'Gothitelle', replacement: 'Klefki' }],
	9: [{ removed: 'Abomasnow', replacement: 'Gyarados' }],
	10: [{ removed: 'Weavile', replacement: 'Breloom' }],
};
