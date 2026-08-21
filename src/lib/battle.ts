import { BattleStreams, RandomPlayerAI, Teams, PRNG } from '@pkmn/sim';
import { POKEMON_SETS } from '../data/pokemon-sets';

export interface BattleResult {
	win: boolean;
	log: string[];
	items: Record<string, string>;
}

const SPECIES_TO_KEY: Record<string, string> = {};
for (const [key, set] of Object.entries(POKEMON_SETS)) {
	SPECIES_TO_KEY[set.species] = key;
}

export function speciesToKey(species: string): string {
	return SPECIES_TO_KEY[species] ?? species;
}

export function buildTeam(species: string[], level = 100): string {
	const sets = species.map((name) => {
		const set = POKEMON_SETS[name];
		if (!set) {
			return {
				name,
				species: name,
				item: 'Leftovers',
				ability: 'Huge Power',
				nature: 'Hardy',
				gender: '',
				evs: { hp: 252, atk: 252, def: 0, spa: 0, spd: 4, spe: 0 },
				ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
				level,
				moves: ['Tackle', 'Tackle', 'Tackle', 'Tackle'],
			};
		}
		return {
			name,
			species: set.species,
			item: set.item,
			ability: set.ability,
			nature: set.nature,
			gender: '',
			evs: set.evs,
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 } as const,
			level,
			moves: set.moves,
		};
	});
	return Teams.pack(sets);
}

export async function runBattle(
	humonTeam: string[],
	bossTeam: string[],
	seed: number,
): Promise<BattleResult> {
	const prng = new PRNG(`gen5,${seed},${seed},${seed},${seed}`);
	const stream = new BattleStreams.BattleStream();
	const streams = BattleStreams.getPlayerStreams(stream);

	const ai1 = new RandomPlayerAI(streams.p1, { seed: prng });
	const ai2 = new RandomPlayerAI(streams.p2, { seed: prng });

	void ai1.start();
	void ai2.start();

	const spec = { formatid: 'gen9customgame', seed: prng.getSeed() };
	const init =
		`>start ${JSON.stringify(spec)}\n` +
		`>player p1 ${JSON.stringify({ name: 'HUMON', team: buildTeam(humonTeam) })}\n` +
		`>player p2 ${JSON.stringify({ name: 'GYM', team: buildTeam(bossTeam) })}`;
	void streams.omniscient.write(init);

	const raw = await streams.omniscient.readAll();

	const log: string[] = [];
	let win = false;
	for (const chunk of raw) {
		for (const line of chunk.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed || !trimmed.startsWith('|')) continue;
			log.push(trimmed);
			if (trimmed.startsWith('|win|')) {
				const winner = trimmed.split('|')[2];
				win = winner === 'HUMON';
			}
		}
	}

	const items: Record<string, string> = {};
	for (const name of [...humonTeam, ...bossTeam]) {
		const set = POKEMON_SETS[name];
		if (set) items[set.species] = set.item;
		else items[name] = 'Leftovers';
	}

	return { win, log, items };
}
