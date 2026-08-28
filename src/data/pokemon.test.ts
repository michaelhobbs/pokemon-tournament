import { describe, it, expect } from 'vitest';
import {
	TYPES,
	pokemonAnchor,
	multiplier,
	defensiveMatchups,
	offensiveMatchups,
	analyzeTeam,
	POKEMON_TYPES,
} from './pokemon';

describe('TYPES', () => {
	it('has exactly 18 types', () => {
		expect(TYPES).toHaveLength(18);
	});

	it('has all standard Pokémon types', () => {
		const expected = [
			'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
			'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
			'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
		];
		for (const type of expected) {
			expect(TYPES).toContain(type);
		}
	});
});

describe('pokemonAnchor', () => {
	it('lowercases and slugifies', () => {
		expect(pokemonAnchor('Hisuian Typhlosion')).toBe('hisuian-typhlosion');
	});

	it('handles special characters', () => {
		expect(pokemonAnchor('Meowstic (M)')).toBe('meowstic-m');
		expect(pokemonAnchor('Rotom (W)')).toBe('rotom-w');
	});

	it('trims leading/trailing hyphens', () => {
		expect(pokemonAnchor('  Alolan Ninetales  ')).toBe('alolan-ninetales');
	});
});

describe('multiplier', () => {
	it('returns 1 for neutral matchups', () => {
		expect(multiplier('Normal', ['Fire'])).toBe(1);
	});

	it('returns 2 for super effective', () => {
		expect(multiplier('Fire', ['Grass'])).toBe(2);
		expect(multiplier('Water', ['Fire'])).toBe(2);
	});

	it('returns 0.5 for not very effective', () => {
		expect(multiplier('Fire', ['Water'])).toBe(0.5);
	});

	it('returns 0 for immune', () => {
		expect(multiplier('Normal', ['Ghost'])).toBe(0);
		expect(multiplier('Electric', ['Ground'])).toBe(0);
	});

	it('returns 0 for Ground vs Flying (immune)', () => {
		expect(multiplier('Ground', ['Flying'])).toBe(0);
	});

	it('handles dual types correctly (4x weakness)', () => {
		expect(multiplier('Fire', ['Grass', 'Ice'])).toBe(4);
	});

	it('handles dual types correctly (resistances cancel)', () => {
		// Water attacking Water/Fire: 0.5 * 2 = 1
		expect(multiplier('Water', ['Water', 'Fire'])).toBe(1);
	});

	it('handles dual types correctly (0x immune overrides)', () => {
		// Electric vs Water/Ground: 2 * 0 = 0
		expect(multiplier('Electric', ['Water', 'Ground'])).toBe(0);
	});
});

describe('defensiveMatchups', () => {
	it('Fire is weak to Water, Ground, Rock', () => {
		const { weakTo } = defensiveMatchups(['Fire']);
		expect(weakTo).toContain('Water');
		expect(weakTo).toContain('Ground');
		expect(weakTo).toContain('Rock');
	});

	it('Fire resists Fire, Grass, Ice, Bug, Steel, Fairy', () => {
		const { resists } = defensiveMatchups(['Fire']);
		expect(resists).toContain('Fire');
		expect(resists).toContain('Grass');
		expect(resists).toContain('Ice');
		expect(resists).toContain('Bug');
		expect(resists).toContain('Steel');
		expect(resists).toContain('Fairy');
	});

	it('Steel/Fairy (Klefki) has many resistances', () => {
		const { resists } = defensiveMatchups(['Steel', 'Fairy']);
		expect(resists.length).toBeGreaterThanOrEqual(8);
	});

	it('Normal/Ghost (Hisuian Zoroark) has key immunities', () => {
		const { resists } = defensiveMatchups(['Normal', 'Ghost']);
		// Normal is immune to Ghost, Ghost is immune to Normal
		expect(resists).toContain('Ghost');
	});
});

describe('offensiveMatchups', () => {
	it('Fire hits Grass, Ice, Bug, Steel super effectively', () => {
		const { strongVs } = offensiveMatchups(['Fire']);
		expect(strongVs).toContain('Grass');
		expect(strongVs).toContain('Ice');
		expect(strongVs).toContain('Bug');
		expect(strongVs).toContain('Steel');
	});

	it('Fire is resisted by Fire, Water, Rock, Dragon', () => {
		const { weakVs } = offensiveMatchups(['Fire']);
		expect(weakVs).toContain('Fire');
		expect(weakVs).toContain('Water');
		expect(weakVs).toContain('Rock');
		expect(weakVs).toContain('Dragon');
	});
});

describe('POKEMON_TYPES', () => {
	it('has entries for all tournament Pokémon', () => {
		const count = Object.keys(POKEMON_TYPES).length;
		expect(count).toBeGreaterThanOrEqual(60);
	});

	it('every type is a valid TypeName', () => {
		for (const [name, types] of Object.entries(POKEMON_TYPES)) {
			for (const t of types) {
				expect(TYPES).toContain(t);
			}
		}
	});

	it('dual-type Pokémon have exactly 2 types', () => {
		expect(POKEMON_TYPES['Hisuian Typhlosion']).toHaveLength(2);
		expect(POKEMON_TYPES['Scizor']).toHaveLength(2);
	});

	it('single-type Pokémon have exactly 1 type', () => {
		expect(POKEMON_TYPES['Torkoal']).toHaveLength(1);
		expect(POKEMON_TYPES['Blissey']).toHaveLength(1);
	});
});

describe('analyzeTeam', () => {
	it('returns weaknesses and resistances for a team', () => {
		const analysis = analyzeTeam(['Scizor', 'Greninja', 'Excadrill', 'Tyranitar', 'Chansey', 'Slowbro']);
		expect(analysis.weaknesses.length).toBeGreaterThan(0);
		expect(analysis.resistances.length).toBeGreaterThan(0);
	});

	it('sorts weaknesses by count descending', () => {
		const analysis = analyzeTeam(['Scizor', 'Greninja', 'Excadrill', 'Tyranitar', 'Chansey', 'Slowbro']);
		for (let i = 1; i < analysis.weaknesses.length; i++) {
			expect(analysis.weaknesses[i].count).toBeLessThanOrEqual(analysis.weaknesses[i - 1].count);
		}
	});

	it('identifies quad weaknesses', () => {
		// Scizor (Bug/Steel) is 4x weak to Fire
		const analysis = analyzeTeam(['Scizor']);
		const fireWeak = analysis.weaknesses.find((w) => w.type === 'Fire');
		expect(fireWeak).toBeDefined();
		expect(fireWeak!.quad).toBe(true);
	});

	it('handles unknown Pokémon names gracefully', () => {
		const analysis = analyzeTeam(['UnknownPokemon']);
		expect(analysis.weaknesses).toHaveLength(0);
		expect(analysis.resistances).toHaveLength(0);
	});
});
