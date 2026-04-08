import { describe, it, expect } from "vitest";
import { buildArticleOGFields } from "@/lib/seo/article-meta";

describe("buildArticleOGFields", () => {
  it("sets type to article", () => {
    const result = buildArticleOGFields("Astrology", ["zodiac"]);
    expect(result.type).toBe("article");
  });

  it("sets authors to stellara.chat URL", () => {
    const result = buildArticleOGFields("Astrology", ["zodiac"]);
    expect(result.authors).toEqual(["https://stellara.chat"]);
  });

  it("sets section correctly", () => {
    const result = buildArticleOGFields("Tarot", ["tarot"]);
    expect(result.section).toBe("Tarot");
  });

  it("passes through tags", () => {
    const result = buildArticleOGFields("Astrology", ["aries", "taurus", "compatibility"]);
    expect(result.tags).toEqual(["aries", "taurus", "compatibility"]);
  });

  it("deduplicates tags", () => {
    const result = buildArticleOGFields("Astrology", ["aries", "aries", "taurus"]);
    expect(result.tags).toEqual(["aries", "taurus"]);
  });

  it("truncates tags to 6 max", () => {
    const manyTags = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const result = buildArticleOGFields("Astrology", manyTags);
    expect(result.tags).toHaveLength(6);
  });

  it("uses default publishedTime", () => {
    const result = buildArticleOGFields("Astrology", []);
    expect(result.publishedTime).toBe("2026-04-03T00:00:00Z");
  });

  it("uses dynamic default modifiedTime (today's date in ISO format)", () => {
    const before = new Date().toISOString().replace(/T.*$/, "T00:00:00Z");
    const result = buildArticleOGFields("Astrology", []);
    const after = new Date().toISOString().replace(/T.*$/, "T00:00:00Z");
    expect(result.modifiedTime).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00Z$/);
    expect(result.modifiedTime >= before).toBe(true);
    expect(result.modifiedTime <= after).toBe(true);
  });

  it("accepts custom dates", () => {
    const result = buildArticleOGFields(
      "Astrology",
      [],
      "2026-01-01T00:00:00Z",
      "2026-03-15T00:00:00Z",
    );
    expect(result.publishedTime).toBe("2026-01-01T00:00:00Z");
    expect(result.modifiedTime).toBe("2026-03-15T00:00:00Z");
  });

  it("returns empty tags for empty input", () => {
    const result = buildArticleOGFields("Astrology", []);
    expect(result.tags).toEqual([]);
  });
});
