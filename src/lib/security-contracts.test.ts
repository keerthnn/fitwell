import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(path, "utf8");
const filesUnder = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });

describe("Version 1 security contracts", () => {
  it("keeps user workout reads ownership-scoped", () => {
    const handler = source("src/pages/api/workouts/get-workout-by-id.ts");
    expect(handler).toContain("getUserIdOrSetError");
    expect(handler).toMatch(/where:\s*\{\s*id,\s*userId/);
  });

  it("requires explicit built-in plan visibility", () => {
    const access = source("src/lib/workoutPlans/access.ts");
    expect(access).toContain("userId: null, isBuiltIn: true");
    expect(access).toContain("userId, isBuiltIn: false");
  });

  it("protects every admin API with requireAdmin", () => {
    const handlers = filesUnder("src/pages/api/admin").filter((path) => path.endsWith(".ts"));
    expect(handlers.length).toBeGreaterThan(0);
    for (const path of handlers) {
      expect(source(path), path).toContain("requireAdmin");
    }
  });

  it("never deletes Firebase Authentication identities", () => {
    const forbiddenCall = ["adminAuth", "deleteUser"].join(".");
    const files = [...filesUnder("src"), ...filesUnder("scripts")].filter((path) =>
      /\.(ts|tsx|mjs)$/.test(path),
    );
    for (const path of files) {
      expect(source(path), path).not.toContain(forbiddenCall);
    }
  });
});
