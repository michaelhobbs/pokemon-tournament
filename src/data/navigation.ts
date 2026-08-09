import { PLAYERS } from './players';
import { WEEKS } from './matches';
import { AWARDS, awardDisplayName } from './awards';

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
export const HEAD_TO_HEAD_PAGE: PageLink = { number: '301', label: 'HEAD TO HEAD', href: `${base}standings/head-to-head` };
export const TRAINERS_PAGE: PageLink = { number: '400', label: 'TRAINERS', href: `${base}trainers` };
export const GAMES_PAGE: PageLink = { number: '500', label: 'GAMES', href: `${base}games` };
export const TROPHY_PAGE: PageLink = { number: '600', label: 'TROPHY', href: `${base}trophy` };
export const AWARDS_PAGE: PageLink = { number: '700', label: 'AWARDS', href: `${base}awards` };
export const HOMETOWNS_PAGE: PageLink = { number: '800', label: 'HOMETOWNS', href: `${base}map` };
export const HELP_PAGE: PageLink = { number: '900', label: 'HELP', href: `${base}help` };
export const HIDDEN_PAGE: PageLink = {
	number: '000',
	label: 'SECRET',
	href: `${base}000`,
	hidden: true,
};

export const PAGES: PageLink[] = [
	HOME_PAGE,
	RULES_PAGE,
	STANDINGS_PAGE,
	TRAINERS_PAGE,
	GAMES_PAGE,
	TROPHY_PAGE,
	AWARDS_PAGE,
	HOMETOWNS_PAGE,
	HELP_PAGE,
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

/** Every navigable page in arrow-key order: main pages, then trainers, games, weeks, then help. */
export const ALL_PAGES: PageLink[] = [
	HIDDEN_PAGE,
	HOME_PAGE,
	RULES_PAGE,
	STANDINGS_PAGE,
	HEAD_TO_HEAD_PAGE,
	TRAINERS_PAGE,
	...TRAINER_PAGES,
	GAMES_PAGE,
	...GAME_WEEK_PAGES,
	TROPHY_PAGE,
	AWARDS_PAGE,
	...AWARD_PAGES,
	HOMETOWNS_PAGE,
	HELP_PAGE,
];

/** Every non-hidden page, used for the help page directory. */
export const VISIBLE_PAGES: PageLink[] = ALL_PAGES.filter((page) => !page.hidden);

export function findPage(number: string): PageLink | undefined {
	return ALL_PAGES.find((page) => page.number === number);
}
