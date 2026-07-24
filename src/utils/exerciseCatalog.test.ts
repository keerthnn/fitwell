import { describe, expect, it } from "vitest";

import {
  exerciseCatalog,
  getExerciseMuscleGroup,
  getMuscleGroupImageSource,
} from "fitness/utils/exerciseCatalog";
import { workoutTemplateCatalog } from "fitness/utils/workoutTemplateCatalog";

describe("exercise catalog", () => {
  it("provides a muscle group and icon for every exercise", () => {
    for (const exercise of exerciseCatalog) {
      expect(getExerciseMuscleGroup(exercise), exercise.name).toBeDefined();
      expect(getMuscleGroupImageSource(exercise), exercise.name).toBeTruthy();
    }
  });

  it("uses catalog exercises in every workout template", () => {
    const exerciseKeys = new Set(
      exerciseCatalog.map((exercise) => `${exercise.name}:${exercise.equipment}`),
    );
    const templateSlugs = new Set<string>();

    for (const template of workoutTemplateCatalog) {
      expect(templateSlugs.has(template.slug), template.slug).toBe(false);
      templateSlugs.add(template.slug);
      expect(template.exercises.length, template.title).toBeGreaterThan(0);
      for (const exercise of template.exercises) {
        expect(
          exerciseKeys.has(`${exercise.name}:${exercise.equipment}`),
          `${template.title}: ${exercise.name}`,
        ).toBe(true);
      }
    }
  });
});
