import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({ test: { environment: "node" }, resolve: { alias: { fitness: path.resolve(__dirname, "src") } } });
