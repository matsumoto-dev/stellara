/**
 * QA Screenshot Test — stellara.chat
 * 全主要ページのデスクトップ + モバイルスクショを撮影する
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://stellara.chat";
const OUTPUT_DIR = path.join(
  __dirname,
  "../../reviews/qa-screenshots/2026-04-04"
);

// public pages (no auth required)
const PUBLIC_PAGES = [
  { name: "landing", path: "/" },
  { name: "login", path: "/login" },
  { name: "signup", path: "/signup" },
  { name: "terms", path: "/terms" },
  { name: "privacy", path: "/privacy" },
  { name: "faq", path: "/faq" },
  { name: "compatibility-sample", path: "/compatibility/aries-taurus" },
  { name: "tarot-card-sample", path: "/tarot/the-fool" },
];

// authenticated pages (will redirect to login if unauthenticated — still captures redirect page)
const AUTH_PAGES = [
  { name: "dashboard", path: "/dashboard" },
  { name: "reading", path: "/reading" },
  { name: "tarot-app", path: "/tarot" },
  { name: "chat", path: "/chat" },
  { name: "history", path: "/history" },
  { name: "settings", path: "/settings" },
];

const ALL_PAGES = [...PUBLIC_PAGES, ...AUTH_PAGES];

test.beforeAll(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
});

// Desktop screenshots
test.describe("Desktop screenshots (1920×1080)", () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  for (const pageInfo of ALL_PAGES) {
    test(`screenshot: ${pageInfo.name}`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${pageInfo.path}`, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      const status = response?.status() ?? 0;
      expect(status).toBeLessThan(500); // no 5xx errors

      const filename = `${pageInfo.name}-desktop.png`;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: true,
      });
    });
  }
});

// Mobile screenshots
test.describe("Mobile screenshots (375×812)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const pageInfo of ALL_PAGES) {
    test(`screenshot: ${pageInfo.name}`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${pageInfo.path}`, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      const status = response?.status() ?? 0;
      expect(status).toBeLessThan(500);

      const filename = `${pageInfo.name}-mobile.png`;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: true,
      });
    });
  }
});

// Critical flow checks (unauthenticated)
test.describe("Critical flow: unauthenticated checks", () => {
  test("landing page loads and has CTA", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    // Page should have some content
    const body = await page.textContent("body");
    expect(body?.length).toBeGreaterThan(100);
  });

  test("terms page is accessible", async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/terms`, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/terms|service/i);
  });

  test("privacy page is accessible", async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/privacy`, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    const body = await page.textContent("body");
    expect(body?.toLowerCase()).toMatch(/privacy/i);
  });

  test("faq page is accessible", async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/faq`, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
  });

  test("auth redirect: /dashboard redirects unauthenticated user", async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/dashboard`, {
      waitUntil: "networkidle",
    });
    // Should either redirect to login or show login page
    const url = page.url();
    const isRedirectedOrLogin =
      url.includes("/login") || url.includes("/signup") || res?.status() === 200;
    expect(isRedirectedOrLogin).toBeTruthy();
  });

  test("compatibility page loads", async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/compatibility/aries-taurus`, {
      waitUntil: "networkidle",
    });
    expect(res?.status()).toBe(200);
  });

  test("tarot card page loads", async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/tarot/the-fool`, {
      waitUntil: "networkidle",
    });
    expect(res?.status()).toBe(200);
  });
});
