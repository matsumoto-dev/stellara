import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";

describe("ErrorPage", () => {
  it("should render error heading and message", () => {
    const error = new Error("Test error occurred");
    const reset = vi.fn();

    const { container } = render(<ErrorPage error={error} reset={reset} />);

    expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
    expect(container.textContent).toContain("Test error occurred");
  });

  it("should render a retry button that calls reset", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    const { container } = render(<ErrorPage error={error} reset={reset} />);

    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button?.textContent).toBe("Try again");
    button?.click();

    expect(reset).toHaveBeenCalledOnce();
  });
});
