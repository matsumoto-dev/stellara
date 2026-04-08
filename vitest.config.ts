import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next", "dist", "coverage"],
    coverage: {
      provider: "v8",
      include: ["lib/**", "app/**"],
      exclude: [
        "**/*.test.*",
        "**/*.d.ts",
        "**/*.css",
        "app/**/layout.tsx",
        "app/api/**",
        "app/**/page.tsx",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    setupFiles: ["./tests/setup.ts"],
  },
});
