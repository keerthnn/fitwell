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

export const equipmentTypes = [
  "BARBELL",
  "DUMBBELL",
  "KETTLEBELL",
  "MACHINE",
  "BODYWEIGHT",
  "CABLE",
] as const;

export type EquipmentType = (typeof equipmentTypes)[number];

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

export function parseEquipmentTypes(
  value: RequestInputValue,
): EquipmentType[] | null {
  if (typeof value !== "string" || !value.length) return null;
  const equipments = value.split(",");
  if (
    equipments.length > equipmentTypes.length ||
    equipments.some(
      (equipment) =>
        !equipment.length ||
        !equipmentTypes.includes(equipment as EquipmentType),
    ) ||
    new Set(equipments).size !== equipments.length
  ) {
    return null;
  }
  return equipments as EquipmentType[];
}
