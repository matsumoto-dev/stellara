import { expect, test } from "@playwright/test";
import { mockHoroscope } from "./helpers";

test.describe("Navigation", () => {
  test("sidebar navigation links work on desktop", async ({ page }) => {
    await mockHoroscope(page);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/dashboard");

    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByText("Stellara")).toBeVisible();

    // Navigate to reading
    await sidebar.getByRole("link", { name: /personal/i }).click();
    await expect(page).toHaveURL("/reading");

    // Navigate to tarot
    await sidebar.getByRole("link", { name: /tarot/i }).click();
    await expect(page).toHaveURL("/tarot");

    // Navigate to chat
    await sidebar.getByRole("link", { name: /chat/i }).click();
    await expect(page).toHaveURL("/chat");

    // Navigate to settings
    await sidebar.getByRole("link", { name: /settings/i }).click();
    await expect(page).toHaveURL("/settings");

    // Navigate back to dashboard
    await sidebar.getByRole("link", { name: /dashboard/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("mobile navigation is visible on small screens", async ({ page }) => {
    await mockHoroscope(page);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");

    // Mobile nav should be at the bottom
    const mobileNav = page.locator("nav").last();
    await expect(mobileNav).toBeVisible();

    await expect(mobileNav.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: /reading/i })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: /tarot/i })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: /chat/i })).toBeVisible();
  });

  test("mobile nav links work", async ({ page }) => {
    await mockHoroscope(page);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");

    const mobileNav = page.locator("nav").last();
    await mobileNav.getByRole("link", { name: /tarot/i }).click();
    await expect(page).toHaveURL("/tarot");
  });

  test("landing page renders for unauthenticated users", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /stellara/i })).toBeVisible();
    await expect(page.getByText(/your personal ai astrologer/i)).toBeVisible();
  });
});
