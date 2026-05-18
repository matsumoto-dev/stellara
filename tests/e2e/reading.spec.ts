import { expect, test } from "@playwright/test";
import { mockReadingResponse } from "./helpers";

test.describe("Personal Reading", () => {
  test("page renders with form", async ({ page }) => {
    await page.goto("/reading");

    await expect(page.getByRole("heading", { name: /personal reading/i })).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
    await expect(page.getByRole("button", { name: /reveal my reading/i })).toBeVisible();
  });

  test("submits question and displays result", async ({ page }) => {
    await mockReadingResponse(page);
    await page.goto("/reading");

    await page.locator("textarea").fill("What does my career look like?");
    await page.getByRole("button", { name: /reveal my reading/i }).click();

    // Result (loading state may flash too briefly to catch)
    await expect(page.getByText(/transformation ahead/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/get another reading/i)).toBeVisible();
  });

  test("can reset and get another reading", async ({ page }) => {
    await mockReadingResponse(page);
    await page.goto("/reading");

    await page.getByRole("button", { name: /reveal my reading/i }).click();
    await expect(page.getByText(/transformation ahead/i)).toBeVisible();

    await page.getByText(/get another reading/i).click();

    // Form should be visible again
    await expect(page.locator("textarea")).toBeVisible();
  });
});

test.describe("Tarot Reading", () => {
  test("page renders with spread selector", async ({ page }) => {
    await page.goto("/tarot");

    await expect(page.getByRole("heading", { name: /tarot reading/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /single card/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /past.*present.*future/i })).toBeVisible();
  });

  test("draws cards and shows reading", async ({ page }) => {
    await page.route("**/api/reading", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            content: "The Fool card represents new beginnings and endless possibility.",
            type: "tarot",
            rejected: false,
          },
        }),
      }),
    );

    await page.goto("/tarot");

    await page.getByRole("button", { name: /draw cards/i }).click();

    // Should show reading result eventually
    await expect(page.getByText(/new beginnings/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/draw again/i)).toBeVisible();
  });
});
