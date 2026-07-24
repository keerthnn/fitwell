import { describe, expect, it } from "vitest";
import { validateProfile } from "./profile";
import { validateCreateWorkout, validateSets } from "./workout";
import { validateWorkoutPlan } from "./workout-plan";

describe("Version 1 runtime validators", () => {
  it("returns field-level profile errors", () => {
    const result = validateProfile({});
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.some((error) => error.field === "firstName")).toBe(true);
  });

  it("rejects negative workout values", () => {
    const result = validateSets({
      workoutExerciseId: "workout-exercise",
      sets: [{ setNumber: 1, reps: -1, weightKg: -2, isCompleted: true }],
    });
    expect(result.valid).toBe(false);
  });

  it("preserves selected exercises when creating a workout", () => {
    const result = validateCreateWorkout({
      name: "Upper body",
      workoutDate: new Date().toISOString(),
      entryMode: "LIVE",
      exerciseIds: ["exercise-one", "exercise-two"],
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.exerciseIds).toEqual([
        "exercise-one",
        "exercise-two",
      ]);
    }
  });

  it("requires exercises in a Workout Plan", () => {
    const result = validateWorkoutPlan({
      name: "Strength",
      difficulty: "BEGINNER",
      category: "Strength",
      daysPerWeek: 3,
      exercises: [],
    });
    expect(result.valid).toBe(false);
  });
});
