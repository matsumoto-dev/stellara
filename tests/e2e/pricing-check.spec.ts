/**
 * Verify the landing page pricing section layout on production.
 */
import { test } from "@playwright/test";

test("pricing section buttons aligned", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("https://www.stellara.chat");
  await page.waitForLoadState("networkidle");

  // Scroll to the pricing section
  const pricingHeading = page.getByRole("heading", { name: /料金プラン|Pricing/ });
  await pricingHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Full page screenshot for context
  await page.screenshot({
    path: "reviews/e2e-manual/pricing-full.png",
    fullPage: true,
  });

  // Focused screenshot of the pricing area
  const pricingSection = pricingHeading.locator("xpath=ancestor::section[1]");
  await pricingSection.screenshot({
    path: "reviews/e2e-manual/pricing-section.png",
  });
});
