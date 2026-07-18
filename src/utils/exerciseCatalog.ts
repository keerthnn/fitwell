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
  { name: "Plank", equipment: "BODYWEIGHT", movement: "ISOMETRIC", category: "Abs", region: "Core", isCompound: false },
  { name: "Cable Crunch", equipment: "CABLE", movement: "PUSH", category: "Abs", region: "Rectus abdominis", isCompound: false },
  { name: "Hanging Leg Raise", equipment: "BODYWEIGHT", movement: "ISOMETRIC", category: "Abs", region: "Lower abs", isCompound: false },
  { name: "Russian Twist", equipment: "BODYWEIGHT", movement: "ROTATION", category: "Abs", region: "Obliques", isCompound: false },
  { name: "Barbell Back Squat", equipment: "BARBELL", movement: "SQUAT", category: "Legs", region: "Quads", isCompound: true },
  { name: "Romanian Deadlift", equipment: "BARBELL", movement: "HINGE", category: "Legs", region: "Hamstrings", isCompound: true },
  { name: "Leg Press", equipment: "MACHINE", movement: "SQUAT", category: "Legs", region: "Quads", isCompound: true },
  { name: "Walking Lunge", equipment: "DUMBBELL", movement: "LUNGE", category: "Legs", region: "Quads and glutes", isCompound: true },
  { name: "Barbell Row", equipment: "BARBELL", movement: "PULL", category: "Back", region: "Lats", isCompound: true },
  { name: "Lat Pulldown", equipment: "MACHINE", movement: "PULL", category: "Back", region: "Lats", isCompound: true },
  { name: "Seated Cable Row", equipment: "CABLE", movement: "PULL", category: "Back", region: "Mid back", isCompound: true },
  { name: "Pull-Up", equipment: "BODYWEIGHT", movement: "PULL", category: "Back", region: "Lats", isCompound: true },
];

export const exerciseCategories = ["Chest", "Biceps", "Triceps", "Shoulders", "Abs", "Legs", "Back"] as const;

export const muscleGroupImageSources: Partial<Record<string, string>> = {
  Chest: "/muscle-groups/chest.png",
  Back: "/muscle-groups/back.png",
  Legs: "/muscle-groups/legs.png",
  Biceps: "/muscle-groups/biceps.png",
  Triceps: "/muscle-groups/triceps.png",
  Shoulders: "/muscle-groups/shoulders.png",
};
