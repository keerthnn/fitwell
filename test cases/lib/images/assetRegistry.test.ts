import { describe, expect, it } from "vitest";
import {
  resolveExerciseImageCandidates,
  resolveWorkoutImageCandidates,
} from "fitness/lib/images/assetRegistry";
import type { ExerciseImageMetadata, WorkoutListItem } from "fitness/utils/types";

const workout = (overrides: Partial<WorkoutListItem> = {}): WorkoutListItem => ({
  id: "workout-1",
  name: "Push workout",
  workoutDate: "2026-09-19T00:00:00.000Z",
  status: "COMPLETED",
  entryMode: "QUICK_ENTRY",
  durationMinutes: 45,
  exerciseCount: 1,
  representativeExercise: {
    name: "Unmapped Chest Exercise",
    imagePath: null,
    equipmentImagePath: null,
    equipment: "BARBELL",
    primaryMuscle: "Chest",
    category: "Chest",
    movement: "PUSH",
  },
  sourcePlanCoverImagePath: null,
  sourcePlanCategory: null,
  ...overrides,
});

describe("workout image resolution", () => {
  it("uses a workout WebP instead of a representative muscle image", () => {
    const candidates = resolveWorkoutImageCandidates(workout());

    expect(candidates[0]).toMatchObject({
      src: "/images/workouts/push-768.webp",
      kind: "generated",
    });
    expect(candidates.every(({ src }) => !src.includes("/muscle-groups/"))).toBe(
      true,
    );
  });

  it("keeps a source plan cover ahead of the mapped workout WebP", () => {
    const candidates = resolveWorkoutImageCandidates(
      workout({
        name: "Monday session",
        sourcePlanCoverImagePath:
          "/images/workout-plans/covers/pull-day-simple-768.webp",
        sourcePlanCategory: "Pull",
      }),
    );

    expect(candidates.map(({ src }) => src)).toEqual([
      "/images/workout-plans/covers/pull-day-simple-768.webp",
      "/images/workouts/pull-768.webp",
      "/images/workouts/strength-768.webp",
    ]);
  });
});

describe("EXERCISE-009 exercise image resolution", () => {
  it("uses a name-matched WebP and excludes muscle-group candidates", () => {
    const exercise: ExerciseImageMetadata = {
      name: "Assisted Dip Machine",
      imagePath: null,
      equipmentImagePath: null,
      equipment: "MACHINE",
      primaryMuscle: "Triceps",
      category: "Triceps",
      movement: "PUSH",
    };

    const candidates = resolveExerciseImageCandidates(exercise);

    expect(candidates[0]).toMatchObject({
      src: "/images/exercises/specific/assisted-dip-machine-512.webp",
      kind: "specific",
    });
    expect(candidates.every(({ src }) => !src.includes("/muscle-groups/"))).toBe(
      true,
    );
  });
});
