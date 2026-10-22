import type { Match, Week } from "./matches";
import { WEEKS, FIRST_HALF_WEEKS, SECOND_HALF_WEEKS } from "./matches";
import { computeStandings } from "./standings";
import { PLAYERS } from "./players";
import { AWARDS, DISTRIBUTE_AWARDS, type Award } from "./awards";

export interface AwardRankingEntry {
  playerNumber: number;
  scoreLabel: string;
  sortValue: number;
  wins?: number;
  battles?: number;
  improvement?: number;
  count?: number;
}

interface AwardStats {
  playerNumber: number;
  sweepWins: number;
  clutchWins: number;
  sweepLosses: number;
  heartbreakLosses: number;
  blowouts: number;
  beatTop3Set: Set<number>;
  longestWinStreak: number;
}

export function computeAllAwardWinners(
  weeks: Week[] = WEEKS,
): Map<number, number[]> {
  const winners = new Map<number, number[]>();
  const standings = computeStandings(weeks);

  if (standings.length === 0) {
    return winners;
  }

  const top3 = standings.slice(0, 3).map((s) => s.player.number);
  const champion = top3[0];
  const last = standings[standings.length - 1].player.number;

  const stats = new Map<number, AwardStats>();
  for (const p of PLAYERS) {
    stats.set(p.number, {
      playerNumber: p.number,
      sweepWins: 0,
      clutchWins: 0,
      sweepLosses: 0,
      heartbreakLosses: 0,
      blowouts: 0,
      beatTop3Set: new Set<number>(),
      longestWinStreak: 0,
    });
  }

  const allMatches: Array<{ week: number; match: Match; index: number }> = [];
  for (const week of weeks) {
    week.matches.forEach((m, i) =>
      allMatches.push({ week: week.number, match: m, index: i }),
    );
  }

  const currentStreak = new Map<number, number>();
  for (const p of PLAYERS) currentStreak.set(p.number, 0);

  for (const { match } of allMatches) {
    if (match.wins1 === undefined || match.wins2 === undefined) continue;
    const s1 = stats.get(match.p1);
    const s2 = stats.get(match.p2);
    if (!s1 || !s2) continue;

    if (match.wins1 > match.wins2) {
      currentStreak.set(match.p1, (currentStreak.get(match.p1) || 0) + 1);
      currentStreak.set(match.p2, 0);
      const streak1 = currentStreak.get(match.p1)!;
      if (streak1 > s1.longestWinStreak) s1.longestWinStreak = streak1;
    } else if (match.wins2 > match.wins1) {
      currentStreak.set(match.p2, (currentStreak.get(match.p2) || 0) + 1);
      currentStreak.set(match.p1, 0);
      const streak2 = currentStreak.get(match.p2)!;
      if (streak2 > s2.longestWinStreak) s2.longestWinStreak = streak2;
    } else {
      currentStreak.set(match.p1, 0);
      currentStreak.set(match.p2, 0);
    }

    if (match.wins1 === 3 && match.wins2 === 0) {
      s1.sweepWins++;
      s2.sweepLosses++;
      s1.blowouts++;
      s2.blowouts++;
    } else if (match.wins2 === 3 && match.wins1 === 0) {
      s2.sweepWins++;
      s1.sweepLosses++;
      s1.blowouts++;
      s2.blowouts++;
    } else if (match.wins1 === 3 || match.wins2 === 3) {
      if (match.wins1 === 3) s1.blowouts++;
      else s2.blowouts++;
    } else if (match.wins1 === 0 || match.wins2 === 0) {
      if (match.wins1 === 0) s2.blowouts++;
      else s1.blowouts++;
    }

    if (match.wins1 === 2 && match.wins2 === 1) {
      s1.clutchWins++;
      s2.heartbreakLosses++;
    }
    if (match.wins2 === 2 && match.wins1 === 1) {
      s2.clutchWins++;
      s1.heartbreakLosses++;
    }

    if (top3.includes(match.p2) && match.wins1 > match.wins2) {
      s1.beatTop3Set.add(match.p2);
    }
    if (top3.includes(match.p1) && match.wins2 > match.wins1) {
      s2.beatTop3Set.add(match.p1);
    }
  }

  winners.set(701, [champion]);
  winners.set(702, [standings[1].player.number]);
  winners.set(703, [standings[2].player.number]);
  winners.set(704, [last]);

  const maxBattles = Math.max(...standings.map((s) => s.battles));
  winners.set(
    705,
    standings
      .filter((s) => s.battles === maxBattles)
      .map((s) => s.player.number),
  );

  const s1h = computeStandings(FIRST_HALF_WEEKS);
  const s2h = computeStandings(SECOND_HALF_WEEKS);
  const s1Map = new Map(s1h.map((s) => [s.player.number, { wins: s.wins }]));
  const s2Map = new Map(s2h.map((s) => [s.player.number, { wins: s.wins }]));
  let bestImprover = -Infinity;
  let secondWindWinners: number[] = [];
  for (const p of PLAYERS) {
    const a = s1Map.get(p.number);
    const b = s2Map.get(p.number);
    if (!a || !b) continue;
    const improvement = b.wins - a.wins;
    if (improvement > bestImprover) {
      bestImprover = improvement;
      secondWindWinners = [p.number];
    } else if (improvement === bestImprover && bestImprover !== -Infinity) {
      secondWindWinners.push(p.number);
    }
  }
  if (secondWindWinners.length === 0 && standings.length > 0) {
    secondWindWinners = [standings[0].player.number];
  }
  winners.set(706, secondWindWinners);

  const statsArr = Array.from(stats.values());
  const maxSweepW = Math.max(...statsArr.map((s) => s.sweepWins));
  winners.set(
    707,
    statsArr
      .filter((s) => s.sweepWins === maxSweepW)
      .map((s) => s.playerNumber),
  );

  const maxSweepL = Math.max(...statsArr.map((s) => s.sweepLosses));
  winners.set(
    708,
    statsArr
      .filter((s) => s.sweepLosses === maxSweepL)
      .map((s) => s.playerNumber),
  );

  const maxCloseL = Math.max(...statsArr.map((s) => s.heartbreakLosses));
  winners.set(
    709,
    statsArr
      .filter((s) => s.heartbreakLosses === maxCloseL)
      .map((s) => s.playerNumber),
  );

  const minBlowouts = Math.min(...statsArr.map((s) => s.blowouts));
  winners.set(
    710,
    statsArr
      .filter((s) => s.blowouts === minBlowouts)
      .map((s) => s.playerNumber),
  );

  const beatChampion: number[] = [];
  for (const { match } of allMatches) {
    if (match.wins1 === undefined || match.wins2 === undefined) continue;
    if (match.p2 === champion && match.wins1 > match.wins2)
      beatChampion.push(match.p1);
    if (match.p1 === champion && match.wins2 > match.wins1)
      beatChampion.push(match.p2);
  }
  winners.set(711, [...new Set(beatChampion)]);

  const maxClutch = Math.max(...statsArr.map((s) => s.clutchWins));
  winners.set(
    712,
    statsArr
      .filter((s) => s.clutchWins === maxClutch)
      .map((s) => s.playerNumber),
  );

  const ironLegend = statsArr
    .filter((s) => s.sweepLosses === 0)
    .map((s) => s.playerNumber);
  winners.set(713, ironLegend);

  const maxBeatTop3 = Math.max(...statsArr.map((s) => s.beatTop3Set.size));
  winners.set(
    714,
    statsArr
      .filter((s) => s.beatTop3Set.size === maxBeatTop3 && maxBeatTop3 > 0)
      .map((s) => s.playerNumber),
  );

  const maxStreak = Math.max(...statsArr.map((s) => s.longestWinStreak));
  winners.set(
    715,
    statsArr
      .filter((s) => s.longestWinStreak === maxStreak && maxStreak > 0)
      .map((s) => s.playerNumber),
  );

  return winners;
}

