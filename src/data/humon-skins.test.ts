import { describe, it, expect } from "vitest";
import {
  CHAMPION_SPRITE,
  HUMON_SKINS,
  skinFor,
  skinUnlockKey,
} from "./humon-skins";

describe("HUMON_SKINS", () => {
  it("has unique ids and includes the default", () => {
    expect(Array.from(new Set(HUMON_SKINS.map((s) => s.id)))).toHaveLength(
      HUMON_SKINS.length,
    );
    expect(HUMON_SKINS[0].id).toBe("default");
  });

  it("every skin sprite has uniform 16-wide rows", () => {
    for (const skin of HUMON_SKINS) {
      const len = skin.sprite.map[0]?.length;
      expect(len).toBe(16);
      for (const row of skin.sprite.map) {
        expect(row).toHaveLength(len);
      }
    }
  });

  it("every palette char used by a skin is defined", () => {
    for (const skin of HUMON_SKINS) {
      for (const row of skin.sprite.map) {
        for (const char of row) {
          if (char !== ".") {
            expect(
              skin.sprite.palette[char],
              `${skin.id} ${char}`,
            ).toBeDefined();
          }
        }
      }
    }
  });

  it("skinUnlockKey only gates the hidden-humon skins", () => {
    expect(skinUnlockKey("default")).toBeUndefined();
    expect(skinUnlockKey("champion")).toBeUndefined();
    expect(skinUnlockKey("joak")).toBe("joak");
    expect(skinUnlockKey("devil")).toBe("devil");
    expect(skinUnlockKey("cop")).toBe("cop");
    expect(skinUnlockKey("glitch")).toBe("glitch");
    expect(skinUnlockKey("bond")).toBe("bond");
    expect(skinUnlockKey("angel")).toBe("angel");
    expect(skinUnlockKey("sex")).toBe("sex");
    expect(skinUnlockKey("dbz")).toBe("dbz");
  });
});

describe("skinFor", () => {
  it("returns the matching skin", () => {
    expect(skinFor("champion").id).toBe("champion");
  });

  it("falls back to the default for unknown ids", () => {
    expect(skinFor("bogus").id).toBe("default");
    expect(skinFor(undefined).id).toBe("default");
  });
});

describe("CHAMPION_SPRITE", () => {
  it("is a 16 x 16 grid", () => {
    expect(CHAMPION_SPRITE.map).toHaveLength(16);
    for (const row of CHAMPION_SPRITE.map) {
      expect(row).toHaveLength(16);
    }
  });

  it("has a gold crown on top", () => {
    expect(CHAMPION_SPRITE.map[0]).toContain("G");
    expect(CHAMPION_SPRITE.palette.G).toBeDefined();
  });
});
