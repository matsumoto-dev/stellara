import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ReadingResult } from "@/components/reading/reading-result";

afterEach(() => {
  cleanup();
});

describe("ReadingResult", () => {
  it("should render the reading content", () => {
    render(<ReadingResult content="Your path is clear." type="personal" />);

    expect(screen.getByText("Your path is clear.")).toBeInTheDocument();
  });

  it("should render a badge with the reading type", () => {
    render(<ReadingResult content="Stars align." type="tarot" />);

    expect(screen.getByText("Tarot Reading")).toBeInTheDocument();
  });

  it("should show ShareButtons when not rejected", () => {
    render(<ReadingResult content="Cosmic energy flows." type="personal" />);

    expect(screen.getByRole("link", { name: /save to pinterest/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /share on x/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download reading image/i })).toBeInTheDocument();
  });

  it("should not show ShareButtons when rejected", () => {
    render(<ReadingResult content="Content filtered." type="personal" rejected />);

    expect(screen.queryByRole("link", { name: /save to pinterest/i })).not.toBeInTheDocument();
  });

  it("should show content filtered badge when rejected", () => {
    render(<ReadingResult content="Content filtered." type="personal" rejected />);

    expect(screen.getByText("reading.contentFiltered")).toBeInTheDocument();
  });

  it("should use 'reading' type in share URLs for personal readings", () => {
    render(<ReadingResult content="New horizons await." type="personal" />);

    const download = screen.getByRole("link", { name: /download reading image/i });
    expect(download.getAttribute("href")).toContain("/api/og/reading/reading");
  });

  it("should use 'tarot' type in share URLs for tarot readings", () => {
    render(<ReadingResult content="The Fool's journey." type="tarot" />);

    const download = screen.getByRole("link", { name: /download reading image/i });
    expect(download.getAttribute("href")).toContain("/api/og/reading/tarot");
  });

  it("should pass sign to share URLs when provided", () => {
    render(<ReadingResult content="Leo shines bright." type="personal" sign="leo" />);

    const download = screen.getByRole("link", { name: /download reading image/i });
    expect(download.getAttribute("href")).toContain("leo");
  });

  it("should truncate long content for share text (max 200 chars)", () => {
    const longContent = "A".repeat(250);
    render(<ReadingResult content={longContent} type="personal" />);

    const xLink = screen.getByRole("link", { name: /share on x/i });
    const href = xLink.getAttribute("href") ?? "";
    const tweetText = new URL(href).searchParams.get("text") ?? "";
    // Original content is 250 chars; truncated to 200 chars + ellipsis
    expect(tweetText).toContain("…");
    // The share portion (before \n\n) should be ≤ 201 chars (200 + ellipsis)
    const sharePart = tweetText.split("\n\n")[0];
    expect(sharePart.length).toBeLessThanOrEqual(201);
  });

  it("should not truncate short content", () => {
    const shortContent = "Stars align for you today.";
    render(<ReadingResult content={shortContent} type="personal" />);

    const xLink = screen.getByRole("link", { name: /share on x/i });
    const href = xLink.getAttribute("href") ?? "";
    const tweetText = new URL(href).searchParams.get("text") ?? "";
    expect(tweetText).toContain(shortContent);
  });
});
