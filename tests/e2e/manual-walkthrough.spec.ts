/**
 * Manual E2E walkthrough against the PRODUCTION deployment.
 * Simulates a real user clicking through every feature and captures screenshots + findings.
 *
 * Run with:
 *   npx playwright test tests/e2e/manual-walkthrough.spec.ts --config=tests/e2e/manual-walkthrough.config.ts
 */
import { expect, test } from "@playwright/test";

const PROD_URL = "https://www.stellara.chat";
const SCREENSHOT_DIR = "reviews/e2e-manual";

test.describe.configure({ mode: "serial" });

test.describe("Stellara Production Walkthrough", () => {
  test.setTimeout(180_000);

  test("01 - ランディングページ表示", async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-landing.png`, fullPage: true });
    const title = await page.title();
    console.log(`[landing] title=${title}`);
  });

  test("02 - ログインページ表示", async ({ page }) => {
    await page.goto(`${PROD_URL}/login`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-login.png`, fullPage: true });
  });

  test("03 - デモログイン実行", async ({ page }) => {
    await page.goto(`${PROD_URL}/login`);
    await page.waitForLoadState("networkidle");

    // デモボタンを探す
    const demoButton = page.getByRole("button", { name: /デモ/ });
    const visible = await demoButton.isVisible().catch(() => false);
    console.log(`[demo] button visible=${visible}`);

    if (visible) {
      await demoButton.click();
      await page.waitForURL(/\/dashboard|\/login/, { timeout: 15000 }).catch(() => {});
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/03-after-demo-login.png`,
        fullPage: true,
      });
      console.log(`[demo] landed at ${page.url()}`);
    }
  });

  test("04 - ダッシュボード", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.goto(`${PROD_URL}/dashboard`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000); // Wait for horoscope load
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-dashboard.png`, fullPage: true });

    // チェック: エラーメッセージが表示されていないか
    const errorText = await page.locator("text=/error|失敗|not found/i").allTextContents();
    console.log(`[dashboard] errors=${JSON.stringify(errorText)}`);
  });

  test("05 - パーソナル鑑定ページ", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.goto(`${PROD_URL}/reading`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-reading-empty.png`, fullPage: true });

    // フォームに入力して送信
    const textarea = page.locator("textarea").first();
    if (await textarea.isVisible().catch(() => false)) {
      await textarea.fill("最近仕事で悩んでいます。アドバイスをください。");
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/05-reading-filled.png`,
        fullPage: true,
      });

      const submitBtn = page.getByRole("button", { name: /鑑定/ }).first();
      await submitBtn.click();
      await page.waitForTimeout(15000); // Wait for Claude API
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/05-reading-result.png`,
        fullPage: true,
      });
    }
  });

  test("06 - タロット鑑定ページ", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.goto(`${PROD_URL}/tarot`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-tarot-empty.png`, fullPage: true });

    // カードを引く
    const drawBtn = page.getByRole("button", { name: /カードを引く|引く/ }).first();
    if (await drawBtn.isVisible().catch(() => false)) {
      await drawBtn.click();
      await page.waitForTimeout(15000); // Wait for Claude API
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/06-tarot-result.png`,
        fullPage: true,
      });
    }
  });

  test("07 - チャットページ", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.goto(`${PROD_URL}/chat`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-chat-empty.png`, fullPage: true });

    const input = page.locator("textarea, input[type=text]").first();
    if (await input.isVisible().catch(() => false)) {
      await input.fill("こんにちは、今日の運勢は？");
      const sendBtn = page.getByRole("button").filter({ hasText: /送信|聞|ask/i }).first();
      if (await sendBtn.isVisible().catch(() => false)) {
        await sendBtn.click();
        await page.waitForTimeout(15000);
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/07-chat-response.png`,
          fullPage: true,
        });
      }
    }
  });

  test("08 - 履歴ページ", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.goto(`${PROD_URL}/history`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08-history.png`, fullPage: true });
  });

  test("09 - 設定ページ", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.goto(`${PROD_URL}/settings`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-settings.png`, fullPage: true });
  });

  test("10 - モバイル表示(ダッシュボード)", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    });
    const page = await context.newPage();
    await loginAsDemoUser(page);
    await page.goto(`${PROD_URL}/dashboard`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/10-mobile-dashboard.png`, fullPage: true });
    await context.close();
  });
});

async function loginAsDemoUser(page: import("@playwright/test").Page) {
  await page.goto(`${PROD_URL}/login`);
  await page.waitForLoadState("networkidle");
  const demoButton = page.getByRole("button", { name: /デモ/ });
  if (await demoButton.isVisible().catch(() => false)) {
    await demoButton.click();
    await page.waitForURL(/\/dashboard/, { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState("networkidle");
  }
}
