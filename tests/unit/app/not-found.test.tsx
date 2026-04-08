import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("should render 404 heading", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("should render a link to home page", () => {
    const { container } = render(<NotFound />);

    const link = container.querySelector('a[href="/"]');
    expect(link).not.toBeNull();
    expect(link?.textContent).toBe("Return home");
  });
});
