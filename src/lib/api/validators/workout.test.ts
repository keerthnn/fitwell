import { describe, expect, it } from "vitest";
import {
  validateSets,
  validateSetsForTrackingType,
} from "./workout";

const validSet = {
  setNumber: 1,
  reps: 8,
  weightKg: 20,
  durationSeconds: null,
  distanceMeters: null,
  restSeconds: 90,
  isCompleted: false,
};

describe("validateSetsForTrackingType", () => {
  it("requires reps and weight for weight-tracked sets", () => {
    const result = validateSetsForTrackingType(
      [{ ...validSet, reps: null, weightKg: null }],
      "REPS_WEIGHT",
    );

    expect(result).toEqual({
      valid: false,
      errors: [
        { field: "sets.0.reps", message: "Reps are required" },
        { field: "sets.0.weightKg", message: "Weight is required" },
      ],
    });
  });

  it("rejects zero reps but preserves zero as a valid entered weight", () => {
    expect(
      validateSetsForTrackingType(
        [{ ...validSet, reps: 0, weightKg: 0 }],
        "REPS_WEIGHT",
      ),
    ).toEqual({
      valid: false,
      errors: [
        { field: "sets.0.reps", message: "Reps must be at least 1" },
      ],
    });

    expect(
      validateSetsForTrackingType(
        [{ ...validSet, reps: 1, weightKg: 0 }],
        "REPS_WEIGHT",
      ).valid,
    ).toBe(true);
  });

  it("requires only reps for reps-only exercises", () => {
    expect(
      validateSetsForTrackingType(
        [{ ...validSet, reps: 10, weightKg: null }],
        "REPS_ONLY",
      ).valid,
    ).toBe(true);
    expect(
      validateSetsForTrackingType(
        [{ ...validSet, reps: null, weightKg: null }],
        "REPS_ONLY",
      ),
    ).toEqual({
      valid: false,
      errors: [{ field: "sets.0.reps", message: "Reps are required" }],
    });
  });

  it("requires duration for duration-tracked exercises", () => {
    expect(
      validateSetsForTrackingType(
        [{ ...validSet, reps: null, weightKg: null, durationSeconds: null }],
        "DURATION",
      ),
    ).toEqual({
      valid: false,
      errors: [
        { field: "sets.0.durationSeconds", message: "Duration is required" },
      ],
    });
  });

  it("requires distance for distance-tracked exercises", () => {
    expect(
      validateSetsForTrackingType(
        [{ ...validSet, reps: null, weightKg: null, distanceMeters: null }],
        "DISTANCE",
      ),
    ).toEqual({
      valid: false,
      errors: [
        { field: "sets.0.distanceMeters", message: "Distance is required" },
      ],
    });
  });

  it("requires both metrics for duration-and-distance exercises", () => {
    expect(
      validateSetsForTrackingType(
        [
          {
            ...validSet,
            reps: null,
            weightKg: null,
            durationSeconds: null,
            distanceMeters: null,
          },
        ],
        "DURATION_DISTANCE",
      ),
    ).toEqual({
      valid: false,
      errors: [
        { field: "sets.0.durationSeconds", message: "Duration is required" },
        { field: "sets.0.distanceMeters", message: "Distance is required" },
      ],
    });
  });
});

describe("validateSets", () => {
  it("normalizes blank rep and weight values so tracking validation rejects them", () => {
    const result = validateSets({
      workoutExerciseId: "workout-exercise-1",
      sets: [{ ...validSet, reps: null, weightKg: null }],
    });

    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(
      validateSetsForTrackingType(result.data.sets, "REPS_WEIGHT").valid,
    ).toBe(false);
  });
});
