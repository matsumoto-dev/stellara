import { defineConfig } from "@playwright/test";

/**
 * Config for manual walkthrough against PRODUCTION.
 * Does NOT spawn a local dev server.
 */
export default defineConfig({
  testDir: ".",
  testMatch: "manual-walkthrough.spec.ts",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", viewport: { width: 1280, height: 800 } },
    },
  ],
});
