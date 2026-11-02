import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vite.config.ts",
    test: {
      include: ["**/*.node.test.{js,jsx,ts,tsx}"],
      name: "happy-dom",
      environment: "happy-dom",
    },
  },
  {
    extends: "./vite.config.ts",
    test: {
      setupFiles: ["vitest-browser-react"],
      include: ["**/*.browser.test.{js,jsx,ts,tsx}"],
      name: "browser",
      browser: {
        provider: "playwright",
        enabled: true,
        name: "firefox",
      },
    },
  },
]);