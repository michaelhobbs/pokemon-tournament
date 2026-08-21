import { PLAYERS } from './players';
import { WEEKS } from './matches';
import { AWARDS, awardDisplayName } from './awards';
import { TRAINER_MATCHUPS } from './matchups';

export interface PageLink {
	/** Ceefax page number shown in nav, e.g. "100" */
	number: string;
	label: string;
	href: string;
	/** Hidden pages are reachable by number but omitted from directories. */
	hidden?: boolean;
}

const base = import.meta.env.BASE_URL;

export const HOME_PAGE: PageLink = { number: '100', label: 'HOME', href: base };
export const RULES_PAGE: PageLink = { number: '200', label: 'RULES', href: `${base}rules` };
export const STANDINGS_PAGE: PageLink = { number: '300', label: 'STANDINGS', href: `${base}standings` };
export const HEAD_TO_HEAD_PAGE: PageLink = { number: '301', label: 'HEAD TO HEAD - 1ST HALF', href: `${base}standings/head-to-head` };
export const HEAD_TO_HEAD_2ND_PAGE: PageLink = { number: '302', label: 'HEAD TO HEAD - 2ND HALF', href: `${base}standings/head-to-head-2nd` };
export const INITIAL_DRAFT_PAGE: PageLink = { number: '310', label: 'INITIAL DRAFT', href: `${base}standings/draft` };
export const MIDSEASON_DRAFT_PAGE: PageLink = { number: '311', label: 'MID-SEASON DRAFT', href: `${base}standings/draft-mid` };

/** Child pages of the standings group, in ascending page-number order. */
export const STANDINGS_CHILD_PAGES: PageLink[] = [
	HEAD_TO_HEAD_PAGE,
	HEAD_TO_HEAD_2ND_PAGE,
	INITIAL_DRAFT_PAGE,
	MIDSEASON_DRAFT_PAGE,
];
export const TRAINERS_PAGE: PageLink = { number: '400', label: 'TRAINERS', href: `${base}trainers` };
export const GAMES_PAGE: PageLink = { number: '500', label: 'GAMES', href: `${base}games` };
export const TROPHY_PAGE: PageLink = { number: '600', label: 'TROPHY', href: `${base}trophy` };
export const AWARDS_PAGE: PageLink = { number: '700', label: 'AWARDS', href: `${base}awards` };
export const HOMETOWNS_PAGE: PageLink = { number: '800', label: 'HOMETOWNS', href: `${base}map` };
export const MANAGER_PAGE: PageLink = { number: '810', label: 'MANAGER', href: `${base}manager` };
export const ROSTER_PAGE: PageLink = { number: '811', label: 'ROSTER', href: `${base}manager/roster` };
export const TRAVEL_PAGE: PageLink = { number: '812', label: 'TRAVEL', href: `${base}manager/travel` };
export const TRAINING_PAGE: PageLink = { number: '813', label: 'TRAINING', href: `${base}manager/training` };
export const GYMS_PAGE: PageLink = { number: '814', label: 'GYMS', href: `${base}manager/gyms` };
export const UNLOCKS_PAGE: PageLink = { number: '815', label: 'UNLOCKS', href: `${base}manager/unlocks` };
export const MONS_DIRECTORY_PAGE: PageLink = { number: '900', label: 'POKEDEX', href: `${base}mons` };
export const MONS_PAGE: PageLink = { number: '901', label: 'ALL POKEMON - 2ND HALF', href: `${base}mons/stats` };
export const HELP_PAGE: PageLink = { number: '990', label: 'HELP', href: `${base}help` };
export const HIDDEN_PAGE: PageLink = {
	number: '000',
	label: 'SECRET',
	href: `${base}000`,
	hidden: true,
};
export const NOT_FOUND_PAGE: PageLink = {
	number: '404',
	label: 'PAGE NOT FOUND',
	href: `${base}404`,
	hidden: true,
};
export const JOAk_PAGE: PageLink = {
	number: '123',
	label: 'PROFESSOR JOAK',
	href: `${base}123`,
	hidden: true,
};
export const DEVILMON_PAGE: PageLink = {
	number: '666',
	label: 'DEVILMON',
	href: `${base}666`,
	hidden: true,
};
export const COPMON_PAGE: PageLink = {
	number: '911',
	label: 'COPMON',
	href: `${base}911`,
	hidden: true,
};

