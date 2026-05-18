import { expect, test } from "@playwright/test";
import { mockHoroscope } from "./helpers";

test.describe("Dashboard", () => {
  test("displays greeting and daily horoscope", async ({ page }) => {
    await mockHoroscope(page);
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    // Greeting should contain "Good morning/afternoon/evening"
    await expect(page.getByText(/good (morning|afternoon|evening)/i)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(/today's horoscope/i)).toBeVisible();
    await expect(page.getByText(/exciting opportunities/i)).toBeVisible();
  });

  test("displays quick action cards", async ({ page }) => {
    await mockHoroscope(page);
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    await expect(page.getByText(/explore/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("link", { name: /personal reading/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /tarot/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /chat/i }).first()).toBeVisible();
  });

  test("quick action links navigate correctly", async ({ page }) => {
    await mockHoroscope(page);
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    await expect(page.getByText(/explore/i)).toBeVisible({ timeout: 15000 });
    await page.getByRole("link", { name: /personal reading/i }).click();
    await expect(page).toHaveURL("/reading");
  });

  test("shows horoscope loading state", async ({ page }) => {
    await page.route("**/api/horoscope**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            sign: "aries",
            date: "2026-04-02",
            content: "Today is great.",
            cached: false,
          },
        }),
      });
    });

    await page.goto("/dashboard");

    await expect(page.getByText(/consulting the stars/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/today is great/i)).toBeVisible({ timeout: 15000 });
  });
});
