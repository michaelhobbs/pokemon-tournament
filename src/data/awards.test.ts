import { describe, it, expect } from 'vitest';
import { AWARDS, awardFor, awardDisplayName, awardDisplayDescription, awardDisplaySprite, SURPRISE_NAME, SURPRISE_DESCRIPTION, SURPRISE_SPRITE } from './awards';

describe('AWARDS', () => {
	it('has at least 10 awards', () => {
		expect(AWARDS.length).toBeGreaterThanOrEqual(10);
	});

	it('award numbers are sequential from 701', () => {
		for (let i = 0; i < AWARDS.length; i++) {
			expect(AWARDS[i].number).toBe(701 + i);
		}
	});

	it('every award has a name and description', () => {
		for (const award of AWARDS) {
			expect(award.name.length).toBeGreaterThan(0);
			expect(award.description.length).toBeGreaterThan(0);
		}
	});

	it('every award sprite has 16 rows of 16 chars', () => {
		for (const award of AWARDS) {
			expect(award.sprite.map).toHaveLength(16);
			for (const row of award.sprite.map) {
				expect(row).toHaveLength(16);
			}
		}
	});

	it('some awards are hidden', () => {
		const hidden = AWARDS.filter((a) => a.hidden);
		expect(hidden.length).toBeGreaterThan(0);
	});
});

describe('awardFor', () => {
	it('finds an award by number', () => {
		const award = awardFor(701);
		expect(award).toBeDefined();
		expect(award!.name).toBe('CHAMPION');
	});

	it('returns undefined for unknown numbers', () => {
		expect(awardFor(600)).toBeUndefined();
		expect(awardFor(999)).toBeUndefined();
	});
});

describe('awardDisplayName', () => {
	it('returns the real name for visible awards', () => {
		const award = awardFor(701)!;
		expect(awardDisplayName(award)).toBe('CHAMPION');
	});

	it('returns SURPRISE for hidden awards', () => {
		const hidden = AWARDS.find((a) => a.hidden)!;
		expect(awardDisplayName(hidden)).toBe(SURPRISE_NAME);
	});
});

describe('awardDisplayDescription', () => {
	it('returns the real description for visible awards', () => {
		const award = awardFor(701)!;
		expect(awardDisplayDescription(award)).toBe('FIRST PLACE');
	});

	it('returns surprise description for hidden awards', () => {
		const hidden = AWARDS.find((a) => a.hidden)!;
		expect(awardDisplayDescription(hidden)).toBe(SURPRISE_DESCRIPTION);
	});
});

describe('awardDisplaySprite', () => {
	it('returns the real sprite for visible awards', () => {
		const award = awardFor(701)!;
		expect(awardDisplaySprite(award)).toBe(award.sprite);
	});

	it('returns SURPRISE_SPRITE for hidden awards', () => {
		const hidden = AWARDS.find((a) => a.hidden)!;
		expect(awardDisplaySprite(hidden)).toBe(SURPRISE_SPRITE);
	});
});
