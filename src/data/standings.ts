import { isPlayedMatch, type Week } from "./matches";
import type { Player } from "./players";
import { PLAYERS } from "./players";

export interface StandingTotals {
  /** Matches played — fixtures with a result. */
  played: number;
  /** Matches won. */
  wins: number;
  /** Individual battles won across all matches. */
  battles: number;
}

export interface Standing extends StandingTotals {
  /** The trainer. */
  player: Player;
  /** Late results, tracked separately and not counted in the official totals. */
  late: StandingTotals;
}

/**
 * Standings for the given weeks: every trainer, ordered by matches won then
 * battles won. `played` counts only matches that have a result, so trainers
 * who missed games show a lower total. Late results are accumulated in `late`
 * and never affect the official totals or ordering.
 */
export function computeStandings(weeks: Week[]): Standing[] {
  const stats = new Map<number, Omit<Standing, "player">>();
  for (const player of PLAYERS) {
    stats.set(player.number, {
      played: 0,
      wins: 0,
      battles: 0,
      late: { played: 0, wins: 0, battles: 0 },
    });
  }

  for (const week of weeks) {
    for (const match of week.matches) {
      if (!isPlayedMatch(match)) continue;

      const a = stats.get(match.p1);
      const b = stats.get(match.p2);
      if (!a || !b) continue;

      const targetA: StandingTotals = match.isLate ? a.late : a;
      const targetB: StandingTotals = match.isLate ? b.late : b;

      targetA.played += 1;
      targetB.played += 1;

      targetA.battles += match.wins1!;
      targetB.battles += match.wins2!;

      if (match.wins1! > match.wins2!) targetA.wins += 1;
      else if (match.wins2! > match.wins1!) targetB.wins += 1;
    }
  }

  return PLAYERS.map((player) => ({
    player,
    ...stats.get(player.number)!,
  })).sort((a, b) => b.wins - a.wins || b.battles - a.battles);
}

/** Official plus late totals, sorted for combined award comparisons. */
export function combineStandings(
  standings: Standing[],
): Array<{ player: Player; played: number; wins: number; battles: number }> {
  return standings
    .map((standing) => ({
      player: standing.player,
      played: standing.played + standing.late.played,
      wins: standing.wins + standing.late.wins,
      battles: standing.battles + standing.late.battles,
    }))
    .sort((a, b) => b.wins - a.wins || b.battles - a.battles);
}
