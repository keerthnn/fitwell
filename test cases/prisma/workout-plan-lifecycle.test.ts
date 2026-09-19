import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");

function model(name: string) {
  const match = schema.match(new RegExp(`model ${name} \\{([\\s\\S]*?)\\n\\}`));
  if (!match) throw new Error(`Missing Prisma model ${name}`);
  return match[1];
}

describe("PLAN-012 DATA-002 workout-plan deletion lifecycle", () => {
  it("cascades plan prescriptions", () => {
    expect(model("WorkoutPlanExercise")).toMatch(
      /workoutPlan\s+WorkoutPlan\s+@relation\([^\n]*onDelete:\s*Cascade\)/,
    );
  });

  it("clears only the optional source-plan link on historical workouts", () => {
    const workout = model("Workout");

    expect(workout).toMatch(
      /sourceWorkoutPlan\s+WorkoutPlan\?\s+@relation\([^\n]*onDelete:\s*SetNull\)/,
    );
    expect(workout).toMatch(/exercises\s+WorkoutExercise\[\]/);
    expect(model("WorkoutSet")).toMatch(
      /workoutExercise\s+WorkoutExercise\s+@relation/,
    );
  });
});
