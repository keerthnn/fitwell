import type { ValidationError } from "fitness/utils/types";
import { enumValue, invalid, record, text, valid } from "./common";

const equipment = ["BARBELL", "DUMBBELL", "KETTLEBELL", "MACHINE", "BODYWEIGHT", "CABLE"] as const;
const movements = ["PUSH", "PULL", "SQUAT", "HINGE", "LUNGE", "ROTATION", "CARRY", "ISOMETRIC"] as const;
const tracking = ["REPS_WEIGHT", "REPS_ONLY", "DURATION", "DISTANCE", "DURATION_DISTANCE"] as const;
export interface ExerciseInput {
  name: string;
  description?: string;
  instructions?: string;
  equipment: (typeof equipment)[number];
  movement: (typeof movements)[number];
  category: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  isCompound: boolean;
  trackingType: (typeof tracking)[number];
  imagePath?: string;
  thumbnailPath?: string;
  equipmentImagePath?: string;
}
export function validateExercise(value: unknown) {
  const input = record(value);
  if (!input) return invalid<ExerciseInput>([{ field: "request", message: "Invalid request body" }]);
  const errors: ValidationError[] = [];
  const name = text(input.name, "name", errors, { required: true, max: 120 });
  const category = text(input.category, "category", errors, { required: true, max: 80 });
  const primaryMuscle = text(input.primaryMuscle, "primaryMuscle", errors, { required: true, max: 80 });
  const selectedEquipment = enumValue(input.equipment, "equipment", equipment, errors);
  const movement = enumValue(input.movement, "movement", movements, errors);
  const trackingType = enumValue(input.trackingType, "trackingType", tracking, errors);
  const description = text(input.description, "description", errors, { max: 2000 });
  const instructions = text(input.instructions, "instructions", errors, { max: 5000 });
  const imagePath = text(input.imagePath, "imagePath", errors, { max: 300 });
  const thumbnailPath = text(input.thumbnailPath, "thumbnailPath", errors, { max: 300 });
  const equipmentImagePath = text(input.equipmentImagePath, "equipmentImagePath", errors, { max: 300 });
  const secondaryMuscles = Array.isArray(input.secondaryMuscles)
    ? input.secondaryMuscles.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 20)
    : [];
  if (errors.length || !name || !category || !primaryMuscle || !selectedEquipment || !movement || !trackingType)
    return invalid<ExerciseInput>(errors);
  return valid({
    name, description, instructions, category, primaryMuscle, equipment: selectedEquipment,
    movement, trackingType, secondaryMuscles, isCompound: input.isCompound !== false,
    imagePath, thumbnailPath, equipmentImagePath,
  });
}

export function validateExerciseQuery(value: unknown) {
  const input = record(value);
  if (!input) return invalid<Record<string, never>>([{ field: "query", message: "Invalid query" }]);
  const errors: ValidationError[] = [];
  const search = text(input.search, "search", errors, { max: 120 });
  const category = text(input.category, "category", errors, { max: 80 });
  const selectedEquipment =
    input.equipment === undefined
      ? undefined
      : enumValue(input.equipment, "equipment", equipment, errors);
  const movement =
    input.movement === undefined
      ? undefined
      : enumValue(input.movement, "movement", movements, errors);
  const rawLimit = Array.isArray(input.limit) ? input.limit[0] : input.limit;
  const parsedLimit =
    typeof rawLimit === "string" ? Number.parseInt(rawLimit, 10) : 30;
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    errors.push({ field: "limit", message: "limit must be between 1 and 100" });
  }
  const cursor = text(input.cursor, "cursor", errors, { max: 128 });
  if (errors.length) return invalid<Record<string, never>>(errors);
  return valid({
    search,
    category,
    equipment: selectedEquipment,
    movement,
    limit: parsedLimit,
    cursor,
  });
}
