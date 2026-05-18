import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DailyCard } from "@/components/horoscope/daily-card";

afterEach(() => {
  cleanup();
});

describe("DailyCard", () => {
  it("should render loading state", () => {
    render(<DailyCard sign={null} date={null} content={null} loading error={null} />);

    expect(screen.getByText("horoscope.loading")).toBeInTheDocument();
  });

  it("should render error state", () => {
    render(<DailyCard sign={null} date={null} content={null} loading={false} error="Oops!" />);

    expect(screen.getByText("Oops!")).toBeInTheDocument();
  });

  it("should render nothing when content is null", () => {
    const { container } = render(
      <DailyCard sign={null} date={null} content={null} loading={false} error={null} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render the horoscope content", () => {
    render(
      <DailyCard
        sign="aries"
        date="April 6, 2026"
        content="Bold moves reward you today."
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Bold moves reward you today.")).toBeInTheDocument();
  });

  it("should show ShareButtons with horoscope type", () => {
    render(
      <DailyCard
        sign="aries"
        date="April 6, 2026"
        content="Bold moves reward you today."
        loading={false}
        error={null}
      />,
    );

    const download = screen.getByRole("link", { name: /download reading image/i });
    expect(download.getAttribute("href")).toContain("/api/og/reading/horoscope");
  });

  it("should pass sign to share URLs", () => {
    render(
      <DailyCard
        sign="leo"
        date="April 6, 2026"
        content="Leo shines with solar power."
        loading={false}
        error={null}
      />,
    );

    const download = screen.getByRole("link", { name: /download reading image/i });
    expect(download.getAttribute("href")).toContain("leo");
  });

  it("should truncate long horoscope content for share text", () => {
    const longContent = "B".repeat(250);
    render(
      <DailyCard
        sign="virgo"
        date="April 6, 2026"
        content={longContent}
        loading={false}
        error={null}
      />,
    );

    const xLink = screen.getByRole("link", { name: /share on x/i });
    const href = xLink.getAttribute("href") ?? "";
    const tweetText = new URL(href).searchParams.get("text") ?? "";
    expect(tweetText).toContain("…");
  });

  it("should not truncate short content for share", () => {
    const shortContent = "A peaceful day awaits.";
    render(
      <DailyCard
        sign="taurus"
        date="April 6, 2026"
        content={shortContent}
        loading={false}
        error={null}
      />,
    );

    const xLink = screen.getByRole("link", { name: /share on x/i });
    const href = xLink.getAttribute("href") ?? "";
    const tweetText = new URL(href).searchParams.get("text") ?? "";
    expect(tweetText).toContain(shortContent);
  });

  it("should not show ShareButtons in loading state", () => {
    render(<DailyCard sign={null} date={null} content={null} loading error={null} />);

    expect(screen.queryByRole("link", { name: /save to pinterest/i })).not.toBeInTheDocument();
  });
});
