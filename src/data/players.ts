export interface Player {
	/** Ceefax-style index number, 1–11 */
	number: number;
	/** Trainer name */
	name: string;
	/** Short epithet shown alongside the name */
	epithet: string;
	/** Signature / starter Pokémon */
	signature: string;
	/** Battle team, six Pokémon */
	team: string[];
	/** Home town */
	hometown: string;
}

export const PLAYERS: Player[] = [
	{
		number: 1,
		name: 'Gilang',
		epithet: 'HISUI HEIR',
		signature: 'Hisuian Typhlosion',
		team: ['Hisuian Typhlosion', 'Murkrow', 'Torkoal', 'Hisuian Lilligant', 'Pachirisu', 'Hisuian Goodra'],
		hometown: 'Jubilife Village',
	},
	{
		number: 2,
		name: 'Mark',
		epithet: 'THE BULWARK',
		signature: 'Alolan Ninetales',
		team: ['Alolan Ninetales', 'Galarian Weezing', 'Amoonguss', 'Blissey', 'Shuckle', 'Slaking'],
		hometown: 'Mt. Lanakila',
	},
	{
		number: 3,
		name: 'Viv',
		epithet: 'FAIRY KNIGHT',
		signature: 'Aegislash',
		team: ['Aegislash', 'Salamence', 'Sylveon', 'Gastrodon', 'Hariyama', 'Klefki'],
		hometown: 'Ballonlea',
	},
	{
		number: 5,
		name: 'Yogi',
		epithet: 'PRANKSTER',
		signature: 'Whimsicott',
		team: ['Whimsicott', 'Garchomp', 'Hisuian Zoroark', 'Charizard', 'Electabuzz', 'Empoleon'],
		hometown: 'Ilex Forest',
	},
	{
		number: 6,
		name: 'Jack',
		epithet: 'ACE TRAINER',
		signature: 'Togekiss',
		team: ['Togekiss', 'Dragonite', 'Metagross', 'Hitmontop', 'Blastoise', 'Gengar'],
		hometown: 'Ever Grande City',
	},
	{
		number: 7,
		name: 'Michael',
		epithet: 'CRIMSON PINCER',
		signature: 'Scizor',
		team: ['Scizor', 'Greninja', 'Excadrill', 'Tyranitar', 'Chansey', 'Slowbro'],
		hometown: 'Iron Island',
	},
	{
		number: 8,
		name: 'Alex',
		epithet: 'RAINMAKER',
		signature: 'Ferrothorn',
		team: ['Ferrothorn', 'Clefable', 'Politoed', 'Ludicolo', 'Blaziken', 'Gothitelle'],
		hometown: 'Fortree City',
	},
	{
		number: 9,
		name: 'Conor',
		epithet: 'FROST PHANTOM',
		signature: 'Raichu',
		team: ['Raichu', 'Cloyster', 'Meowstic (M)', 'Abomasnow', 'Chandelure', 'Milotic'],
		hometown: 'Snowpoint City',
	},
	{
		number: 10,
		name: 'Ben',
		epithet: 'STORM FRONT',
		signature: 'Alolan Muk',
		team: ['Alolan Muk', 'Talonflame', 'Mamoswine', 'Weavile', 'Rotom (W)', 'Hydreigon'],
		hometown: 'Icirrus City',
	},
	{
		number: 11,
		name: 'Hannah',
		epithet: 'TIDE QUEEN',
		signature: 'Pelipper',
		team: ['Pelipper', 'Kingdra', 'Lapras', 'Magnezone', 'Lucario', 'Swampert'],
		hometown: 'Sootopolis City',
	},
];

export function findPlayer(number: number): Player | undefined {
	return PLAYERS.find((player) => player.number === number);
}
