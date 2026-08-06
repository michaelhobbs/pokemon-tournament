import { PLAYERS } from './players';
import { WEEKS } from './matches';
import { AWARDS } from './awards';

export interface PageLink {
	/** Ceefax page number shown in nav, e.g. "100" */
	number: string;
	label: string;
	href: string;
}

export const HOME_PAGE: PageLink = { number: '100', label: 'HOME', href: '/' };
export const RULES_PAGE: PageLink = { number: '200', label: 'RULES', href: '/rules' };
export const STANDINGS_PAGE: PageLink = { number: '300', label: 'STANDINGS', href: '/standings' };
export const HEAD_TO_HEAD_PAGE: PageLink = { number: '301', label: 'HEAD TO HEAD', href: '/standings/head-to-head' };
export const TRAINERS_PAGE: PageLink = { number: '400', label: 'TRAINERS', href: '/trainers' };
export const GAMES_PAGE: PageLink = { number: '500', label: 'GAMES', href: '/games' };
export const TROPHY_PAGE: PageLink = { number: '600', label: 'TROPHY', href: '/trophy' };
export const AWARDS_PAGE: PageLink = { number: '700', label: 'AWARDS', href: '/awards' };
export const HOMETOWNS_PAGE: PageLink = { number: '800', label: 'HOMETOWNS', href: '/map' };
export const HELP_PAGE: PageLink = { number: '900', label: 'HELP', href: '/help' };

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
	href: `/trainers/${player.number}`,
}));

export const GAME_WEEK_PAGES: PageLink[] = WEEKS.map((week) => ({
	number: String(500 + week.number),
	label: `WEEK ${week.number}`,
	href: `/games/${week.number}`,
}));

export const AWARD_PAGES: PageLink[] = AWARDS.map((award) => ({
	number: String(award.number),
	label: award.name,
	href: `/awards/${award.number}`,
}));

/** Every navigable page in arrow-key order: main pages, then trainers, games, weeks, then help. */
export const ALL_PAGES: PageLink[] = [
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

export function findPage(number: string): PageLink | undefined {
	return ALL_PAGES.find((page) => page.number === number);
}
