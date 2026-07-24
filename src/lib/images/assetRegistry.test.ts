import { nextImageIndex } from "fitness/components/common/FitWellImage";
import {
  isApprovedLocalImagePath,
  resolveExerciseImageCandidates,
  resolveMuscleImageCandidates,
  resolveWorkoutImageCandidates,
} from "fitness/lib/images/assetRegistry";
import { describe, expect, it } from "vitest";

const exercise = {
  name: "Barbell Bench Press",
  imagePath: "https://example.com/bench.png",
  equipmentImagePath: "/images/equipment/barbell-icon.svg",
  equipment: "BARBELL",
  primaryMuscle: "Chest",
  category: "Chest",
  movement: "PUSH",
};

describe("FitWell image registry", () => {
  it("rejects external and deprecated image paths", () => {
    expect(isApprovedLocalImagePath("https://example.com/a.png")).toBe(false);
    expect(
      isApprovedLocalImagePath("/images/exercises/featured/old.svg"),
    ).toBe(false);
    expect(
      isApprovedLocalImagePath("/images/exercises/specific/push-up.svg"),
    ).toBe(false);
    expect(
      isApprovedLocalImagePath("/images/exercises/specific/push-up-512.webp"),
    ).toBe(true);
  });

  it("resolves specific, targeted muscle, equipment, then fallback", () => {
    const candidates = resolveExerciseImageCandidates(exercise);
    expect(candidates[0]?.src).toBe(
      "/images/exercises/specific/barbell-bench-press-512.webp",
    );
    expect(candidates.at(-1)?.src).toBe("/images/fallbacks/full-body.png");
    expect(candidates.map((item) => item.kind)).toContain("equipment");
    expect(candidates.map((item) => item.kind)).toContain("muscle");
    expect(candidates.map((item) => item.kind)).toContain("generated");
  });

  it("keeps the approved anatomical PNG as the glutes visual", () => {
    expect(resolveMuscleImageCandidates("Gluteus maximus")[0]).toEqual({
      src: "/images/muscle-groups/back/glutes.png",
      kind: "muscle",
    });
  });

  it("derives a workout visual from its representative exercise", () => {
    const candidates = resolveWorkoutImageCandidates({
      id: "workout",
      name: "Push session",
      workoutDate: "2026-07-24T00:00:00.000Z",
      status: "COMPLETED",
      entryMode: "LIVE",
      durationMinutes: 45,
      exerciseCount: 1,
      representativeExercise: exercise,
      sourcePlanCoverImagePath: null,
      sourcePlanCategory: null,
    });
    expect(candidates[0]?.src).toContain("barbell-bench-press");
    expect(candidates.at(-1)?.src).toBe("/images/workouts/strength-768.webp");
  });

  it("advances candidates and exhausts after the final failure", () => {
    expect(nextImageIndex(0, 3)).toBe(1);
    expect(nextImageIndex(2, 3)).toBeNull();
  });
});
