import type { RequestInputValue } from "fitness/utils/types";

export const muscleGroups = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Abs",
  "Traps",
  "Forearms",
] as const;

export type MuscleGroup = (typeof muscleGroups)[number];

export const isMuscleGroup = (value: string): value is MuscleGroup =>
  muscleGroups.includes(value as MuscleGroup);

export function parseMuscleGroups(value: RequestInputValue): MuscleGroup[] | null {
  if (typeof value !== "string" || !value.length) return null;
  const groups = value.split(",");
  if (
    groups.length > muscleGroups.length ||
    groups.some((group) => !group.length || !isMuscleGroup(group)) ||
    new Set(groups).size !== groups.length
  ) {
    return null;
  }
  return groups as MuscleGroup[];
}
