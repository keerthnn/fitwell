import {
  resolveExerciseImageCandidates,
  resolveMuscleImageCandidates,
} from "fitness/lib/images/assetRegistry";
import type { Exercise } from "fitness/utils/types";

export {
  exerciseCatalog,
  exerciseCategories,
  type ExerciseCatalogItem,
  type ExerciseCategory,
} from "fitness/utils/workoutCatalog";

export function getMuscleGroupImageSource(
  exercise: Pick<Exercise, "category" | "primaryMuscle">,
) {
  return (
    resolveMuscleImageCandidates(exercise.primaryMuscle)[0]?.src ??
    resolveMuscleImageCandidates(exercise.category)[0]?.src ??
    "/images/fallbacks/full-body.png"
  );
}

export function resolveExerciseImage(exercise: Exercise) {
  return (
    resolveExerciseImageCandidates(exercise)[0]?.src ??
    "/images/fallbacks/full-body.png"
  );
}
