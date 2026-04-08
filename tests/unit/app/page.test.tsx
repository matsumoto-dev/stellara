import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Home (LandingPage)", () => {
  it("should render the main hero heading", async () => {
    render(await Home());

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("should render Sign Up links", async () => {
    render(await Home());

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("should render SoftwareApplication JSON-LD script", async () => {
    const { container } = render(await Home());

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(2);

    const scriptTexts = Array.from(scripts).map((s) => s.textContent ?? "");
    const hasSoftwareApp = scriptTexts.some((text) => text.includes("SoftwareApplication"));
    expect(hasSoftwareApp).toBe(true);
  });

  it("should render FAQPage JSON-LD script", async () => {
    const { container } = render(await Home());

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const scriptTexts = Array.from(scripts).map((s) => s.textContent ?? "");
    const hasFAQ = scriptTexts.some((text) => text.includes("FAQPage"));
    expect(hasFAQ).toBe(true);
  });
});
