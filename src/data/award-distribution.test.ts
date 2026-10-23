import { describe, it, expect } from "vitest";
import { DISTRIBUTE_AWARDS, SHOW_AWARD_PROGRESS } from "./awards";
import type { Week } from "./matches";
import {
  computeAllAwardRankings,
  computeAllAwardWinners,
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
});
