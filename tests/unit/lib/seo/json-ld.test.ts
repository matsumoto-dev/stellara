import { describe, expect, it } from "vitest";
import {
  getFAQPageJsonLd,
  getOrganizationJsonLd,
  getSoftwareApplicationJsonLd,
  getWebSiteJsonLd,
} from "@/lib/seo/json-ld";

describe("getWebSiteJsonLd", () => {
  it("should return valid WebSite schema", () => {
    const result = getWebSiteJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("WebSite");
    expect(result.name).toBe("Stellara");
    expect(result.url).toBe("https://stellara.chat");
    expect(result.description).toBeTruthy();
  });

  it("should produce valid JSON", () => {
    const result = getWebSiteJsonLd();
    const json = JSON.stringify(result);

    expect(() => JSON.parse(json)).not.toThrow();
  });
});

describe("getOrganizationJsonLd", () => {
  it("should return valid Organization schema", () => {
    const result = getOrganizationJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Organization");
    expect(result.name).toBe("Stellara");
    expect(result.url).toBe("https://stellara.chat");
  });

  it("should include contact point", () => {
    const result = getOrganizationJsonLd();

    expect(result.contactPoint).toBeDefined();
    expect(result.contactPoint?.email).toBe("hello@stellara.chat");
    expect(result.contactPoint?.contactType).toBe("customer support");
  });
});

describe("getSoftwareApplicationJsonLd", () => {
  it("should return valid SoftwareApplication schema", () => {
    const result = getSoftwareApplicationJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("SoftwareApplication");
    expect(result.name).toBe("Stellara");
    expect(result.url).toBe("https://stellara.chat");
    expect(result.description).toBeTruthy();
  });

  it("should have correct application category and OS", () => {
    const result = getSoftwareApplicationJsonLd();

    expect(result.applicationCategory).toBe("LifestyleApplication");
    expect(result.operatingSystem).toBe("Web");
  });

  it("should include free offer", () => {
    const result = getSoftwareApplicationJsonLd();

    expect(result.offers["@type"]).toBe("Offer");
    expect(result.offers.price).toBe("0");
    expect(result.offers.priceCurrency).toBe("USD");
  });

  it("should produce valid JSON", () => {
    const result = getSoftwareApplicationJsonLd();
    const json = JSON.stringify(result);

    expect(() => JSON.parse(json)).not.toThrow();
  });
});

describe("getFAQPageJsonLd", () => {
  it("should return valid FAQPage schema", () => {
    const result = getFAQPageJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("FAQPage");
    expect(result.mainEntity).toBeDefined();
    expect(result.mainEntity.length).toBeGreaterThan(0);
  });

  it("should have well-formed Question entries", () => {
    const result = getFAQPageJsonLd();

    for (const item of result.mainEntity) {
      expect(item["@type"]).toBe("Question");
      expect(item.name).toBeTruthy();
      expect(item.acceptedAnswer["@type"]).toBe("Answer");
      expect(item.acceptedAnswer.text).toBeTruthy();
    }
  });

  it("should include free and Pro pricing questions", () => {
    const result = getFAQPageJsonLd();
    const questions = result.mainEntity.map((q) => q.name);

    expect(questions.some((q) => q.toLowerCase().includes("free"))).toBe(true);
    expect(questions.some((q) => q.toLowerCase().includes("pro"))).toBe(true);
  });

  it("should produce valid JSON", () => {
    const result = getFAQPageJsonLd();
    const json = JSON.stringify(result);

    expect(() => JSON.parse(json)).not.toThrow();
  });
});