/** Child pages of the manager group, in ascending page-number order. */
export const MANAGER_CHILD_PAGES: PageLink[] = [
	ROSTER_PAGE,
	TRAVEL_PAGE,
	TRAINING_PAGE,
	GYMS_PAGE,
	UNLOCKS_PAGE,
];

export const PAGES: PageLink[] = [
	HOME_PAGE,
	RULES_PAGE,
	STANDINGS_PAGE,
	TRAINERS_PAGE,
	GAMES_PAGE,
	TROPHY_PAGE,
	AWARDS_PAGE,
	HOMETOWNS_PAGE,
	MANAGER_PAGE,
	MONS_DIRECTORY_PAGE,
];

export const TRAINER_PAGES: PageLink[] = PLAYERS.map((player) => ({
	number: String(400 + player.number),
	label: `${player.name} — ${player.epithet}`,
	href: `${base}trainers/${player.number}`,
}));

export const GAME_WEEK_PAGES: PageLink[] = WEEKS.map((week) => ({
	number: String(500 + week.number),
	label: `WEEK ${week.number}`,
	href: `${base}games/${week.number}`,
}));

export const AWARD_PAGES: PageLink[] = AWARDS.map((award) => ({
	number: String(award.number),
	label: awardDisplayName(award),
	href: `${base}awards/${award.number}`,
}));

export const MONS_MATCHUP_PAGES: PageLink[] = TRAINER_MATCHUPS.map((matchup) => ({
	number: String(matchup.number),
	label: `${findPlayerLabel(matchup.player1Number)} vs ${findPlayerLabel(matchup.player2Number)}`,
	href: `${base}mons/${matchup.number}`,
}));

/** All pages in the 900s, as listed on the POKEDEX page. */
export const MONS_DIRECTORY_PAGES: PageLink[] = [
	MONS_DIRECTORY_PAGE,
	MONS_PAGE,
	...MONS_MATCHUP_PAGES,
];

function findPlayerLabel(playerNumber: number): string {
	return PLAYERS.find((player) => player.number === playerNumber)?.name ?? String(playerNumber);
}

/** Every navigable page in arrow-key order: main pages, then trainers, games, weeks, then help (990). */
export const ALL_PAGES: PageLink[] = [
	HIDDEN_PAGE,
	NOT_FOUND_PAGE,
	JOAk_PAGE,
	DEVILMON_PAGE,
	COPMON_PAGE,
	HOME_PAGE,
	RULES_PAGE,
	STANDINGS_PAGE,
	HEAD_TO_HEAD_PAGE,
	HEAD_TO_HEAD_2ND_PAGE,
	INITIAL_DRAFT_PAGE,
	MIDSEASON_DRAFT_PAGE,
	TRAINERS_PAGE,
	...TRAINER_PAGES,
	GAMES_PAGE,
	...GAME_WEEK_PAGES,
	TROPHY_PAGE,
	AWARDS_PAGE,
	...AWARD_PAGES,
	HOMETOWNS_PAGE,
	MANAGER_PAGE,
	...MANAGER_CHILD_PAGES,
	MONS_DIRECTORY_PAGE,
	MONS_PAGE,
	...MONS_MATCHUP_PAGES,
	HELP_PAGE,
];

/** Every non-hidden page, used for the help page directory. */
export const VISIBLE_PAGES: PageLink[] = ALL_PAGES.filter((page) => !page.hidden);

export function findPage(number: string): PageLink | undefined {
	return ALL_PAGES.find((page) => page.number === number);
}
