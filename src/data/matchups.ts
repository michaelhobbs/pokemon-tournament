import { PLAYERS } from './players';

export type TrainerColour = 'cyan' | 'yellow' | 'magenta' | 'red' | 'green' | 'blue' | 'white';

export interface TrainerMatchup {
	/** Ceefax page number, 902–946 */
	number: number;
	player1Number: number;
	player2Number: number;
}

const PALETTE: TrainerColour[] = ['cyan', 'yellow', 'magenta', 'red', 'green', 'blue', 'white'];

function colourFor(playerNumber: number): TrainerColour {
	const index = PLAYERS.findIndex((player) => player.number === playerNumber);
	return PALETTE[((index % PALETTE.length) + PALETTE.length) % PALETTE.length];
}

/** Distinct row colours for the two trainers on a matchup page. */
export function matchupColours(
	player1Number: number,
	player2Number: number,
): [TrainerColour, TrainerColour] {
	const colour1 = colourFor(player1Number);
	let colour2 = colourFor(player2Number);
	if (colour2 === colour1) {
		colour2 = PALETTE[(PALETTE.indexOf(colour1) + 1) % PALETTE.length];
	}
	return [colour1, colour2];
}

const sortedPlayers = [...PLAYERS].sort((a, b) => a.number - b.number);

/** Every trainer-vs-trainer pairing, in player-number order, numbered 902–946. */
export const TRAINER_MATCHUPS: TrainerMatchup[] = (() => {
	const pairings: [number, number][] = [];
	for (let i = 0; i < sortedPlayers.length; i++) {
		for (let j = i + 1; j < sortedPlayers.length; j++) {
			pairings.push([sortedPlayers[i].number, sortedPlayers[j].number]);
		}
	}
	return pairings.map(([player1Number, player2Number], index) => ({
		number: 902 + index,
		player1Number,
		player2Number,
	}));
})();
