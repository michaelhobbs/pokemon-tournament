import { describe, it, expect } from 'vitest';
import { PLAYERS, findPlayer } from './players';

describe('PLAYERS', () => {
	it('has exactly 10 players', () => {
		expect(PLAYERS).toHaveLength(10);
	});

	it('has unique numbers', () => {
		const numbers = PLAYERS.map((p) => p.number);
		expect(new Set(numbers).size).toBe(numbers.length);
	});

	it('skips number 4', () => {
		expect(PLAYERS.find((p) => p.number === 4)).toBeUndefined();
	});

	it('all numbers are between 1 and 11', () => {
		for (const player of PLAYERS) {
			expect(player.number).toBeGreaterThanOrEqual(1);
			expect(player.number).toBeLessThanOrEqual(11);
		}
	});

	it('every player has a 6-Pokémon team', () => {
		for (const player of PLAYERS) {
			expect(player.team).toHaveLength(6);
			for (const name of player.team) {
				expect(typeof name).toBe('string');
				expect(name.length).toBeGreaterThan(0);
			}
		}
	});

	it('every player has non-empty name, epithet, signature, and hometown', () => {
		for (const player of PLAYERS) {
			expect(player.name.length).toBeGreaterThan(0);
			expect(player.epithet.length).toBeGreaterThan(0);
			expect(player.signature.length).toBeGreaterThan(0);
			expect(player.hometown.length).toBeGreaterThan(0);
		}
	});

	it('signature is included in the team', () => {
		for (const player of PLAYERS) {
			expect(player.team).toContain(player.signature);
		}
	});
});

describe('findPlayer', () => {
	it('finds a player by number', () => {
		const player = findPlayer(1);
		expect(player).toBeDefined();
		expect(player!.name).toBe('Gilang');
	});

	it('returns undefined for unknown numbers', () => {
		expect(findPlayer(4)).toBeUndefined();
		expect(findPlayer(99)).toBeUndefined();
		expect(findPlayer(0)).toBeUndefined();
	});
});
