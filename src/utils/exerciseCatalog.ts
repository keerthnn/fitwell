import type { Exercise } from "fitness/utils/types";
export {
  exerciseCatalog,
  exerciseCategories,
  type ExerciseCatalogItem,
  type ExerciseCategory,
} from "fitness/utils/workoutCatalog";

export const muscleGroupImageSources: Partial<Record<string, string>> = {
  Chest: "/muscle-groups/chest.png",
  Back: "/muscle-groups/back.png",
  Legs: "/muscle-groups/legs.png",
  Biceps: "/muscle-groups/biceps.png",
  Triceps: "/muscle-groups/triceps.png",
  Shoulders: "/muscle-groups/shoulders.png",
  Quads: "/muscle-groups/quads.png",
  Hamstrings: "/muscle-groups/hamstrings.png",
  Calves: "/muscle-groups/calves.png",
  Glutes: "/muscle-groups/glutes.png",
  "Upper Back": "/muscle-groups/upper-back.png",
  "Middle Back": "/muscle-groups/upper-back.png",
  "Lower Back": "/muscle-groups/lower-back.png",
  "Upper Abs": "/muscle-groups/upper-abs.png",
  "Lower Abs": "/muscle-groups/lower-abs.png",
  Obliques: "/muscle-groups/obliques.png",
  "Total Abs": "/muscle-groups/total-abs.png",
  Traps: "/muscle-groups/upper-back.png",
  Forearms: "/muscle-groups/biceps.png",
  "Full Body": "/muscle-groups/full-body.png",
};

export interface ExerciseMuscleGroup {
  label: string;
  category: string;
  region: string;
  imageSrc: string;
}

export const exerciseMuscleGroups: ExerciseMuscleGroup[] = [
  { label: "Chest", category: "Chest", region: "Chest", imageSrc: muscleGroupImageSources.Chest! },
  { label: "Biceps", category: "Biceps", region: "Biceps", imageSrc: muscleGroupImageSources.Biceps! },
  { label: "Triceps", category: "Triceps", region: "Triceps", imageSrc: muscleGroupImageSources.Triceps! },
  { label: "Shoulders", category: "Shoulders", region: "Shoulders", imageSrc: muscleGroupImageSources.Shoulders! },
  { label: "Quads", category: "Legs", region: "Quads", imageSrc: muscleGroupImageSources.Quads! },
  { label: "Hamstrings", category: "Legs", region: "Hamstrings", imageSrc: muscleGroupImageSources.Hamstrings! },
  { label: "Calves", category: "Legs", region: "Calves", imageSrc: muscleGroupImageSources.Calves! },
  { label: "Glutes", category: "Legs", region: "Glutes", imageSrc: muscleGroupImageSources.Glutes! },
  { label: "Upper Back", category: "Back", region: "Upper Back", imageSrc: muscleGroupImageSources["Upper Back"]! },
  { label: "Middle Back", category: "Back", region: "Middle Back", imageSrc: muscleGroupImageSources["Middle Back"]! },
  { label: "Lower Back", category: "Back", region: "Lower Back", imageSrc: muscleGroupImageSources["Lower Back"]! },
  { label: "Upper Abs", category: "Abs", region: "Upper Abs", imageSrc: muscleGroupImageSources["Upper Abs"]! },
  { label: "Lower Abs", category: "Abs", region: "Lower Abs", imageSrc: muscleGroupImageSources["Lower Abs"]! },
  { label: "Obliques", category: "Abs", region: "Obliques", imageSrc: muscleGroupImageSources.Obliques! },
  { label: "Total Abs", category: "Abs", region: "Total Abs", imageSrc: muscleGroupImageSources["Total Abs"]! },
  { label: "Traps", category: "Traps", region: "Traps", imageSrc: muscleGroupImageSources.Traps! },
  { label: "Forearms", category: "Forearms", region: "Forearms", imageSrc: muscleGroupImageSources.Forearms! },
  { label: "Full Body", category: "Full Body", region: "Full Body", imageSrc: muscleGroupImageSources["Full Body"]! },
];

function normalized(value?: string | null) {
  return value?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
}

export function getExerciseMuscleGroup(exercise: Pick<Exercise, "category" | "region">) {
  const region = normalized(exercise.region);
  const exact = exerciseMuscleGroups.find((group) => normalized(group.region) === region);
  if (exact) return exact;
  if (exercise.category === "Quadriceps") return exerciseMuscleGroups.find((group) => group.label === "Quads");
  if (exercise.category === "Hamstrings") return exerciseMuscleGroups.find((group) => group.label === "Hamstrings");
  if (exercise.category === "Glutes") return exerciseMuscleGroups.find((group) => group.label === "Glutes");
  if (exercise.category === "Calves") return exerciseMuscleGroups.find((group) => group.label === "Calves");
  if (exercise.category === "Legs") {
    if (region.includes("hamstring")) return exerciseMuscleGroups.find((group) => group.label === "Hamstrings");
    if (region.includes("glute")) return exerciseMuscleGroups.find((group) => group.label === "Glutes");
    if (region.includes("calf") || region.includes("calves")) return exerciseMuscleGroups.find((group) => group.label === "Calves");
    return exerciseMuscleGroups.find((group) => group.label === "Quads");
  }
  if (exercise.category === "Back") return exerciseMuscleGroups.find((group) => group.label === "Middle Back");
  if (exercise.category === "Abs") return exerciseMuscleGroups.find((group) => group.label === "Total Abs");
  return exerciseMuscleGroups.find((group) => group.category === exercise.category);
}

export function getMuscleGroupImageSource(exercise: Pick<Exercise, "category" | "region">) {
  return getExerciseMuscleGroup(exercise)?.imageSrc ?? muscleGroupImageSources[exercise.category];
}
