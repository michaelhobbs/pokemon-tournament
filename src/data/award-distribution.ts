import type { Match, Week } from "./matches";
import {
  WEEKS,
  FIRST_HALF_WEEKS,
  SECOND_HALF_WEEKS,
  isPlayedMatch,
} from "./matches";
import { combineStandings, computeStandings } from "./standings";
import type { Player } from "./players";
import { PLAYERS } from "./players";
import {
  AWARDS,
  DISTRIBUTE_AWARDS,
  SHOW_AWARD_PROGRESS,
  type Award,
} from "./awards";

export interface AwardRankingEntry {
  playerNumber: number;
  scoreLabel: string;
  lateScoreLabel?: string;
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

type MatchScope = "official" | "late" | "all";

interface AwardStanding {
  player: Player;
  wins: number;
  battles: number;
}

interface CollectedMatch {
  week: number;
  match: Match;
  index: number;
}

function hasPlayedMatch(weeks: Week[], includeLate = false): boolean {
  return weeks.some((week) =>
    week.matches.some(
      (match) => isPlayedMatch(match) && (includeLate || !match.isLate),
    ),
  );
}

function collectMatches(weeks: Week[], scope: MatchScope): CollectedMatch[] {
  const matches: CollectedMatch[] = [];
  for (const week of weeks) {
    week.matches.forEach((match, index) => {
      if (!isPlayedMatch(match)) return;
      if (scope === "official" && match.isLate) return;
      if (scope === "late" && !match.isLate) return;
      matches.push({ week: week.number, match, index });
    });
  }
  return matches;
}

function createStats(): Map<number, AwardStats> {
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
  return stats;
}

function computeMatchStats(
  allMatches: CollectedMatch[],
  top3: number[],
): Map<number, AwardStats> {
  const stats = createStats();
  const currentStreak = new Map<number, number>();
  for (const p of PLAYERS) currentStreak.set(p.number, 0);

  for (const { match } of allMatches) {
    const s1 = stats.get(match.p1);
    const s2 = stats.get(match.p2);
    if (!s1 || !s2) continue;

    if (match.wins1! > match.wins2!) {
      currentStreak.set(match.p1, (currentStreak.get(match.p1) || 0) + 1);
      currentStreak.set(match.p2, 0);
      const streak1 = currentStreak.get(match.p1)!;
      if (streak1 > s1.longestWinStreak) s1.longestWinStreak = streak1;
    } else if (match.wins2! > match.wins1!) {
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

    if (top3.includes(match.p2) && match.wins1! > match.wins2!) {
      s1.beatTop3Set.add(match.p2);
    }
    if (top3.includes(match.p1) && match.wins2! > match.wins1!) {
      s2.beatTop3Set.add(match.p1);
    }
  }

  return stats;
}

function computeWinnersFrom(
  standings: AwardStanding[],
  stats: Map<number, AwardStats>,
  allMatches: CollectedMatch[],
  firstHalfStandings: AwardStanding[],
  secondHalfStandings: AwardStanding[],
): Map<number, number[]> {
  const winners = new Map<number, number[]>();
  if (standings.length === 0) return winners;

  const top3 = standings.slice(0, 3).map((s) => s.player.number);
  const champion = top3[0];
  const last = standings[standings.length - 1].player.number;

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

  const s1Map = new Map(
    firstHalfStandings.map((s) => [s.player.number, { wins: s.wins }]),
  );
  const s2Map = new Map(
    secondHalfStandings.map((s) => [s.player.number, { wins: s.wins }]),
  );
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
    if (match.p2 === champion && match.wins1! > match.wins2!)
      beatChampion.push(match.p1);
    if (match.p1 === champion && match.wins2! > match.wins1!)
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

export function computeAllAwardWinners(
  weeks: Week[] = WEEKS,
  mode: "official" | "combined" = "official",
): Map<number, number[]> {
  const standings = computeStandings(weeks);
  if (standings.length === 0 || !hasPlayedMatch(weeks, mode === "combined")) {
    return new Map();
  }

  const effectiveStandings =
    mode === "combined" ? combineStandings(standings) : standings;
  const top3 = effectiveStandings.slice(0, 3).map((s) => s.player.number);
  const allMatches = collectMatches(
    weeks,
    mode === "combined" ? "all" : "official",
  );
  const stats = computeMatchStats(allMatches, top3);
  const firstHalfStandings =
    mode === "combined"
      ? combineStandings(computeStandings(FIRST_HALF_WEEKS))
      : computeStandings(FIRST_HALF_WEEKS);
  const secondHalfStandings =
    mode === "combined"
      ? combineStandings(computeStandings(SECOND_HALF_WEEKS))
      : computeStandings(SECOND_HALF_WEEKS);

  return computeWinnersFrom(
    effectiveStandings,
    stats,
    allMatches,
    firstHalfStandings,
    secondHalfStandings,
  );
}

export function computeAllAwardRankings(
  weeks: Week[] = WEEKS,
): Map<number, AwardRankingEntry[]> {
  const rankings = new Map<number, AwardRankingEntry[]>();
  const standings = computeStandings(weeks);

  if (standings.length === 0 || !hasPlayedMatch(weeks)) {
    return rankings;
  }

  const top3 = standings.slice(0, 3).map((s) => s.player.number);
  const champion = top3[0];
  const officialMatches = collectMatches(weeks, "official");
  const lateMatches = collectMatches(weeks, "late");
  const stats = computeMatchStats(officialMatches, top3);
  const lateStats = computeMatchStats(lateMatches, top3);
  const combinedStats = computeMatchStats(collectMatches(weeks, "all"), top3);
  const s1h = computeStandings(FIRST_HALF_WEEKS);
  const s2h = computeStandings(SECOND_HALF_WEEKS);
  const lateTotals = new Map(standings.map((s) => [s.player.number, s.late]));
  const lateS1h = new Map(s1h.map((s) => [s.player.number, s.late]));
  const lateS2h = new Map(s2h.map((s) => [s.player.number, s.late]));
  const lateWinsAgainstChampion = new Map<number, number>();
  for (const p of PLAYERS) lateWinsAgainstChampion.set(p.number, 0);
  for (const { match } of lateMatches) {
    if (match.p2 === champion && match.wins1! > match.wins2!) {
      lateWinsAgainstChampion.set(
        match.p1,
        (lateWinsAgainstChampion.get(match.p1) ?? 0) + 1,
      );
    }
    if (match.p1 === champion && match.wins2! > match.wins1!) {
      lateWinsAgainstChampion.set(
        match.p2,
        (lateWinsAgainstChampion.get(match.p2) ?? 0) + 1,
      );
    }
  }
  // 701-704 placement by standings (704 wooden pokeball runs last-to-first)
  for (const awardNum of [701, 702, 703, 704]) {
    const ordered = awardNum === 704 ? [...standings].reverse() : standings;
    rankings.set(
      awardNum,
      ordered.map((s, idx) => ({
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
  // 711 beat champion — ordered by wins against the current first place
  const winsAgainstChampion = new Map<number, number>();
  for (const p of PLAYERS) winsAgainstChampion.set(p.number, 0);
  for (const { match } of officialMatches) {
    if (match.p2 === champion && match.wins1! > match.wins2!) {
      winsAgainstChampion.set(
        match.p1,
        (winsAgainstChampion.get(match.p1) ?? 0) + 1,
      );
    }
    if (match.p1 === champion && match.wins2! > match.wins1!) {
      winsAgainstChampion.set(
        match.p2,
        (winsAgainstChampion.get(match.p2) ?? 0) + 1,
      );
    }
  }
  rankings.set(
    711,
    PLAYERS.map((p) => {
      const wins = winsAgainstChampion.get(p.number) ?? 0;
      return {
        playerNumber: p.number,
        scoreLabel: `${wins}`,
        sortValue: wins,
        count: wins,
      };
    }).sort((a, b) => b.sortValue - a.sortValue),
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
  // 713 iron legend — fewest sweep losses first
  rankings.set(
    713,
    [...statsArr]
      .sort(
        (a, b) =>
          a.sweepLosses - b.sweepLosses || a.playerNumber - b.playerNumber,
      )
      .map((s) => ({
        playerNumber: s.playerNumber,
        scoreLabel: `${s.sweepLosses}`,
        sortValue: -s.sweepLosses,
        count: s.sweepLosses,
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

  for (const [awardNumber, entries] of rankings) {
    for (const entry of entries) {
      const late = lateTotals.get(entry.playerNumber);
      if (!late) continue;

      let lateScoreLabel: string | undefined;
      switch (awardNumber) {
        case 701:
        case 702:
        case 703:
        case 704:
          if (late.wins > 0 || late.battles > 0) {
            lateScoreLabel = `${late.wins}W / ${late.battles}B`;
          }
          break;
        case 705:
          if (late.battles > 0) lateScoreLabel = `${late.battles}B`;
          break;
        case 706: {
          const first = lateS1h.get(entry.playerNumber)?.wins ?? 0;
          const second = lateS2h.get(entry.playerNumber)?.wins ?? 0;
          const improvement = second - first;
          if (improvement !== 0) {
            lateScoreLabel =
              improvement > 0 ? `+${improvement}` : `${improvement}`;
          }
          break;
        }
        case 707: {
          const value = lateStats.get(entry.playerNumber)?.sweepWins ?? 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 708: {
          const value = lateStats.get(entry.playerNumber)?.sweepLosses ?? 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 709: {
          const value =
            lateStats.get(entry.playerNumber)?.heartbreakLosses ?? 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 710: {
          const value = lateStats.get(entry.playerNumber)?.blowouts ?? 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 711: {
          const value = lateWinsAgainstChampion.get(entry.playerNumber) ?? 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 712: {
          const value = lateStats.get(entry.playerNumber)?.clutchWins ?? 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 713: {
          const value = lateStats.get(entry.playerNumber)?.sweepLosses ?? 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 714: {
          const officialSet = stats.get(entry.playerNumber)?.beatTop3Set;
          const lateSet = lateStats.get(entry.playerNumber)?.beatTop3Set;
          const value = lateSet
            ? [...lateSet].filter((number) => !officialSet?.has(number)).length
            : 0;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
        case 715: {
          const official = stats.get(entry.playerNumber)?.longestWinStreak ?? 0;
          const combined =
            combinedStats.get(entry.playerNumber)?.longestWinStreak ?? 0;
          const value = combined - official;
          if (value > 0) lateScoreLabel = `${value}`;
          break;
        }
      }

      if (lateScoreLabel !== undefined) {
        entry.lateScoreLabel = lateScoreLabel;
      }
    }
  }

  return rankings;
}

export function getAwardRankings(
  baseAwards: Award[] = AWARDS,
): Map<number, AwardRankingEntry[]> {
  if (!SHOW_AWARD_PROGRESS && !DISTRIBUTE_AWARDS) {
    return new Map();
  }
  return computeAllAwardRankings();
}

/** Current leaders per award, used to show progress before winners are handed out. */
export function getAwardProgressLeaders(): Map<number, number[]> {
  if (!SHOW_AWARD_PROGRESS && !DISTRIBUTE_AWARDS) {
    return new Map();
  }
  return computeAllAwardWinners();
}

/** Awards whose winner would change if late results were counted. */
export function getAwardLateAlternates(
  weeks: Week[] = WEEKS,
): Map<number, number[]> {
  if (!SHOW_AWARD_PROGRESS && !DISTRIBUTE_AWARDS) {
    return new Map();
  }
  const official = computeAllAwardWinners(weeks, "official");
  const combined = computeAllAwardWinners(weeks, "combined");
  const alternates = new Map<number, number[]>();
  for (const [awardNumber, officialWinners] of official) {
    const combinedWinners = combined.get(awardNumber) ?? [];
    const officialSet = new Set(officialWinners);
    const same =
      officialWinners.length === combinedWinners.length &&
      combinedWinners.every((winner) => officialSet.has(winner));
    if (!same) alternates.set(awardNumber, combinedWinners);
  }
  return alternates;
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
