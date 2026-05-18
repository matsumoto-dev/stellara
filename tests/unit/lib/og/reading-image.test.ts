import { describe, expect, it } from "vitest";
import {
  IMAGE_FORMATS,
  READING_TYPES,
  getImageDimensions,
  getReadingTypeLabel,
  getSignData,
  parseOgReadingParams,
  truncateHighlight,
} from "@/lib/og/reading-image";

// ─── getSignData ─────────────────────────────────────────────────────────────

describe("getSignData", () => {
  it("should return sign data for valid sign", () => {
    const data = getSignData("aries");

    expect(data).not.toBeNull();
    expect(data?.symbol).toBe("♈");
    expect(data?.displayName).toBe("Aries");
  });

  it("should return data for all 12 signs", () => {
    const signs = [
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
      "capricorn",
      "aquarius",
      "pisces",
    ];
    for (const sign of signs) {
      const data = getSignData(sign);
      expect(data, `${sign} should have data`).not.toBeNull();
      expect(data?.symbol).toBeTruthy();
      expect(data?.displayName).toBeTruthy();
    }
  });

  it("should return null for invalid sign", () => {
    expect(getSignData("invalid")).toBeNull();
    expect(getSignData("")).toBeNull();
    expect(getSignData("sun")).toBeNull();
  });

  it("should be case-insensitive", () => {
    expect(getSignData("Aries")).not.toBeNull();
    expect(getSignData("ARIES")).not.toBeNull();
  });
});

// ─── getImageDimensions ───────────────────────────────────────────────────────

describe("getImageDimensions", () => {
  it("should return Stories dimensions for 'stories' format", () => {
    const dims = getImageDimensions("stories");

    expect(dims.width).toBe(IMAGE_FORMATS.stories.width);
    expect(dims.height).toBe(IMAGE_FORMATS.stories.height);
    expect(dims.width).toBe(1080);
    expect(dims.height).toBe(1920);
  });

  it("should return Pinterest dimensions for 'pinterest' format", () => {
    const dims = getImageDimensions("pinterest");

    expect(dims.width).toBe(IMAGE_FORMATS.pinterest.width);
    expect(dims.height).toBe(IMAGE_FORMATS.pinterest.height);
    expect(dims.width).toBe(1000);
    expect(dims.height).toBe(1500);
  });

  it("should default to stories for unknown format", () => {
    const dims = getImageDimensions("unknown");

    expect(dims.width).toBe(1080);
    expect(dims.height).toBe(1920);
  });

  it("should default to stories when format is empty", () => {
    const dims = getImageDimensions("");

    expect(dims.width).toBe(1080);
    expect(dims.height).toBe(1920);
  });
});

// ─── getReadingTypeLabel ──────────────────────────────────────────────────────

describe("getReadingTypeLabel", () => {
  it("should return label for 'horoscope'", () => {
    expect(getReadingTypeLabel("horoscope")).toBe(READING_TYPES.horoscope);
  });

  it("should return label for 'reading'", () => {
    expect(getReadingTypeLabel("reading")).toBe(READING_TYPES.reading);
  });

  it("should return label for 'tarot'", () => {
    expect(getReadingTypeLabel("tarot")).toBe(READING_TYPES.tarot);
  });

  it("should return label for 'weekly'", () => {
    expect(getReadingTypeLabel("weekly")).toBe(READING_TYPES.weekly);
  });

  it("should return null for unknown type", () => {
    expect(getReadingTypeLabel("unknown")).toBeNull();
    expect(getReadingTypeLabel("")).toBeNull();
  });
});

// ─── truncateHighlight ────────────────────────────────────────────────────────

describe("truncateHighlight", () => {
  it("should return text as-is if within limit", () => {
    const short = "Stars align for you today.";

    expect(truncateHighlight(short)).toBe(short);
  });

  it("should truncate text exceeding max length", () => {
    const long = "A".repeat(150);
    const result = truncateHighlight(long);

    expect(result.length).toBeLessThanOrEqual(100 + 1); // +1 for ellipsis char
    expect(result.endsWith("…")).toBe(true);
  });

  it("should respect custom maxLength", () => {
    const text = "Hello World";
    const result = truncateHighlight(text, 5);

    expect(result).toBe("Hello…");
  });

  it("should handle empty string", () => {
    expect(truncateHighlight("")).toBe("");
  });
});

// ─── parseOgReadingParams ─────────────────────────────────────────────────────

describe("parseOgReadingParams", () => {
  it("should parse valid params with sign and highlight", () => {
    const sp = new URLSearchParams({ sign: "leo", highlight: "A golden day awaits." });
    const result = parseOgReadingParams("horoscope", sp);

    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.type).toBe("horoscope");
    expect(result.sign?.name).toBe("leo");
    expect(result.highlight).toBe("A golden day awaits.");
    expect(result.format).toBe("stories"); // default
  });

  it("should parse pinterest format", () => {
    const sp = new URLSearchParams({ format: "pinterest" });
    const result = parseOgReadingParams("tarot", sp);

    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.dimensions.width).toBe(1000);
    expect(result.dimensions.height).toBe(1500);
  });

  it("should return error for invalid reading type", () => {
    const sp = new URLSearchParams();
    const result = parseOgReadingParams("invalid", sp);

    expect("error" in result).toBe(true);
  });

  it("should allow missing sign", () => {
    const sp = new URLSearchParams({ highlight: "Cosmic energy flows." });
    const result = parseOgReadingParams("reading", sp);

    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.sign).toBeNull();
  });

  it("should truncate long highlight text", () => {
    const sp = new URLSearchParams({ highlight: "X".repeat(200) });
    const result = parseOgReadingParams("horoscope", sp);

    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.highlight.length).toBeLessThanOrEqual(101);
  });

  it("should use null sign for invalid sign string", () => {
    const sp = new URLSearchParams({ sign: "notasign" });
    const result = parseOgReadingParams("horoscope", sp);

    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.sign).toBeNull();
  });
});
