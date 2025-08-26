import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
    alias: {
      "@/generated-types/type-defs": "@/__mock__/types",
    },
    environment: "node",
  },
});