export function computeAllAwardRankings(
  weeks: Week[] = WEEKS,
): Map<number, AwardRankingEntry[]> {
  const rankings = new Map<number, AwardRankingEntry[]>();
  const standings = computeStandings(weeks);

  if (standings.length === 0) {
    return rankings;
  }

  const top3 = standings.slice(0, 3).map((s) => s.player.number);
  const champion = top3[0];

  const stats = new Map<number, AwardStats>();
  for (const p of PLAYERS) {
    stats.set(p.number, {
      playerNumber: p.number,
      sweepWins: 0,
      clutchWins: 0,
      sweepLosses: 0,
      heartbreakLosses: 0,
      blowouts: 0,
      beatTop3Set: new Set<number>(),
      longestWinStreak: 0,
    });
  }

  const allMatches: Array<{ week: number; match: Match; index: number }> = [];
  for (const week of weeks) {
    week.matches.forEach((m, i) =>
      allMatches.push({ week: week.number, match: m, index: i }),
    );
  }

  const currentStreak = new Map<number, number>();
  for (const p of PLAYERS) currentStreak.set(p.number, 0);

  for (const { match } of allMatches) {
    if (match.wins1 === undefined || match.wins2 === undefined) continue;
    const s1 = stats.get(match.p1);
    const s2 = stats.get(match.p2);
    if (!s1 || !s2) continue;

    if (match.wins1 > match.wins2) {
      currentStreak.set(match.p1, (currentStreak.get(match.p1) || 0) + 1);
      currentStreak.set(match.p2, 0);
      const streak1 = currentStreak.get(match.p1)!;
      if (streak1 > s1.longestWinStreak) s1.longestWinStreak = streak1;
    } else if (match.wins2 > match.wins1) {
      currentStreak.set(match.p2, (currentStreak.get(match.p2) || 0) + 1);
      currentStreak.set(match.p1, 0);
      const streak2 = currentStreak.get(match.p2)!;
      if (streak2 > s2.longestWinStreak) s2.longestWinStreak = streak2;
    } else {
      currentStreak.set(match.p1, 0);
      currentStreak.set(match.p2, 0);
    }

    if (match.wins1 === 3 && match.wins2 === 0) {
      s1.sweepWins++;
      s2.sweepLosses++;
      s1.blowouts++;
      s2.blowouts++;
    } else if (match.wins2 === 3 && match.wins1 === 0) {
      s2.sweepWins++;
      s1.sweepLosses++;
      s1.blowouts++;
      s2.blowouts++;
    } else if (match.wins1 === 3 || match.wins2 === 3) {
      if (match.wins1 === 3) s1.blowouts++;
      else s2.blowouts++;
    } else if (match.wins1 === 0 || match.wins2 === 0) {
      if (match.wins1 === 0) s2.blowouts++;
      else s1.blowouts++;
    }

    if (match.wins1 === 2 && match.wins2 === 1) {
      s1.clutchWins++;
      s2.heartbreakLosses++;
    }
    if (match.wins2 === 2 && match.wins1 === 1) {
      s2.clutchWins++;
      s1.heartbreakLosses++;
    }

    if (top3.includes(match.p2) && match.wins1 > match.wins2) {
      s1.beatTop3Set.add(match.p2);
    }
    if (top3.includes(match.p1) && match.wins2 > match.wins1) {
      s2.beatTop3Set.add(match.p1);
    }
  }

  const standingsMap = new Map(standings.map((s) => [s.player.number, s]));
  // 701-704 placement by standings
  for (const awardNum of [701, 702, 703, 704]) {
    rankings.set(
      awardNum,
      standings.map((s, idx) => ({
        playerNumber: s.player.number,
        scoreLabel: `${s.wins}W / ${s.battles}B`,
        sortValue: -(s.wins * 100000 + s.battles + idx * 0.0001),
        wins: s.wins,
        battles: s.battles,
      })),
    );
  }

  // 705 most battles won
  const battlesSorted = [...standings].sort(
    (a, b) => b.battles - a.battles || b.wins - a.wins,
  );
  rankings.set(
    705,
    battlesSorted.map((s, idx) => ({
      playerNumber: s.player.number,
      scoreLabel: `${s.battles}B`,
      sortValue: -(s.battles * 100000 + s.wins + idx * 0.0001),
      battles: s.battles,
      wins: s.wins,
    })),
  );

  // 706 improvement
  const s1h = computeStandings(FIRST_HALF_WEEKS);
  const s2h = computeStandings(SECOND_HALF_WEEKS);
  const s1Map = new Map(s1h.map((s) => [s.player.number, s.wins]));
  const s2Map = new Map(s2h.map((s) => [s.player.number, s.wins]));
  const improvementList = PLAYERS.map((p) => {
    const a = s1Map.get(p.number);
    const b = s2Map.get(p.number);
    if (a === undefined || b === undefined)
      return { p: p.number, imp: -Infinity };
    return { p: p.number, imp: b - a };
  }).sort((a, b) => b.imp - a.imp);
  rankings.set(
    706,
    improvementList.map((x, idx) => ({
      playerNumber: x.p,
      scoreLabel: x.imp >= 0 ? `+${x.imp}` : `${x.imp}`,
      sortValue: -(x.imp * 1000 + idx * 0.0001),
      improvement: x.imp,
    })),
  );

  const statsArr = Array.from(stats.values());

  // 707 sweep wins
  rankings.set(
    707,
    [...statsArr]
      .sort((a, b) => b.sweepWins - a.sweepWins)
      .map((s, idx) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.sweepWins}`,
        sortValue: -(s.sweepWins * 1000 + idx * 0.0001),
        count: s.sweepWins,
      })),
  );
  // 708 sweep losses
  rankings.set(
    708,
    [...statsArr]
      .sort((a, b) => b.sweepLosses - a.sweepLosses)
      .map((s, idx) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.sweepLosses}`,
        sortValue: -(s.sweepLosses * 1000 + idx * 0.0001),
        count: s.sweepLosses,
      })),
  );
  // 709 heartbreak losses
  rankings.set(
    709,
    [...statsArr]
      .sort((a, b) => b.heartbreakLosses - a.heartbreakLosses)
      .map((s, idx) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.heartbreakLosses}`,
        sortValue: -(s.heartbreakLosses * 1000 + idx * 0.0001),
        count: s.heartbreakLosses,
      })),
  );
  // 710 fewest blowouts
  rankings.set(
    710,
    [...statsArr]
      .sort((a, b) => a.blowouts - b.blowouts)
      .map((s, idx) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.blowouts}`,
        sortValue: s.blowouts * 1000 + idx * 0.0001,
        count: s.blowouts,
      })),
  );
  // 711 beat champion
  const beatChampionSet = new Set<number>();
  for (const { match } of allMatches) {
    if (match.wins1 === undefined || match.wins2 === undefined) continue;
    if (match.p2 === champion && match.wins1 > match.wins2)
      beatChampionSet.add(match.p1);
    if (match.p1 === champion && match.wins2 > match.wins1)
      beatChampionSet.add(match.p2);
  }
  rankings.set(
    711,
    PLAYERS.map((p) => ({
      playerNumber: p.number,
      scoreLabel: beatChampionSet.has(p.number) ? "1" : "0",
      sortValue: beatChampionSet.has(p.number) ? -1 : 0,
      count: beatChampionSet.has(p.number) ? 1 : 0,
    })).sort((a, b) => b.sortValue - a.sortValue),
  );
  // 712 clutch wins
  rankings.set(
    712,
    [...statsArr]
      .sort((a, b) => b.clutchWins - a.clutchWins)
      .map((s, idx) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.clutchWins}`,
        sortValue: -(s.clutchWins * 1000 + idx * 0.0001),
        count: s.clutchWins,
      })),
  );
  // 713 iron legend
  rankings.set(
    713,
    [...statsArr]
      .sort(
        (a, b) =>
          (a.sweepLosses === 0 ? -1 : 1) - (b.sweepLosses === 0 ? -1 : 1) ||
          a.playerNumber - b.playerNumber,
      )
      .map((s) => ({
        playerNumber: s.playerNumber,
        scoreLabel: s.sweepLosses === 0 ? "0" : `${s.sweepLosses}`,
        sortValue: s.sweepLosses === 0 ? -1 : 0,
        count: s.sweepLosses === 0 ? 0 : s.sweepLosses,
      })),
  );
  // 714 beat top3
  rankings.set(
    714,
    [...statsArr]
      .sort((a, b) => b.beatTop3Set.size - a.beatTop3Set.size)
      .map((s, idx) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.beatTop3Set.size}`,
        sortValue: -(s.beatTop3Set.size * 1000 + idx * 0.0001),
        count: s.beatTop3Set.size,
      })),
  );
  // 715 win streak
  rankings.set(
    715,
    [...statsArr]
      .sort((a, b) => b.longestWinStreak - a.longestWinStreak)
      .map((s, idx) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.longestWinStreak}`,
        sortValue: -(s.longestWinStreak * 1000 + idx * 0.0001),
        count: s.longestWinStreak,
      })),
  );

  return rankings;
}

export function getAwardRankings(
  baseAwards: Award[] = AWARDS,
): Map<number, AwardRankingEntry[]> {
  if (!DISTRIBUTE_AWARDS) {
    return new Map();
  }
  return computeAllAwardRankings();
}

export function getDistributedAwards(baseAwards: Award[] = AWARDS): Award[] {
  if (!DISTRIBUTE_AWARDS) {
    return baseAwards.map((a) => ({ ...a, winners: undefined }));
  }
  const computed = computeAllAwardWinners();
  return baseAwards.map((award) => {
    const computedWinners = computed.get(award.number);
    const manualWinners = award.winners;
    if (manualWinners && manualWinners.length > 0) {
      return { ...award, winners: manualWinners };
    }
    return { ...award, winners: computedWinners || [] };
  });
}
