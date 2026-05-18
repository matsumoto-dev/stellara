import { expect, test } from "@playwright/test";

test.describe("Legal pages", () => {
  test("terms page renders with content", async ({ page }) => {
    await page.goto("/terms");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/last updated/i)).toBeVisible();
    // Has a "See also our Privacy Policy" cross-link
    await expect(page.getByText(/see also our/i)).toBeVisible();
  });

  test("privacy page renders with content", async ({ page }) => {
    await page.goto("/privacy");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/last updated/i)).toBeVisible();
    // Has a "See also our Terms of Service" cross-link
    await expect(page.getByText(/see also our/i)).toBeVisible();
  });

  test("footer links are present on all pages", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.locator("footer").getByRole("link", { name: /terms of service/i }),
    ).toBeVisible();
    await expect(
      page.locator("footer").getByRole("link", { name: /privacy policy/i }),
    ).toBeVisible();
  });

  test("footer contains entertainment disclaimer", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText(/for entertainment purposes only/i)).toBeVisible();
  });
});
