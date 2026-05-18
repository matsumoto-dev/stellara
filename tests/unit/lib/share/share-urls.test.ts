import { describe, expect, it } from "vitest";
import {
  buildFacebookUrl,
  buildImageUrl,
  buildPinterestUrl,
  buildShareUrls,
  buildWhatsAppUrl,
  buildXUrl,
} from "@/lib/share/share-urls";

const BASE = "https://stellara.chat";

// ─── buildImageUrl ────────────────────────────────────────────────────────────

describe("buildImageUrl", () => {
  it("should return correct URL for horoscope with sign", () => {
    const url = buildImageUrl(BASE, "horoscope", "Stars align today.", "leo");

    expect(url).toContain("/api/og/reading/horoscope");
    expect(url).toContain("format=pinterest");
    expect(url).toContain("sign=leo");
    expect(url).toContain("highlight=Stars+align+today.");
    expect(url.startsWith(BASE)).toBe(true);
  });

  it("should omit sign param when not provided", () => {
    const url = buildImageUrl(BASE, "reading", "A new chapter opens.");

    expect(url).toContain("/api/og/reading/reading");
    expect(url).not.toContain("sign=");
    expect(url).toContain("format=pinterest");
  });

  it("should work for all reading types", () => {
    const types = ["horoscope", "reading", "tarot", "weekly"] as const;
    for (const type of types) {
      const url = buildImageUrl(BASE, type, "text");
      expect(url).toContain(`/api/og/reading/${type}`);
    }
  });

  it("should URL-encode the highlight text", () => {
    const url = buildImageUrl(BASE, "tarot", "Love & prosperity await.");

    expect(url).toContain("highlight=");
    // URLSearchParams encodes & as %26
    expect(url).toContain("Love+%26+prosperity+await.");
  });
});

// ─── buildPinterestUrl ────────────────────────────────────────────────────────

describe("buildPinterestUrl", () => {
  it("should return a valid Pinterest Pin It URL", () => {
    const imageUrl = `${BASE}/api/og/reading/horoscope?format=pinterest`;
    const pageUrl = `${BASE}/dashboard`;
    const url = buildPinterestUrl(imageUrl, pageUrl, "Stars align today.");

    expect(url.startsWith("https://pinterest.com/pin/create/button/")).toBe(true);
    expect(url).toContain("media=");
    expect(url).toContain("url=");
    expect(url).toContain("description=");
  });

  it("should include the image URL in media param", () => {
    const imageUrl = `${BASE}/api/og/reading/tarot?format=pinterest`;
    const url = buildPinterestUrl(imageUrl, `${BASE}/dashboard`, "Tarot insight.");

    const parsed = new URL(url);
    expect(parsed.searchParams.get("media")).toBe(imageUrl);
  });

  it("should include the page URL in url param", () => {
    const pageUrl = `${BASE}/dashboard`;
    const url = buildPinterestUrl(`${BASE}/api/og/reading/reading?format=pinterest`, pageUrl, "text");

    const parsed = new URL(url);
    expect(parsed.searchParams.get("url")).toBe(pageUrl);
  });

  it("should include description text", () => {
    const text = "The stars reveal your destiny.";
    const url = buildPinterestUrl(`${BASE}/img.png`, `${BASE}/page`, text);

    const parsed = new URL(url);
    expect(parsed.searchParams.get("description")).toBe(text);
  });
});

// ─── buildXUrl ────────────────────────────────────────────────────────────────

describe("buildXUrl", () => {
  it("should return a valid X Web Intent URL", () => {
    const url = buildXUrl("Stars align today.", `${BASE}/dashboard`);

    expect(url.startsWith("https://twitter.com/intent/tweet")).toBe(true);
    expect(url).toContain("text=");
  });

  it("should include the reading text in the tweet", () => {
    const text = "A golden opportunity awaits.";
    const url = buildXUrl(text, `${BASE}/dashboard`);

    const parsed = new URL(url);
    const tweetText = parsed.searchParams.get("text") ?? "";
    expect(tweetText).toContain(text);
  });

  it("should include the page URL in the tweet", () => {
    const pageUrl = `${BASE}/dashboard`;
    const url = buildXUrl("text", pageUrl);

    const parsed = new URL(url);
    const tweetText = parsed.searchParams.get("text") ?? "";
    expect(tweetText).toContain(pageUrl);
  });
});

