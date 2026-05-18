import { expect, test } from "@playwright/test";

test.describe("Star Chat", () => {
  test("page renders with empty state", async ({ page }) => {
    await page.goto("/chat");

    await expect(page.getByRole("heading", { name: /star chat/i })).toBeVisible();
    await expect(page.getByText(/begin your conversation/i)).toBeVisible();
    await expect(page.locator("input[type='text']")).toBeVisible();
  });

  test("sends message and receives response", async ({ page }) => {
    await page.route("**/api/reading", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            content: "The stars suggest focusing on inner peace today.",
            type: "chat",
            rejected: false,
          },
        }),
      }),
    );

    await page.goto("/chat");

    await page.locator("input[type='text']").fill("What should I focus on today?");
    await page.getByRole("button", { name: /send/i }).click();

    // User message should appear
    await expect(page.getByText(/what should i focus on/i)).toBeVisible();

    // Assistant response should appear
    await expect(page.getByText(/inner peace/i)).toBeVisible();
  });

  test("shows turn counter", async ({ page }) => {
    await page.goto("/chat");

    // Turn counter should show 0/5
    await expect(page.getByText(/0\/5 turns used/i)).toBeVisible();
  });

  test("shows limit reached message after max turns", async ({ page }) => {
    let callCount = 0;
    await page.route("**/api/reading", (route) => {
      callCount++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            content: `Response ${callCount}`,
            type: "chat",
            rejected: false,
          },
        }),
      });
    });

    await page.goto("/chat");

    // Send 5 messages to reach the limit
    for (let i = 0; i < 5; i++) {
      await page.locator("input[type='text']").fill(`Message ${i + 1}`);
      await page.getByRole("button", { name: /send/i }).click();
      await expect(page.getByText(`Response ${i + 1}`)).toBeVisible();
    }

    // Limit message should appear
    await expect(page.getByText(/reached the turn limit/i)).toBeVisible();
    await expect(page.getByText(/upgrade to pro/i)).toBeVisible();
  });
});
