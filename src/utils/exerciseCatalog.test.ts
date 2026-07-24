import { describe, expect, it } from "vitest";
import { exerciseCatalog, getMuscleGroupImageSource } from "fitness/utils/exerciseCatalog";

describe("exercise catalogue", () => {
  it("contains the complete local seed catalogue", () => {
    expect(exerciseCatalog).toHaveLength(246);
    expect(new Set(exerciseCatalog.map((item) => `${item.name}:${item.equipment}`)).size).toBe(246);
  });

  it("resolves a muscle fallback for catalogue exercises", () => {
    for (const exercise of exerciseCatalog) {
      expect(
        getMuscleGroupImageSource({
          category: exercise.category,
          primaryMuscle: exercise.region ?? exercise.category,
        }),
      ).toBeTruthy();
    }
  });
});
