import { describe, expect, it } from "vitest";
import { isEUCountry } from "@/lib/legal/eu-consent";

describe("isEUCountry", () => {
  it("should return true for EU member states", () => {
    const euCountries = ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL", "SE", "FI"];
    for (const code of euCountries) {
      expect(isEUCountry(code), `Expected ${code} to be EU`).toBe(true);
    }
  });

  it("should return true for EEA non-EU countries", () => {
    expect(isEUCountry("IS")).toBe(true); // Iceland
    expect(isEUCountry("LI")).toBe(true); // Liechtenstein
    expect(isEUCountry("NO")).toBe(true); // Norway
  });

  it("should return false for non-EU countries", () => {
    expect(isEUCountry("US")).toBe(false);
    expect(isEUCountry("JP")).toBe(false);
    expect(isEUCountry("GB")).toBe(false); // UK left EU
    expect(isEUCountry("AU")).toBe(false);
    expect(isEUCountry("CA")).toBe(false);
  });

  it("should be case-insensitive", () => {
    expect(isEUCountry("de")).toBe(true);
    expect(isEUCountry("fr")).toBe(true);
    expect(isEUCountry("us")).toBe(false);
  });

  it("should return false for null", () => {
    expect(isEUCountry(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isEUCountry(undefined)).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isEUCountry("")).toBe(false);
  });

  it("should cover all 27 EU member states", () => {
    const eu27 = [
      "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI",
      "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT",
      "NL", "PL", "PT", "RO", "SE", "SI", "SK",
    ];
    for (const code of eu27) {
      expect(isEUCountry(code), `Expected EU member state ${code} to return true`).toBe(true);
    }
    expect(eu27).toHaveLength(27);
  });
});
