import { expect, test } from "@playwright/test";
import { mockAuthenticatedUser, mockLoginError, mockSignup } from "./helpers";

test.describe("Authentication flow", () => {
  test("login page renders with form fields", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("login page has links to signup and reset password", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("link", { name: /forgot password/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();
  });

  test("login shows error on invalid credentials", async ({ page }) => {
    await mockLoginError(page);
    await page.goto("/login");

    await page.locator("#email").fill("test@example.com");
    await page.locator("#password").fill("wrongpassword");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await mockAuthenticatedUser(page);
    await page.goto("/login");

    await page.locator("#email").fill("test@example.com");
    await page.locator("#password").fill("correctpassword");
    await page.getByRole("button", { name: /log in/i }).click();

    await page.waitForURL("/dashboard");
  });

  test("signup page renders with form fields and consent checkboxes", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#birth_date")).toBeVisible();
    await expect(page.locator("#terms_consent")).toBeVisible();
    await expect(page.locator("#entertainment_consent")).toBeVisible();
  });

  test("signup button disabled until both consents checked", async ({ page }) => {
    await page.goto("/signup");

    const submitBtn = page.getByRole("button", { name: /sign up/i });
    await expect(submitBtn).toBeDisabled();

    await page.locator("#terms_consent").check();
    await expect(submitBtn).toBeDisabled();

    await page.locator("#entertainment_consent").check();
    await expect(submitBtn).toBeEnabled();
  });

  test("successful signup redirects to dashboard", async ({ page }) => {
    await mockSignup(page);
    await page.goto("/signup");

    await page.locator("#email").fill("new@example.com");
    await page.locator("#password").fill("strongpassword123");
    await page.locator("#birth_date").fill("1995-06-15");
    await page.locator("#terms_consent").check();
    await page.locator("#entertainment_consent").check();
    await page.getByRole("button", { name: /sign up/i }).click();

    await page.waitForURL("/dashboard");
  });

  test("reset password page renders", async ({ page }) => {
    await page.goto("/reset-password");

    await expect(page.getByRole("heading", { name: /reset password/i })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to log in/i })).toBeVisible();
  });
});
