import { describe, it, expect } from 'vitest';
import {
	ALL_PAGES,
	PAGES,
	VISIBLE_PAGES,
	TRAINER_PAGES,
	GAME_WEEK_PAGES,
	AWARD_PAGES,
	findPage,
} from './navigation';

describe('PAGES', () => {
	it('has 10 main pages', () => {
		expect(PAGES).toHaveLength(10);
	});

	it('all main pages have 3-digit number strings', () => {
		for (const page of PAGES) {
			expect(page.number).toMatch(/^\d{3}$/);
		}
	});

	it('all main pages have labels and hrefs', () => {
		for (const page of PAGES) {
			expect(page.label.length).toBeGreaterThan(0);
			expect(page.href.length).toBeGreaterThan(0);
		}
	});
});

describe('ALL_PAGES', () => {
	it('has no duplicate page numbers', () => {
		const numbers = ALL_PAGES.map((p) => p.number);
		expect(new Set(numbers).size).toBe(numbers.length);
	});

	it('includes HOME_PAGE (100)', () => {
		const home = ALL_PAGES.find((p) => p.number === '100');
		expect(home).toBeDefined();
		expect(home!.label).toBe('HOME');
	});

	it('includes HELP_PAGE (990)', () => {
		const help = ALL_PAGES.find((p) => p.number === '990');
		expect(help).toBeDefined();
	});

	it('includes hidden pages', () => {
		expect(ALL_PAGES.find((p) => p.number === '000')).toBeDefined();
		expect(ALL_PAGES.find((p) => p.number === '666')).toBeDefined();
		expect(ALL_PAGES.find((p) => p.number === '911')).toBeDefined();
	});
});

describe('VISIBLE_PAGES', () => {
	it('excludes hidden pages', () => {
		for (const page of VISIBLE_PAGES) {
			expect(page.hidden).toBeFalsy();
		}
	});

	it('is a subset of ALL_PAGES', () => {
		for (const page of VISIBLE_PAGES) {
			expect(ALL_PAGES).toContain(page);
		}
	});
});

describe('TRAINER_PAGES', () => {
	it('has 10 entries (one per player)', () => {
		expect(TRAINER_PAGES).toHaveLength(10);
	});

	it('page numbers are in range 401–411', () => {
		for (const page of TRAINER_PAGES) {
			const num = Number(page.number);
			expect(num).toBeGreaterThanOrEqual(401);
			expect(num).toBeLessThanOrEqual(411);
		}
	});

	it('skips 404 (player 4 does not exist)', () => {
		expect(TRAINER_PAGES.find((p) => p.number === '404')).toBeUndefined();
	});
});

describe('GAME_WEEK_PAGES', () => {
	it('has 18 entries (one per week)', () => {
		expect(GAME_WEEK_PAGES).toHaveLength(18);
	});

	it('page numbers are in range 501–518', () => {
		for (const page of GAME_WEEK_PAGES) {
			const num = Number(page.number);
			expect(num).toBeGreaterThanOrEqual(501);
			expect(num).toBeLessThanOrEqual(518);
		}
	});
});

describe('AWARD_PAGES', () => {
	it('has entries for all awards', () => {
		expect(AWARD_PAGES.length).toBeGreaterThanOrEqual(10);
	});

	it('page numbers are in the 700 range', () => {
		for (const page of AWARD_PAGES) {
			const num = Number(page.number);
			expect(num).toBeGreaterThanOrEqual(701);
			expect(num).toBeLessThanOrEqual(799);
		}
	});
});

describe('findPage', () => {
	it('finds pages by number', () => {
		const page = findPage('100');
		expect(page).toBeDefined();
		expect(page!.label).toBe('HOME');
	});

	it('returns undefined for unknown page numbers', () => {
		expect(findPage('001')).toBeUndefined();
		expect(findPage('999')).toBeUndefined();
	});

	it('finds hidden pages', () => {
		expect(findPage('666')).toBeDefined();
	});
});
