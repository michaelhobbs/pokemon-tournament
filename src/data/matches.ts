export interface Match {
	/** Player number (1–11) of the first competitor. */
	p1: number;
	/** Player number (1–11) of the second competitor. */
	p2: number;
	/** Battles won by player 1. All three games are played; battle count doubles as a tiebreaker. */
	wins1?: number;
	/** Battles won by player 2. All three games are played; battle count doubles as a tiebreaker. */
	wins2?: number;
}

export interface Week {
	/** 1-based week number (501–509 on Ceefax). */
	number: number;
	/** Week commencing date, e.g. "W/C 06/04". */
	date: string;
	/** The five matches of the week. */
	matches: Match[];
}

export const WEEKS: Week[] = [
	{
		number: 1,
		date: 'W/C 06/04',
		matches: [
			{ p1: 1, p2: 10, wins1: 2, wins2: 1 },
			{ p1: 8, p2: 7, wins1: 2, wins2: 1 },
			{ p1: 9, p2: 5, wins1: 1, wins2: 2 },
			{ p1: 2, p2: 11, wins1: 2, wins2: 1 },
			{ p1: 6, p2: 3, wins1: 3, wins2: 0 },
		],
	},
	{
		number: 2,
		date: 'W/C 13/04',
		matches: [
			{ p1: 7, p2: 1, wins1: 0, wins2: 3 },
			{ p1: 5, p2: 10, wins1: 2, wins2: 1 },
			{ p1: 11, p2: 8, wins1: 1, wins2: 2 },
			{ p1: 3, p2: 9, wins1: 0, wins2: 3 },
			{ p1: 6, p2: 2, wins1: 2, wins2: 1 },
		],
	},
	{
		number: 3,
		date: 'W/C 20/04',
		matches: [
			{ p1: 1, p2: 5, wins1: 0, wins2: 3 },
			{ p1: 7, p2: 11, wins1: 1, wins2: 2 },
			{ p1: 10, p2: 3, wins1: 1, wins2: 2 },
			{ p1: 8, p2: 6, wins1: 0, wins2: 3 },
			{ p1: 9, p2: 2, wins1: 3, wins2: 0 },
		],
	},
	{
		number: 4,
		date: 'W/C 27/04',
		matches: [
			{ p1: 11, p2: 1, wins1: 0, wins2: 3 },
			{ p1: 3, p2: 5, wins1: 0, wins2: 3 },
			{ p1: 6, p2: 7, wins1: 2, wins2: 1 },
			{ p1: 2, p2: 10, wins1: 3, wins2: 0 },
			{ p1: 9, p2: 8, wins1: 1, wins2: 2 },
		],
	},
	{
		number: 5,
		date: 'W/C 11/05',
		matches: [
			{ p1: 1, p2: 3, wins1: 0, wins2: 3 },
			{ p1: 11, p2: 6, wins1: 0, wins2: 3 },
			{ p1: 5, p2: 2, wins1: 3, wins2: 0 },
			{ p1: 7, p2: 9, wins1: 0, wins2: 3 },
			{ p1: 10, p2: 8, wins1: 0, wins2: 3 },
		],
	},
	{
		number: 6,
		date: 'W/C 18/05',
		matches: [
			{ p1: 6, p2: 1, wins1: 2, wins2: 1 },
			{ p1: 2, p2: 3, wins1: 1, wins2: 2 },
			{ p1: 9, p2: 11, wins1: 3, wins2: 0 },
			{ p1: 8, p2: 5, wins1: 0, wins2: 3 },
			{ p1: 10, p2: 7, wins1: 2, wins2: 1 },
		],
	},
	{
		number: 7,
		date: 'W/C 25/05',
		matches: [
			{ p1: 1, p2: 2, wins1: 3, wins2: 0 },
			{ p1: 6, p2: 9, wins1: 2, wins2: 1 },
			{ p1: 3, p2: 8, wins1: 1, wins2: 2 },
			{ p1: 11, p2: 10, wins1: 1, wins2: 2 },
			{ p1: 5, p2: 7, wins1: 3, wins2: 0 },
		],
	},
	{
		number: 8,
		date: 'W/C 01/06',
		matches: [
			{ p1: 9, p2: 1, wins1: 2, wins2: 1 },
			{ p1: 8, p2: 2, wins1: 2, wins2: 1 },
			{ p1: 10, p2: 6, wins1: 1, wins2: 2 },
			{ p1: 7, p2: 3, wins1: 0, wins2: 3 },
			{ p1: 5, p2: 11, wins1: 3, wins2: 0 },
		],
	},
	{
		number: 9,
		date: 'W/C 08/06',
		matches: [
			{ p1: 1, p2: 8, wins1: 2, wins2: 1 },
			{ p1: 9, p2: 10, wins1: 1, wins2: 2 },
			{ p1: 2, p2: 7, wins1: 1, wins2: 2 },
			{ p1: 6, p2: 5, wins1: 1, wins2: 2 },
			{ p1: 3, p2: 11, wins1: 3, wins2: 0 },
		],
	},
	{
		number: 10,
		date: 'W/C 24/08',
		matches: [
			{ p1: 7, p2: 5, wins1: 0, wins2: 3 },
			{ p1: 9, p2: 11, wins1: 2, wins2: 1 },
			{ p1: 8, p2: 3, wins1: 0, wins2: 3 },
			{ p1: 2, p2: 10, wins1: 2, wins2: 1 },
			{ p1: 6, p2: 1, wins1: 0, wins2: 3 },
		],
	},
	{
		number: 11,
		date: 'W/C 31/08',
		matches: [
			{ p1: 11, p2: 7 },
			{ p1: 3, p2: 5, wins1: 0, wins2: 3 },
			{ p1: 10, p2: 9, wins1: 0, wins2: 3 },
			{ p1: 1, p2: 8 },
			{ p1: 6, p2: 2 },
		],
	},
	{
		number: 12,
		date: 'W/C 14/09',
		matches: [
			{ p1: 7, p2: 3 },
			{ p1: 11, p2: 10 },
			{ p1: 5, p2: 1 },
			{ p1: 9, p2: 6 },
			{ p1: 8, p2: 2 },
		],
	},
	{
		number: 13,
		date: 'W/C 21/09',
		matches: [
			{ p1: 10, p2: 7 },
			{ p1: 1, p2: 3 },
			{ p1: 6, p2: 11 },
			{ p1: 2, p2: 5 },
			{ p1: 8, p2: 9 },
		],
	},
	{
		number: 14,
		date: 'W/C 05/10',
		matches: [
			{ p1: 7, p2: 1 },
			{ p1: 10, p2: 6 },
			{ p1: 3, p2: 2 },
			{ p1: 11, p2: 8 },
			{ p1: 5, p2: 9 },
		],
	},
	{
		number: 15,
		date: 'W/C 12/10',
		matches: [
			{ p1: 6, p2: 7 },
			{ p1: 2, p2: 1 },
			{ p1: 8, p2: 10 },
			{ p1: 9, p2: 3 },
			{ p1: 5, p2: 11 },
		],
	},
	{
		number: 16,
		date: 'W/C 26/10',
		matches: [
			{ p1: 7, p2: 2 },
			{ p1: 6, p2: 8 },
			{ p1: 1, p2: 9 },
			{ p1: 10, p2: 5 },
			{ p1: 3, p2: 11 },
		],
	},
	{
		number: 17,
		date: 'W/C 02/11',
		matches: [
			{ p1: 8, p2: 7 },
			{ p1: 9, p2: 2 },
			{ p1: 5, p2: 6 },
			{ p1: 11, p2: 1 },
			{ p1: 3, p2: 10 },
		],
	},
	{
		number: 18,
		date: 'W/C 16/11',
		matches: [
			{ p1: 7, p2: 9 },
			{ p1: 8, p2: 5 },
			{ p1: 2, p2: 11 },
			{ p1: 6, p2: 3 },
			{ p1: 1, p2: 10 },
		],
	},
];

export const FIRST_HALF_LAST_WEEK = 9;

export const FIRST_HALF_WEEKS: Week[] = WEEKS.filter(
	(week) => week.number <= FIRST_HALF_LAST_WEEK,
);

export const SECOND_HALF_WEEKS: Week[] = WEEKS.filter(
	(week) => week.number > FIRST_HALF_LAST_WEEK,
);

export function weekFor(number: number): Week | undefined {
	return WEEKS.find((week) => week.number === number);
}
