import type { Match, Week } from "./matches";
import type { Player } from "./players";
import { PLAYERS } from "./players";

export interface Standing {
  /** The trainer. */
  player: Player;
  /** Matches played — fixtures with a result. */
  played: number;
  /** Matches won. */
  wins: number;
  /** Individual battles won across all matches. */
  battles: number;
}

/** A match counts as played once both sides have a score. */
function isPlayed(match: Match): boolean {
  return match.wins1 !== undefined && match.wins2 !== undefined;
}

/**
 * Standings for the given weeks: every trainer, ordered by matches won then
 * battles won. `played` counts only matches that have a result, so trainers
 * who missed games show a lower total.
 */
export function computeStandings(weeks: Week[]): Standing[] {
  const stats = new Map<number, Omit<Standing, "player">>();
  for (const player of PLAYERS) {
    stats.set(player.number, { played: 0, wins: 0, battles: 0 });
  }

  for (const week of weeks) {
    for (const match of week.matches) {
      const a = stats.get(match.p1);
      const b = stats.get(match.p2);
      if (!a || !b) continue;

      if (isPlayed(match)) {
        a.played += 1;
        b.played += 1;
      }

      a.battles += match.wins1 ?? 0;
      b.battles += match.wins2 ?? 0;

      if ((match.wins1 ?? 0) > (match.wins2 ?? 0)) a.wins += 1;
      else if ((match.wins2 ?? 0) > (match.wins1 ?? 0)) b.wins += 1;
    }
  }

  return PLAYERS.map((player) => ({
    player,
    ...stats.get(player.number)!,
  })).sort((a, b) => b.wins - a.wins || b.battles - a.battles);
}
