import type { Exercise } from "fitness/utils/types";

export type ExerciseCatalogItem = Omit<Exercise, "id">;

export const exerciseCatalog: ExerciseCatalogItem[] = [
  { name: "Barbell Bench Press", equipment: "BARBELL", movement: "PUSH", category: "Chest", region: "Mid chest", isCompound: true },
  { name: "Incline Dumbbell Press", equipment: "DUMBBELL", movement: "PUSH", category: "Chest", region: "Upper chest", isCompound: true },
  { name: "Push-Up", equipment: "BODYWEIGHT", movement: "PUSH", category: "Chest", region: "Chest", isCompound: true },
  { name: "Cable Fly", equipment: "CABLE", movement: "PUSH", category: "Chest", region: "Chest", isCompound: false },
  { name: "Dumbbell Bicep Curl", equipment: "DUMBBELL", movement: "PULL", category: "Biceps", region: "Biceps", isCompound: false },
  { name: "Hammer Curl", equipment: "DUMBBELL", movement: "PULL", category: "Biceps", region: "Brachialis", isCompound: false },
  { name: "Barbell Curl", equipment: "BARBELL", movement: "PULL", category: "Biceps", region: "Biceps", isCompound: false },
  { name: "Cable Bicep Curl", equipment: "CABLE", movement: "PULL", category: "Biceps", region: "Biceps", isCompound: false },
  { name: "Tricep Pushdown", equipment: "CABLE", movement: "PUSH", category: "Triceps", region: "Triceps", isCompound: false },
  { name: "Overhead Dumbbell Extension", equipment: "DUMBBELL", movement: "PUSH", category: "Triceps", region: "Long head", isCompound: false },
  { name: "Skull Crusher", equipment: "BARBELL", movement: "PUSH", category: "Triceps", region: "Triceps", isCompound: false },
  { name: "Bench Dip", equipment: "BODYWEIGHT", movement: "PUSH", category: "Triceps", region: "Triceps", isCompound: true },
  { name: "Overhead Press", equipment: "BARBELL", movement: "PUSH", category: "Shoulders", region: "Front delts", isCompound: true },
  { name: "Dumbbell Lateral Raise", equipment: "DUMBBELL", movement: "PUSH", category: "Shoulders", region: "Side delts", isCompound: false },
  { name: "Dumbbell Front Raise", equipment: "DUMBBELL", movement: "PUSH", category: "Shoulders", region: "Front delts", isCompound: false },
  { name: "Face Pull", equipment: "CABLE", movement: "PULL", category: "Shoulders", region: "Rear delts", isCompound: false },
  { name: "Plank", equipment: "BODYWEIGHT", movement: "ISOMETRIC", category: "Abs", region: "Total Abs", isCompound: false },
  { name: "Cable Crunch", equipment: "CABLE", movement: "PUSH", category: "Abs", region: "Upper Abs", isCompound: false },
  { name: "Hanging Leg Raise", equipment: "BODYWEIGHT", movement: "ISOMETRIC", category: "Abs", region: "Lower Abs", isCompound: false },
  { name: "Russian Twist", equipment: "BODYWEIGHT", movement: "ROTATION", category: "Abs", region: "Obliques", isCompound: false },
  { name: "Barbell Back Squat", equipment: "BARBELL", movement: "SQUAT", category: "Legs", region: "Quads", isCompound: true },
  { name: "Romanian Deadlift", equipment: "BARBELL", movement: "HINGE", category: "Legs", region: "Hamstrings", isCompound: true },
  { name: "Leg Press", equipment: "MACHINE", movement: "SQUAT", category: "Legs", region: "Quads", isCompound: true },
  { name: "Walking Lunge", equipment: "DUMBBELL", movement: "LUNGE", category: "Legs", region: "Quads and glutes", isCompound: true },
  { name: "Standing Calf Raise", equipment: "BODYWEIGHT", movement: "PUSH", category: "Legs", region: "Calves", isCompound: false },
  { name: "Machine Calf Raise", equipment: "MACHINE", movement: "PUSH", category: "Legs", region: "Calves", isCompound: false },
  { name: "Barbell Hip Thrust", equipment: "BARBELL", movement: "HINGE", category: "Legs", region: "Glutes", isCompound: true },
  { name: "Cable Glute Kickback", equipment: "CABLE", movement: "HINGE", category: "Legs", region: "Glutes", isCompound: false },
  { name: "Barbell Row", equipment: "BARBELL", movement: "PULL", category: "Back", region: "Middle Back", isCompound: true },
  { name: "Lat Pulldown", equipment: "MACHINE", movement: "PULL", category: "Back", region: "Upper Back", isCompound: true },
  { name: "Seated Cable Row", equipment: "CABLE", movement: "PULL", category: "Back", region: "Middle Back", isCompound: true },
  { name: "Pull-Up", equipment: "BODYWEIGHT", movement: "PULL", category: "Back", region: "Upper Back", isCompound: true },
  { name: "Back Extension", equipment: "BODYWEIGHT", movement: "HINGE", category: "Back", region: "Lower Back", isCompound: false },
];

export const exerciseCategories = ["Chest", "Biceps", "Triceps", "Shoulders", "Abs", "Legs", "Back"] as const;

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
];

function normalized(value?: string | null) {
  return value?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
}

export function getExerciseMuscleGroup(exercise: Pick<Exercise, "category" | "region">) {
  const region = normalized(exercise.region);
  const exact = exerciseMuscleGroups.find((group) => normalized(group.region) === region);
  if (exact) return exact;
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
