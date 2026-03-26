import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    coverage: {
      exclude: [
        "app/**",
        "components/**",
        "content/.state/**",
        "content/examples/**",
        "content/recovered-drafts/**",
        "content/submit-here/**",
        "dist/**",
        "node_modules/**",
      ],
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        branches: 85,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
