import { describe, it, expect } from "vitest";
import { AWARDS, DISTRIBUTE_AWARDS, SHOW_AWARD_PROGRESS } from "./awards";
import type { Week } from "./matches";
import {
  computeAllAwardRankings,
  computeAllAwardWinners,
  getAwardLateAlternates,
  getAwardLateWinners,
  getLateOnlyAwardsForPlayer,
  getAwardProgressLeaders,
  getAwardRankings,
  getDistributedAwards,
} from "./award-distribution";

describe("award progress", () => {
  it("exposes rankings without distributing winners", () => {
    const rankings = getAwardRankings();

    if (SHOW_AWARD_PROGRESS || DISTRIBUTE_AWARDS) {
      expect(rankings.get(701)?.length).toBeGreaterThan(0);
    } else {
      expect(rankings.size).toBe(0);
    }

    if (!DISTRIBUTE_AWARDS) {
      for (const award of getDistributedAwards()) {
        expect(award.winners).toBeUndefined();
      }
    }
  });

  it("reports current leaders that appear in the rankings", () => {
    const rankings = getAwardRankings();
    const leaders = getAwardProgressLeaders();

    if (!SHOW_AWARD_PROGRESS && !DISTRIBUTE_AWARDS) {
      expect(rankings.size).toBe(0);
      expect(leaders.size).toBe(0);
      return;
    }

    expect(leaders.size).toBeGreaterThan(0);
    for (const [awardNumber, playerNumbers] of leaders) {
      const ranking = rankings.get(awardNumber);
      expect(ranking).toBeDefined();
      for (const playerNumber of playerNumbers) {
        expect(
          ranking!.some((entry) => entry.playerNumber === playerNumber),
        ).toBe(true);
      }
    }
  });

  it("returns no rankings or leaders for empty weeks", () => {
    expect(computeAllAwardRankings([]).size).toBe(0);
    expect(computeAllAwardWinners([]).size).toBe(0);
  });

  it("only counts played matches", () => {
    const weeks: Week[] = [
      {
        number: 1,
        date: "W/C TEST",
        matches: [
          { p1: 1, p2: 2, wins1: 2, wins2: 1 },
          { p1: 3, p2: 4 },
        ],
      },
    ];

    const rankings = computeAllAwardRankings(weeks);
    const player1 = rankings
      .get(701)
      ?.find((entry) => entry.playerNumber === 1);

    expect(player1?.wins).toBe(1);
    expect(player1?.battles).toBe(2);

    const battles = rankings
      .get(705)
      ?.find((entry) => entry.playerNumber === 3);
    expect(battles?.battles).toBe(0);
  });

  it("keeps official award order and reports the late split", () => {
    const weeks: Week[] = [
      {
        number: 1,
        date: "W/C TEST",
        matches: [
          { p1: 1, p2: 2, wins1: 1, wins2: 2 },
          { p1: 3, p2: 5, wins1: 2, wins2: 1, isLate: true },
        ],
      },
    ];

    const rankings = computeAllAwardRankings(weeks);
    const champion = rankings.get(701);
    expect(champion?.[0].playerNumber).toBe(2);

    const lateWinner = champion?.find((entry) => entry.playerNumber === 3);
    expect(lateWinner?.lateScoreLabel).toBe("1W / 2B");
  });

  it("reports late-game winners alongside official winners", () => {
    const official = computeAllAwardWinners();
    const late = getAwardLateWinners();

    if (SHOW_AWARD_PROGRESS || DISTRIBUTE_AWARDS) {
      expect(late.get(701)).toEqual(official.get(701));
      expect(late.get(702)).not.toEqual(official.get(702));
      expect(late.get(716)).toEqual([1]);
      expect(late.get(717)).toEqual([9]);
      expect(late.get(718)).toEqual([5]);
    } else {
      expect(late.size).toBe(0);
    }
  });

  it("lets manual late winners take precedence over official ones", () => {
    if (!SHOW_AWARD_PROGRESS && !DISTRIBUTE_AWARDS) return;
    const baseAwards = AWARDS.map((award) =>
      award.number === 701 ? { ...award, lateWinners: [5] } : award,
    );
    expect(getAwardLateWinners(baseAwards).get(701)).toEqual([5]);
  });

  it("lists awards won only when late games count", () => {
    const numbers = getLateOnlyAwardsForPlayer(1).map((award) => award.number);
    expect(numbers).toContain(702);
    expect(numbers).toContain(706);
    expect(numbers).toContain(712);
    expect(numbers).not.toContain(701);
  });

  it("names an alternate winner when late results would change the award", () => {
    const weeks: Week[] = [
      {
        number: 1,
        date: "W/C TEST",
        matches: [
          { p1: 1, p2: 2, wins1: 1, wins2: 2 },
          { p1: 1, p2: 3, wins1: 0, wins2: 3, isLate: true },
          { p1: 1, p2: 5, wins1: 0, wins2: 3, isLate: true },
        ],
      },
    ];

    const alternates = getAwardLateAlternates(weeks);
    expect(alternates.get(701)).toBeDefined();
    expect(alternates.get(701)).not.toContain(2);
  });
});
