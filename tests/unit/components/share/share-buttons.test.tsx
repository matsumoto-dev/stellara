import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShareButtons } from "@/components/share/share-buttons";

// ── fetch mock for trackShare ─────────────────────────────────────────────────
const mockFetch = vi.fn();
beforeEach(() => {
  mockFetch.mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", mockFetch);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
});

describe("ShareButtons", () => {
  it("should render all five share buttons", () => {
    render(<ShareButtons type="horoscope" text="Stars align for you today." />);

    expect(screen.getByRole("link", { name: /save to pinterest/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /share on x/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /share on facebook/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /share on whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download reading image/i })).toBeInTheDocument();
  });

  it("Pinterest link should point to pinterest.com", () => {
    render(<ShareButtons type="horoscope" text="Stars align for you today." />);

    const link = screen.getByRole("link", { name: /save to pinterest/i });
    expect(link.getAttribute("href")).toContain("pinterest.com/pin/create/button/");
  });

  it("Pinterest link should include image URL with reading type", () => {
    render(<ShareButtons type="tarot" text="The Fool's journey begins." sign="aries" />);

    const link = screen.getByRole("link", { name: /save to pinterest/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("api%2Fog%2Freading%2Ftarot");
  });

  it("Pinterest link should include sign in image URL", () => {
    render(<ShareButtons type="horoscope" text="A golden day." sign="leo" />);

    const link = screen.getByRole("link", { name: /save to pinterest/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("leo");
  });

  it("X link should point to twitter.com intent", () => {
    render(<ShareButtons type="reading" text="New horizons await." />);

    const link = screen.getByRole("link", { name: /share on x/i });
    expect(link.getAttribute("href")).toContain("twitter.com/intent/tweet");
  });

  it("X link should include reading text", () => {
    const text = "Cosmic energy flows through you.";
    render(<ShareButtons type="weekly" text={text} />);

    const link = screen.getByRole("link", { name: /share on x/i });
    const href = link.getAttribute("href") ?? "";
    // Use URL.searchParams to properly decode both %xx and + encoding
    const tweetText = new URL(href).searchParams.get("text") ?? "";
    expect(tweetText).toContain(text);
  });

  it("Download link should point to the OG image API", () => {
    render(<ShareButtons type="horoscope" text="Stars align." sign="virgo" />);

    const link = screen.getByRole("link", { name: /download reading image/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("/api/og/reading/horoscope");
    expect(href).toContain("virgo");
  });

  it("Download link should have download attribute with reading type", () => {
    render(<ShareButtons type="tarot" text="Insight awaits." />);

    const link = screen.getByRole("link", { name: /download reading image/i });
    expect(link.getAttribute("download")).toBe("stellara-tarot.png");
  });

  it("Pinterest and X links should open in new tab", () => {
    render(<ShareButtons type="horoscope" text="Stars align." />);

    const pinterest = screen.getByRole("link", { name: /save to pinterest/i });
    const x = screen.getByRole("link", { name: /share on x/i });

    expect(pinterest.getAttribute("target")).toBe("_blank");
    expect(pinterest.getAttribute("rel")).toContain("noopener");
    expect(x.getAttribute("target")).toBe("_blank");
    expect(x.getAttribute("rel")).toContain("noopener");
  });

  it("should render button labels", () => {
    render(<ShareButtons type="horoscope" text="Stars align." />);

    expect(screen.getByText("Save")).toBeInTheDocument();
    // "Share" appears on both X and Facebook buttons
    const shareLabels = screen.getAllByText("Share");
    expect(shareLabels.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("Facebook link should point to facebook.com sharer", () => {
    render(<ShareButtons type="horoscope" text="Stars align for you today." />);

    const link = screen.getByRole("link", { name: /share on facebook/i });
    expect(link.getAttribute("href")).toContain("www.facebook.com/sharer/sharer.php");
  });

  it("Facebook link should include the page URL", () => {
    render(<ShareButtons type="horoscope" text="Stars align for you today." />);

    const link = screen.getByRole("link", { name: /share on facebook/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("u=");
  });

  it("WhatsApp link should point to wa.me", () => {
    render(<ShareButtons type="reading" text="New horizons await." />);

    const link = screen.getByRole("link", { name: /share on whatsapp/i });
    expect(link.getAttribute("href")).toContain("wa.me");
  });

  it("WhatsApp link should include reading text", () => {
    const text = "Cosmic energy flows through you.";
    render(<ShareButtons type="weekly" text={text} />);

    const link = screen.getByRole("link", { name: /share on whatsapp/i });
    const href = link.getAttribute("href") ?? "";
    const message = new URL(href).searchParams.get("text") ?? "";
    expect(message).toContain(text);
  });

  it("Facebook and WhatsApp links should open in new tab", () => {
    render(<ShareButtons type="horoscope" text="Stars align." />);

    const facebook = screen.getByRole("link", { name: /share on facebook/i });
    const whatsapp = screen.getByRole("link", { name: /share on whatsapp/i });

    expect(facebook.getAttribute("target")).toBe("_blank");
    expect(facebook.getAttribute("rel")).toContain("noopener");
    expect(whatsapp.getAttribute("target")).toBe("_blank");
    expect(whatsapp.getAttribute("rel")).toContain("noopener");
  });

  it("should render Facebook Share and WhatsApp Send labels", () => {
    render(<ShareButtons type="horoscope" text="Stars align." />);

    // "Share" label appears on both X and Facebook buttons - check all
    const shareLinks = screen.getAllByText("Share");
    expect(shareLinks.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("should apply custom className to wrapper", () => {
    const { container } = render(
      <ShareButtons type="horoscope" text="Stars align." className="mt-4" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("mt-4");
  });

  it("should work without sign prop", () => {
    render(<ShareButtons type="reading" text="Your path is clear." />);

    const download = screen.getByRole("link", { name: /download reading image/i });
    const href = download.getAttribute("href") ?? "";
    expect(href).not.toContain("sign=");
    expect(href).toContain("/api/og/reading/reading");
  });

  // ── trackShare ──────────────────────────────────────────────────────────────

  it("should call /api/share/track with pinterest channel on Pinterest click", () => {
    render(<ShareButtons type="horoscope" text="Stars align." />);

    fireEvent.click(screen.getByRole("link", { name: /save to pinterest/i }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/share/track",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ channel: "pinterest", reading_type: "horoscope" }),
      }),
    );
  });

  it("should call /api/share/track with x channel on X click", () => {
    render(<ShareButtons type="tarot" text="The Fool begins." />);

    fireEvent.click(screen.getByRole("link", { name: /share on x/i }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/share/track",
      expect.objectContaining({
        body: JSON.stringify({ channel: "x", reading_type: "tarot" }),
      }),
    );
  });

  it("should call /api/share/track with facebook channel on Facebook click", () => {
    render(<ShareButtons type="reading" text="Your path." />);

    fireEvent.click(screen.getByRole("link", { name: /share on facebook/i }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/share/track",
      expect.objectContaining({
        body: JSON.stringify({ channel: "facebook", reading_type: "reading" }),
      }),
    );
  });

  it("should call /api/share/track with whatsapp channel on WhatsApp click", () => {
    render(<ShareButtons type="weekly" text="Weekly insight." />);

    fireEvent.click(screen.getByRole("link", { name: /share on whatsapp/i }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/share/track",
      expect.objectContaining({
        body: JSON.stringify({ channel: "whatsapp", reading_type: "weekly" }),
      }),
    );
  });

  it("should call /api/share/track with download channel on Download click", () => {
    render(<ShareButtons type="horoscope" text="Cosmic energy." />);

    fireEvent.click(screen.getByRole("link", { name: /download reading image/i }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/share/track",
      expect.objectContaining({
        body: JSON.stringify({ channel: "download", reading_type: "horoscope" }),
      }),
    );
  });

  it("should not throw when fetch rejects (fire-and-forget)", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    render(<ShareButtons type="horoscope" text="Stars." />);

    expect(() => {
      fireEvent.click(screen.getByRole("link", { name: /share on x/i }));
    }).not.toThrow();
  });

  // ── pageUrl prop ─────────────────────────────────────────────────────────────

  it("should use custom pageUrl in X share link when pageUrl prop is provided", () => {
    const customUrl = "https://stellara.chat/compatibility/aries-and-taurus";
    render(<ShareButtons type="reading" text="Aries & Taurus" pageUrl={customUrl} />);

    const link = screen.getByRole("link", { name: /share on x/i });
    const href = link.getAttribute("href") ?? "";
    const tweetText = new URL(href).searchParams.get("text") ?? "";
    expect(tweetText).toContain(customUrl);
  });

  it("should use custom pageUrl in Facebook share link when pageUrl prop is provided", () => {
    const customUrl = "https://stellara.chat/tarot/the-fool";
    render(<ShareButtons type="tarot" text="The Fool Tarot" pageUrl={customUrl} />);

    const link = screen.getByRole("link", { name: /share on facebook/i });
    const href = link.getAttribute("href") ?? "";
    const sharedUrl = new URL(href).searchParams.get("u") ?? "";
    expect(sharedUrl).toBe(customUrl);
  });

  it("should use custom pageUrl in Pinterest share link when pageUrl prop is provided", () => {
    const customUrl = "https://stellara.chat/compatibility/leo-and-scorpio";
    render(<ShareButtons type="reading" text="Leo & Scorpio Compatibility" pageUrl={customUrl} />);

    const link = screen.getByRole("link", { name: /save to pinterest/i });
    const href = link.getAttribute("href") ?? "";
    const pinUrl = new URL(href).searchParams.get("url") ?? "";
    expect(pinUrl).toBe(customUrl);
  });

  it("should use custom pageUrl in WhatsApp share link when pageUrl prop is provided", () => {
    const customUrl = "https://stellara.chat/tarot/the-star";
    render(<ShareButtons type="tarot" text="The Star Tarot" pageUrl={customUrl} />);

    const link = screen.getByRole("link", { name: /share on whatsapp/i });
    const href = link.getAttribute("href") ?? "";
    const message = new URL(href).searchParams.get("text") ?? "";
    expect(message).toContain(customUrl);
  });
});
