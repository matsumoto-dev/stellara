import type { Page } from "@playwright/test";

/**
 * Mock API responses for E2E tests.
 * Intercepts fetch calls so tests don't depend on Supabase or Claude API.
 */
export async function mockAuthenticatedUser(page: Page) {
  // Mock the middleware auth check by setting a cookie that middleware recognizes
  // In practice, we mock the API responses instead
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );

  await page.route("**/api/auth/logout", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );
}

export async function mockHoroscope(page: Page) {
  await page.route("**/api/horoscope**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          sign: "aries",
          date: "2026-04-02",
          content:
            "Today brings exciting opportunities for growth. Trust your instincts and take bold steps forward.",
          cached: false,
        },
      }),
    }),
  );
}

export async function mockReadingResponse(page: Page) {
  await page.route("**/api/reading", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          content:
            "The stars reveal a period of transformation ahead. Your inner strength will guide you through changes.",
          type: "personal",
          rejected: false,
        },
      }),
    }),
  );
}

export async function mockReadingRateLimit(page: Page) {
  await page.route("**/api/reading", (route) =>
    route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: "Daily limit reached",
        remaining: 0,
        resetAt: "2026-04-03T00:00:00.000Z",
      }),
    }),
  );
}

export async function mockAccountDelete(page: Page) {
  await page.route("**/api/account/delete", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { hardDeleteAt: "2026-05-02T00:00:00.000Z" },
      }),
    }),
  );
}

export async function mockSignup(page: Page) {
  await page.route("**/api/auth/signup", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );
}

export async function mockSignupError(page: Page) {
  await page.route("**/api/auth/signup", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ success: false, error: "Email already registered" }),
    }),
  );
}

export async function mockLoginError(page: Page) {
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ success: false, error: "Invalid email or password" }),
    }),
  );
}
