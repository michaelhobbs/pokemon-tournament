export interface TrainerSprite {
	/** Rows of pixel chars, each row the same length (16). `.` = transparent. */
	map: string[];
	/** Maps a pixel char to a CSS color. */
	palette: Record<string, string>;
}

const BASE_HAT: string[] = [
	'................',
	'.......BB.......',
	'.....BBBBBB.....',
	'....BBHHHHBB....',
	'...BBHHHHHHBB...',
	'...BKKKKKKKKB...',
	'...BKBBKKBBKB...',
	'...BKKKKKKKKB...',
	'...BKKKBBKKKB...',
	'..BOOOOOOOOOOB..',
	'.BOOOOOOOOOOOOB.',
	'.BOOOOOOOOOOOOB.',
	'.BBBBBBBBBBBBBB.',
	'...BBB...BBB....',
	'...BBB...BBB....',
	'..BBBBB.BBBBB...',
];

const BASE_HAIR: string[] = [
	'................',
	'....BBBBBB......',
	'...BHHHHHHB.....',
	'..BHHHHHHHHB....',
	'..BHHHHHHHHB....',
	'..BKKKKKKKKB....',
	'..BKBBKKBBKB....',
	'..BKKKKKKKKB....',
	'..BKKKBBKKKB....',
	'..BOOOOOOOOB....',
	'.BOOOOOOOOOOB...',
	'.BOOOOOOOOOOB...',
	'.BBBBBBBBBBBB...',
	'..BBB...BBB.....',
	'..BBB...BBB.....',
	'.BBBBB.BBBBB....',
];

const BASE_LONG: string[] = [
	'................',
	'....BBBBBB......',
	'...BHHHHHHB.....',
	'..BHHHHHHHHB....',
	'..BHHHHHHHHB....',
	'..BKKKKKKKKB....',
	'..BKBBKKBBKB....',
	'..BKKKKKKKKB....',
	'..BKKKBBKKKB....',
	'..BHHHHHHHHB....',
	'.BOOOOOOOOOOB...',
	'.BOOOOOOOOOOB...',
	'.BOOOOOOOOOOB...',
	'.BBBBBBBBBBBB...',
	'..BBB...BBB.....',
	'.BBBBB.BBBBB....',
];

const BASE_FEMALE: string[] = [
	'................',
	'....BBBBBB......',
	'...BHHHHHHB.....',
	'..BHHHHHHHHB....',
	'..BHHHHHHHHB....',
	'..BKKKKKKKKB....',
	'..BKBBKKBBKB....',
	'..BKKKKKKKKB....',
	'..BKKKBBKKKB....',
	'..BHHHHHHHHB....',
	'.BHHHHHHHHHHB...',
	'.BHOOOOOOOOOB...',
	'.BHOOOOOOOOOB...',
	'.BHHHHHHHHHHB...',
	'..BBBBBBBBBB....',
	'..BBBBB.BBBBB...',
];

const BASE_BEARD: string[] = [
	'................',
	'.......BB.......',
	'.....BBBBBB.....',
	'....BBHHHHBB....',
	'...BBHHHHHHBB...',
	'...BKKKKKKKKB...',
	'...BKBBKKBBKB...',
	'...BKKKKKKKKB...',
	'...BKKKBBKKKB...',
	'...BKKKKKKKKB...',
	'...BHHHHHHHHB...',
	'..BOOOOOOOOOOB..',
	'.BOOOOOOOOOOOOB.',
	'.BBBBBBBBBBBBBB.',
	'...BBB...BBB....',
	'..BBBBB.BBBBB...',
];

function makePalette(hair: string, outfit: string): Record<string, string> {
	return {
		B: 'var(--ceefax-black)',
		H: hair,
		K: 'var(--ceefax-yellow)',
		O: outfit,
	};
}

interface SpriteSpec {
	map: string[];
	hair: string;
	outfit: string;
}

const SPRITE_SPECS: Record<number, SpriteSpec> = {
	1: { map: BASE_HAT, hair: 'var(--ceefax-black)', outfit: 'var(--ceefax-magenta)' },
	2: { map: BASE_LONG, hair: 'var(--ceefax-cyan)', outfit: 'var(--ceefax-white)' },
	3: { map: BASE_HAIR, hair: 'var(--ceefax-magenta)', outfit: 'var(--ceefax-yellow)' },
	4: { map: BASE_HAT, hair: 'var(--ceefax-yellow)', outfit: 'var(--ceefax-green)' },
	5: { map: BASE_BEARD, hair: 'var(--ceefax-blue)', outfit: 'var(--ceefax-red)' },
	6: { map: BASE_HAIR, hair: 'var(--ceefax-magenta)', outfit: 'var(--ceefax-red)' },
	7: { map: BASE_HAIR, hair: 'var(--ceefax-blue)', outfit: 'var(--ceefax-green)' },
	8: { map: BASE_HAIR, hair: 'var(--ceefax-cyan)', outfit: 'var(--ceefax-magenta)' },
	9: { map: BASE_LONG, hair: 'var(--ceefax-cyan)', outfit: 'var(--ceefax-red)' },
	10: { map: BASE_FEMALE, hair: 'var(--ceefax-magenta)', outfit: 'var(--ceefax-blue)' },
};

export const TRAINER_SPRITES: Record<number, TrainerSprite> = Object.fromEntries(
	Object.entries(SPRITE_SPECS).map(([number, spec]) => [
		Number(number),
		{ map: spec.map, palette: makePalette(spec.hair, spec.outfit) },
	]),
);

export function spriteFor(number: number): TrainerSprite {
	const sprite = TRAINER_SPRITES[number];
	if (!sprite) throw new Error(`No sprite for player ${number}`);
	return sprite;
}
