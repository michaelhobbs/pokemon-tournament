import { describe, it, expect } from "vitest";
import { TRAINER_SPRITES, spriteFor } from "./trainer-sprites";
import { PLAYERS } from "./players";
import { HOMETOWN_MAP, HOMETOWN_MARKERS } from "./hometown-map";
import { TROPHY_SPRITE } from "./trophy";
import { FONT_5X7 } from "./pixel-font";

describe("TRAINER_SPRITES", () => {
  it("has sprites for all players", () => {
    for (const player of PLAYERS) {
      expect(TRAINER_SPRITES[player.number]).toBeDefined();
    }
  });

  it("every sprite has 16 rows of 16 chars", () => {
    for (const [num, sprite] of Object.entries(TRAINER_SPRITES)) {
      expect(sprite.map).toHaveLength(16);
      for (const row of sprite.map) {
        expect(row).toHaveLength(16);
      }
    }
  });

  it("every sprite palette has B, H, K, O keys", () => {
    for (const [num, sprite] of Object.entries(TRAINER_SPRITES)) {
      expect(sprite.palette.B).toBeDefined();
      expect(sprite.palette.H).toBeDefined();
      expect(sprite.palette.K).toBeDefined();
      expect(sprite.palette.O).toBeDefined();
    }
  });
});

describe("spriteFor", () => {
  it("returns the sprite for a valid player", () => {
    const sprite = spriteFor(1);
    expect(sprite).toBeDefined();
    expect(sprite.map).toHaveLength(16);
  });

  it("throws for unknown player numbers", () => {
    expect(() => spriteFor(99)).toThrow();
  });
});

describe("HOMETOWN_MAP", () => {
  it("has 28 rows", () => {
    expect(HOMETOWN_MAP.map).toHaveLength(28);
  });

  it("every row has 48 columns", () => {
    for (const row of HOMETOWN_MAP.map) {
      expect(row).toHaveLength(48);
    }
  });

  it("palette contains W, L, F, M, S, D", () => {
    for (const key of ["W", "L", "F", "M", "S", "D"]) {
      expect(HOMETOWN_MAP.palette[key]).toBeDefined();
    }
  });

  it("only contains valid terrain characters", () => {
    const valid = new Set(["W", "L", "F", "M", "S", "D"]);
    for (const row of HOMETOWN_MAP.map) {
      for (const char of row) {
        expect(valid.has(char)).toBe(true);
      }
    }
  });
});

describe("HOMETOWN_MARKERS", () => {
  it("has entries for all 10 players", () => {
    expect(HOMETOWN_MARKERS).toHaveLength(10);
  });

  it("all player numbers are valid", () => {
    const validNumbers = new Set(PLAYERS.map((p) => p.number));
    for (const marker of HOMETOWN_MARKERS) {
      expect(validNumbers.has(marker.playerNumber)).toBe(true);
    }
  });

  it("all coordinates are within map bounds", () => {
    for (const marker of HOMETOWN_MARKERS) {
      expect(marker.col).toBeGreaterThanOrEqual(0);
      expect(marker.col).toBeLessThan(48);
      expect(marker.row).toBeGreaterThanOrEqual(0);
      expect(marker.row).toBeLessThan(28);
    }
  });

  it("markers are on land (not water)", () => {
    for (const marker of HOMETOWN_MARKERS) {
      const terrain = HOMETOWN_MAP.map[marker.row][marker.col];
      expect(terrain).not.toBe("W");
    }
  });
});

describe("TROPHY_SPRITE", () => {
  it("has 22 rows", () => {
    expect(TROPHY_SPRITE.map).toHaveLength(22);
  });

  it("every row has 28 columns", () => {
    for (const row of TROPHY_SPRITE.map) {
      expect(row).toHaveLength(28);
    }
  });

  it("has palette keys B, G, H", () => {
    expect(TROPHY_SPRITE.palette.B).toBeDefined();
    expect(TROPHY_SPRITE.palette.G).toBeDefined();
    expect(TROPHY_SPRITE.palette.H).toBeDefined();
  });
});

describe("FONT_5X7", () => {
  it("has all uppercase letters", () => {
    for (const ch of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
      expect(FONT_5X7[ch]).toBeDefined();
    }
  });

  it("has all digits", () => {
    for (const ch of "0123456789") {
      expect(FONT_5X7[ch]).toBeDefined();
    }
  });

  it("has space", () => {
    expect(FONT_5X7[" "]).toBeDefined();
  });

  it("every glyph is 7 rows of 5 chars", () => {
    for (const [ch, glyph] of Object.entries(FONT_5X7)) {
      expect(glyph).toHaveLength(7);
      for (const row of glyph) {
        expect(row).toHaveLength(5);
        expect(row).toMatch(/^[.#]+$/);
      }
    }
  });
});
