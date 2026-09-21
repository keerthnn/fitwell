import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const migrationPath =
  "prisma/migrations/20260921000000_add_workout_day_target_history/migration.sql";

describe("PROFILE-002 DATA-006 DES-001 DES-002 target history lifecycle", () => {
  it("defines an indexed profile-owned history model with cascade deletion", () => {
    expect(schema).toMatch(/model WorkoutDayTargetHistory \{/);
    expect(schema).toMatch(
      /userProfile\s+UserProfile\s+@relation\([^\n]*onDelete:\s*Cascade\)/,
    );
    expect(schema).toMatch(/@@index\(\[userProfileId, effectiveAt\]\)/);
  });

  it("normalizes and backfills before enforcing both 1-through-7 constraints", () => {
    expect(existsSync(migrationPath)).toBe(true);
    if (!existsSync(migrationPath)) return;
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toMatch(/UPDATE "UserProfile"[\s\S]*LEAST\(7, GREATEST\(1,/);
    expect(migration).toMatch(/INSERT INTO "WorkoutDayTargetHistory"/);
    expect(migration).toContain('"effectiveAt"');
    expect(migration.match(/CHECK \([^\n]*BETWEEN 1 AND 7\)/g)).toHaveLength(2);
    expect(migration).toContain("ON DELETE CASCADE");
    expect(migration).not.toMatch(/DELETE FROM "(UserProfile|Workout)"/);
  });
});
