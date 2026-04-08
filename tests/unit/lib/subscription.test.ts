import { describe, expect, it } from "vitest";
import {
  ALL_FEATURES,
  PRO_ONLY_FEATURES,
  checkFeatureAccess,
  isProRequired,
  isPro,
  type Feature,
} from "@/lib/subscription";

// ---------------------------------------------------------------------------
// isPro
// ---------------------------------------------------------------------------

describe("isPro", () => {
  it("returns true for pro plan", () => {
    expect(isPro("pro")).toBe(true);
  });

  it("returns false for free plan", () => {
    expect(isPro("free")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isProRequired
// ---------------------------------------------------------------------------

describe("isProRequired", () => {
  it("returns true for chat", () => {
    expect(isProRequired("chat")).toBe(true);
  });

  it("returns true for compatibility", () => {
    expect(isProRequired("compatibility")).toBe(true);
  });

  it("returns true for reading_history", () => {
    expect(isProRequired("reading_history")).toBe(true);
  });

  it("returns false for horoscope", () => {
    expect(isProRequired("horoscope")).toBe(false);
  });

  it("returns false for personal", () => {
    expect(isProRequired("personal")).toBe(false);
  });

  it("returns false for tarot", () => {
    expect(isProRequired("tarot")).toBe(false);
  });

  it("PRO_ONLY_FEATURES set matches isProRequired for all features", () => {
    for (const feature of ALL_FEATURES) {
      expect(isProRequired(feature)).toBe(PRO_ONLY_FEATURES.has(feature));
    }
  });
});

// ---------------------------------------------------------------------------
// checkFeatureAccess — free plan
// ---------------------------------------------------------------------------

describe("checkFeatureAccess — free plan", () => {
  const freeFeatures: Feature[] = ["horoscope", "personal", "tarot"];
  const proOnlyFeatures: Feature[] = ["chat", "compatibility", "reading_history"];

  for (const feature of freeFeatures) {
    it(`allows ${feature} for free users`, () => {
      const result = checkFeatureAccess("free", feature);
      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  }

  for (const feature of proOnlyFeatures) {
    it(`blocks ${feature} for free users with reason pro_required`, () => {
      const result = checkFeatureAccess("free", feature);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("pro_required");
    });
  }
});

// ---------------------------------------------------------------------------
// checkFeatureAccess — pro plan
// ---------------------------------------------------------------------------

describe("checkFeatureAccess — pro plan", () => {
  it("allows all features for pro users", () => {
    for (const feature of ALL_FEATURES) {
      const result = checkFeatureAccess("pro", feature);
      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    }
  });
});
