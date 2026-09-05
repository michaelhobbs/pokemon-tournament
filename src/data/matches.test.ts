import { describe, it, expect } from "vitest";
import {
  WEEKS,
  FIRST_HALF_LAST_WEEK,
  FIRST_HALF_WEEKS,
  SECOND_HALF_WEEKS,
  weekFor,
} from "./matches";

describe("WEEKS", () => {
  it("has 18 weeks", () => {
    expect(WEEKS).toHaveLength(18);
  });

  it("weeks are numbered sequentially from 1", () => {
    for (let i = 0; i < WEEKS.length; i++) {
      expect(WEEKS[i].number).toBe(i + 1);
    }
  });

  it("every week has exactly 5 matches", () => {
    for (const week of WEEKS) {
      expect(week.matches).toHaveLength(5);
    }
  });

  it("every match has exactly 2 different players", () => {
    for (const week of WEEKS) {
      for (const match of week.matches) {
        expect(match.p1).not.toBe(match.p2);
      }
    }
  });

  it("played matches have wins summing to 3", () => {
    for (const week of WEEKS) {
      for (const match of week.matches) {
        if (match.wins1 !== undefined && match.wins2 !== undefined) {
          expect(match.wins1 + match.wins2).toBe(3);
        }
      }
    }
  });

  it("played matches have wins between 0 and 3 inclusive", () => {
    for (const week of WEEKS) {
      for (const match of week.matches) {
        if (match.wins1 !== undefined) {
          expect(match.wins1).toBeGreaterThanOrEqual(0);
          expect(match.wins1).toBeLessThanOrEqual(3);
        }
        if (match.wins2 !== undefined) {
          expect(match.wins2).toBeGreaterThanOrEqual(0);
          expect(match.wins2).toBeLessThanOrEqual(3);
        }
      }
    }
  });
});

describe("FIRST_HALF_WEEKS / SECOND_HALF_WEEKS", () => {
  it("FIRST_HALF_WEEKS contains weeks 1–9", () => {
    expect(FIRST_HALF_WEEKS).toHaveLength(FIRST_HALF_LAST_WEEK);
    for (const week of FIRST_HALF_WEEKS) {
      expect(week.number).toBeLessThanOrEqual(FIRST_HALF_LAST_WEEK);
    }
  });

  it("SECOND_HALF_WEEKS contains remaining weeks", () => {
    expect(SECOND_HALF_WEEKS.length).toBe(WEEKS.length - FIRST_HALF_LAST_WEEK);
    for (const week of SECOND_HALF_WEEKS) {
      expect(week.number).toBeGreaterThan(FIRST_HALF_LAST_WEEK);
    }
  });

  it("all weeks accounted for", () => {
    expect(FIRST_HALF_WEEKS.length + SECOND_HALF_WEEKS.length).toBe(
      WEEKS.length,
    );
  });
});

describe("weekFor", () => {
  it("finds a week by number", () => {
    const week = weekFor(1);
    expect(week).toBeDefined();
    expect(week!.number).toBe(1);
  });

  it("returns undefined for unknown week numbers", () => {
    expect(weekFor(0)).toBeUndefined();
    expect(weekFor(99)).toBeUndefined();
  });
});
