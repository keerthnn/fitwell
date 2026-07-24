import type { Exercise } from "fitness/utils/types";

export {
  exerciseCatalog,
  exerciseCategories,
  type ExerciseCatalogItem,
  type ExerciseCategory,
} from "fitness/utils/workoutCatalog";

export const muscleGroupImageSources: Record<string, string> = {
  Chest: "/images/muscles/front/chest.svg",
  Back: "/images/muscles/back/back.svg",
  Biceps: "/images/muscles/front/biceps.svg",
  Triceps: "/images/muscles/back/triceps.svg",
  Shoulders: "/images/muscles/front/shoulders.svg",
  Quadriceps: "/images/muscles/front/quadriceps.svg",
  Hamstrings: "/images/muscles/back/hamstrings.svg",
  Calves: "/images/muscles/back/calves.svg",
  Glutes: "/images/muscles/back/glutes.svg",
  Abs: "/images/muscles/front/abs.svg",
  Traps: "/images/muscles/back/traps.svg",
  Forearms: "/images/muscles/front/forearms.svg",
  "Full Body": "/images/exercises/fallback.svg",
};

export function getMuscleGroupImageSource(
  exercise: Pick<Exercise, "category" | "primaryMuscle">,
) {
  return (
    muscleGroupImageSources[exercise.primaryMuscle] ??
    muscleGroupImageSources[exercise.category] ??
    "/images/exercises/fallback.svg"
  );
}

export function resolveExerciseImage(exercise: Exercise) {
  return (
    exercise.imagePath ??
    exercise.equipmentImagePath ??
    getMuscleGroupImageSource(exercise) ??
    "/images/exercises/fallback.svg"
  );
}
