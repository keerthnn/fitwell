import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test cases/**/*.test.ts", "test cases/**/*.test.tsx"],
  },
  resolve: { alias: { fitness: path.resolve(__dirname, "src") } },
});
