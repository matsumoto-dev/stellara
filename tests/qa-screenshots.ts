/**
 * QA Screenshot Script — stellara.chat
 * 公開ページ + 認証済み画面のデスクトップ・モバイルスクショを撮影する
 * 実行: cd services/ai-astrology && npx tsx tests/qa-screenshots.ts
 */

import { chromium, type Page, type BrowserContext } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

const BASE_URL = "https://stellara.chat";
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

const QA_EMAIL = getRequiredEnv("QA_TEST_EMAIL");
const QA_PASSWORD = getRequiredEnv("QA_TEST_PASSWORD");

const today = new Date().toISOString().split("T")[0];
const OUTPUT_DIR = path.join(__dirname, "../reviews/qa-screenshots", today);

const PUBLIC_PAGES = [
  { name: "landing", path: "/" },
  { name: "login", path: "/login" },
  { name: "signup", path: "/signup" },
  { name: "terms", path: "/terms" },
  { name: "privacy", path: "/privacy" },
  { name: "faq", path: "/faq" },
  { name: "compatibility-sample", path: "/compatibility/aries-and-taurus" },
  { name: "tarot-card-sample", path: "/tarot/the-fool" },
];

const AUTH_PAGES = [
  { name: "dashboard", path: "/dashboard" },
  { name: "reading", path: "/reading" },
  { name: "chat", path: "/chat" },
  { name: "tarot-app", path: "/tarot" },
  { name: "settings", path: "/settings" },
  { name: "history", path: "/history" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "mobile", width: 375, height: 812 },
] as const;

type Result = { page: string; viewport: string; path: string; status: number; authenticated: boolean };

async function capturePages(
  context: BrowserContext,
  pages: typeof PUBLIC_PAGES,
  authenticated: boolean,
): Promise<Result[]> {
  const results: Result[] = [];

  for (const viewport of VIEWPORTS) {
    const page = await context.newPage();
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const pageInfo of pages) {
      const url = `${BASE_URL}${pageInfo.path}`;
      const filename = `${pageInfo.name}-${viewport.name}.png`;
      const outputPath = path.join(OUTPUT_DIR, filename);

      try {
        const response = await page.goto(url, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        const status = response?.status() ?? 0;
        await page.waitForTimeout(1000);
        await page.screenshot({ path: outputPath, fullPage: false });

        // Check if we got redirected to login (auth failure)
        const currentUrl = page.url();
        const redirected = currentUrl.includes("/login") && !pageInfo.path.includes("/login");
        const label = redirected ? "⚠ REDIRECTED" : "✓";
        console.log(`${label} [${viewport.name}] ${pageInfo.name} (${status}) → ${filename}`);

        results.push({ page: pageInfo.name, viewport: viewport.name, path: outputPath, status, authenticated });
      } catch (err) {
        console.error(`✗ [${viewport.name}] ${pageInfo.name} — ${(err as Error).message}`);
        results.push({ page: pageInfo.name, viewport: viewport.name, path: "", status: 0, authenticated });
      }
    }

    await page.close();
  }

  return results;
}

async function login(context: BrowserContext): Promise<boolean> {
  const page = await context.newPage();
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 30000 });
    await page.fill('input[type="email"], input[name="email"]', QA_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', QA_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard**", { timeout: 15000 });
    console.log("✓ Login successful\n");
    await page.close();
    return true;
  } catch (err) {
    console.error(`✗ Login failed: ${(err as Error).message}\n`);
    await page.close();
    return false;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`\nQA Screenshots — ${today}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  const browser = await chromium.launch({ headless: true });
  const allResults: Result[] = [];

  // Phase 1: Public pages (no auth)
  console.log("--- Public Pages ---");
  const publicContext = await browser.newContext();
  allResults.push(...await capturePages(publicContext, PUBLIC_PAGES, false));
  await publicContext.close();

  // Phase 2: Authenticated pages
  console.log("\n--- Authenticated Pages ---");
  const authContext = await browser.newContext();
  const loggedIn = await login(authContext);

  if (loggedIn) {
    allResults.push(...await capturePages(authContext, AUTH_PAGES, true));
  } else {
    console.error("Skipping authenticated pages — login failed");
  }
  await authContext.close();

  await browser.close();

  // Save results
  const resultsPath = path.join(OUTPUT_DIR, "results.json");
  fs.writeFileSync(resultsPath, JSON.stringify(allResults, null, 2));

  console.log(`\n--- Summary ---`);
  console.log(`Total screenshots: ${allResults.filter(r => r.path).length}`);
  console.log(`Public: ${PUBLIC_PAGES.length * 2}`);
  console.log(`Authenticated: ${loggedIn ? AUTH_PAGES.length * 2 : 0}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
