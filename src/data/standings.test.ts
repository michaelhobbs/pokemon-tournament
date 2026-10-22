import { describe, it, expect } from "vitest";
import { computeStandings } from "./standings";
import {
  FIRST_HALF_WEEKS,
  SECOND_HALF_WEEKS,
  WEEKS,
  type Week,
} from "./matches";
import { PLAYERS } from "./players";

const byNumber = (weeks: Week[]) =>
  new Map(computeStandings(weeks).map((row) => [row.player.number, row]));

describe("computeStandings", () => {
  it("returns a row for every trainer", () => {
    const rows = computeStandings(WEEKS);
    expect(rows).toHaveLength(PLAYERS.length);
    expect(rows.map((row) => row.player.number).sort()).toEqual(
      PLAYERS.map((player) => player.number).sort(),
    );
  });

  it("counts only matches with a result as played", () => {
    const weeks: Week[] = [
      {
        number: 1,
        date: "TEST",
        matches: [
          { p1: 1, p2: 2, wins1: 2, wins2: 1 },
          { p1: 3, p2: 5 },
        ],
      },
    ];
    const rows = byNumber(weeks);

    expect(rows.get(1)!.played).toBe(1);
    expect(rows.get(1)!.wins).toBe(1);
    expect(rows.get(1)!.battles).toBe(2);

    expect(rows.get(2)!.played).toBe(1);
    expect(rows.get(2)!.wins).toBe(0);
    expect(rows.get(2)!.battles).toBe(1);

    expect(rows.get(3)!.played).toBe(0);
    expect(rows.get(3)!.wins).toBe(0);
    expect(rows.get(3)!.battles).toBe(0);
  });

  it("every trainer played every first-half week", () => {
    for (const row of computeStandings(FIRST_HALF_WEEKS)) {
      expect(row.played).toBe(FIRST_HALF_WEEKS.length);
    }
  });

  it("counts games played in the second half", () => {
    for (const row of computeStandings(SECOND_HALF_WEEKS)) {
      expect(row.played).toBeLessThanOrEqual(SECOND_HALF_WEEKS.length);
      expect(row.wins).toBeLessThanOrEqual(row.played);
    }
  });

  it("trainers who missed games have played fewer", () => {
    const played = computeStandings(SECOND_HALF_WEEKS).map((row) => row.played);
    expect(Math.max(...played)).toBeGreaterThan(Math.min(...played));
  });

  it("orders by wins then battles won", () => {
    const rows = computeStandings(WEEKS);
    for (let i = 1; i < rows.length; i++) {
      const previous = rows[i - 1];
      const current = rows[i];
      expect(previous.wins).toBeGreaterThanOrEqual(current.wins);
      if (previous.wins === current.wins) {
        expect(previous.battles).toBeGreaterThanOrEqual(current.battles);
      }
    }
  });
});