// ─── buildFacebookUrl ─────────────────────────────────────────────────────────

describe("buildFacebookUrl", () => {
  it("should return a valid Facebook sharer URL", () => {
    const url = buildFacebookUrl(`${BASE}/dashboard`);

    expect(url.startsWith("https://www.facebook.com/sharer/sharer.php")).toBe(true);
    expect(url).toContain("u=");
  });

  it("should include the page URL in the u param", () => {
    const pageUrl = `${BASE}/dashboard`;
    const url = buildFacebookUrl(pageUrl);

    const parsed = new URL(url);
    expect(parsed.searchParams.get("u")).toBe(pageUrl);
  });
});

// ─── buildWhatsAppUrl ─────────────────────────────────────────────────────────

describe("buildWhatsAppUrl", () => {
  it("should return a valid WhatsApp share URL", () => {
    const url = buildWhatsAppUrl("Stars align today.", `${BASE}/dashboard`);

    expect(url.startsWith("https://wa.me/")).toBe(true);
    expect(url).toContain("text=");
  });

  it("should include the reading text in the message", () => {
    const text = "A golden opportunity awaits.";
    const url = buildWhatsAppUrl(text, `${BASE}/dashboard`);

    const parsed = new URL(url);
    const message = parsed.searchParams.get("text") ?? "";
    expect(message).toContain(text);
  });

  it("should include the page URL in the message", () => {
    const pageUrl = `${BASE}/dashboard`;
    const url = buildWhatsAppUrl("text", pageUrl);

    const parsed = new URL(url);
    const message = parsed.searchParams.get("text") ?? "";
    expect(message).toContain(pageUrl);
  });
});

// ─── buildShareUrls ───────────────────────────────────────────────────────────

describe("buildShareUrls", () => {
  it("should return all five share URLs", () => {
    const urls = buildShareUrls({
      type: "horoscope",
      text: "Stars align for Leo today.",
      sign: "leo",
      baseUrl: BASE,
    });

    expect(urls.imageUrl).toBeTruthy();
    expect(urls.pinterestUrl).toBeTruthy();
    expect(urls.xUrl).toBeTruthy();
    expect(urls.facebookUrl).toBeTruthy();
    expect(urls.whatsAppUrl).toBeTruthy();
  });

  it("imageUrl should include type, sign, and text", () => {
    const urls = buildShareUrls({
      type: "tarot",
      text: "The Fool begins a journey.",
      sign: "aries",
      baseUrl: BASE,
    });

    expect(urls.imageUrl).toContain("/api/og/reading/tarot");
    expect(urls.imageUrl).toContain("sign=aries");
    expect(urls.imageUrl).toContain("highlight=");
  });

  it("pinterestUrl should reference the imageUrl", () => {
    const urls = buildShareUrls({
      type: "reading",
      text: "New horizons await.",
      baseUrl: BASE,
    });

    const parsed = new URL(urls.pinterestUrl);
    const mediaParam = parsed.searchParams.get("media") ?? "";
    expect(mediaParam).toContain("/api/og/reading/reading");
  });

  it("xUrl should reference the reading text", () => {
    const text = "Cosmic energy flows through you.";
    const urls = buildShareUrls({ type: "weekly", text, baseUrl: BASE });

    const parsed = new URL(urls.xUrl);
    const tweetText = parsed.searchParams.get("text") ?? "";
    expect(tweetText).toContain(text);
  });

  it("should work without sign param", () => {
    const urls = buildShareUrls({
      type: "reading",
      text: "Your path is clear.",
      baseUrl: BASE,
    });

    expect(urls.imageUrl).not.toContain("sign=");
    expect(urls.pinterestUrl).toBeTruthy();
    expect(urls.xUrl).toBeTruthy();
  });
});
