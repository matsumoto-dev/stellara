import { expect, test } from "@playwright/test";
import { mockAccountDelete } from "./helpers";

test.describe("Settings", () => {
  test("page renders with danger zone", async ({ page }) => {
    await page.goto("/settings");

    await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible();
    await expect(page.getByText(/danger zone/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /delete account/i })).toBeVisible();
  });

  test("opens delete account dialog", async ({ page }) => {
    await page.goto("/settings");

    await page.getByRole("button", { name: /delete account/i }).click();

    await expect(page.getByText(/schedule your account for permanent deletion/i)).toBeVisible();
    await expect(page.locator("#confirm-delete")).toBeVisible();
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
  });

  test("delete button disabled until DELETE typed", async ({ page }) => {
    await page.goto("/settings");

    await page.getByRole("button", { name: /delete account/i }).click();

    const confirmBtn = page.getByRole("button", { name: /delete my account/i });
    await expect(confirmBtn).toBeDisabled();

    await page.locator("#confirm-delete").fill("DELETE");
    await expect(confirmBtn).toBeEnabled();
  });

  test("cancel closes dialog", async ({ page }) => {
    await page.goto("/settings");

    await page.getByRole("button", { name: /delete account/i }).click();
    await expect(page.getByText(/schedule your account/i)).toBeVisible();

    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByText(/schedule your account/i)).not.toBeVisible();
  });

  test("confirming deletion redirects to login", async ({ page }) => {
    await mockAccountDelete(page);
    await page.goto("/settings");

    await page.getByRole("button", { name: /delete account/i }).click();
    await page.locator("#confirm-delete").fill("DELETE");
    await page.getByRole("button", { name: /delete my account/i }).click();

    await page.waitForURL("/login");
  });
});
