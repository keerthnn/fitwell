import { describe, expect, it } from "vitest";
import type { WorkoutSet } from "fitness/utils/types";
import {
  DEFAULT_EXERCISE_REST_SECONDS,
  resolveExerciseRestSeconds,
  stampExerciseRestSeconds,
} from "./exerciseRest";

const workoutSet = (
  setNumber: number,
  restSeconds?: number | null,
): WorkoutSet => ({
  setNumber,
  restSeconds,
  isCompleted: false,
});

describe("exercise-wide rest", () => {
  it("uses the first ordered non-null set snapshot", () => {
    expect(
      resolveExerciseRestSeconds([
        workoutSet(3, 120),
        workoutSet(1, null),
        workoutSet(2, 60),
      ]),
    ).toBe(60);
  });

  it("preserves an explicit zero", () => {
    expect(
      resolveExerciseRestSeconds([workoutSet(1, 0), workoutSet(2, 90)]),
    ).toBe(0);
  });

  it("falls back when no set has a prescribed rest duration", () => {
    expect(
      resolveExerciseRestSeconds([workoutSet(1), workoutSet(2, null)]),
    ).toBe(DEFAULT_EXERCISE_REST_SECONDS);
  });

  it("stamps the exercise value onto every set without changing other data", () => {
    const sets = [
      { ...workoutSet(1, 30), reps: 8 },
      { ...workoutSet(2, 60), reps: 10 },
    ];

    expect(stampExerciseRestSeconds(sets, 45)).toEqual([
      { ...sets[0], restSeconds: 45 },
      { ...sets[1], restSeconds: 45 },
    ]);
    expect(sets.map((set) => set.restSeconds)).toEqual([30, 60]);
  });
});
