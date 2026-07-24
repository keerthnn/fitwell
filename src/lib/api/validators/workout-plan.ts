import type { ValidationError, WorkoutPlanExercise } from "fitness/utils/types";
import {
  enumValue,
  idValue,
  invalid,
  numberValue,
  record,
  text,
  valid,
} from "./common";

const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export interface PlanInput {
  name: string;
  description?: string;
  difficulty: (typeof difficulties)[number];
  category: string;
  daysPerWeek: number;
  coverImagePath?: string;
  exercises: WorkoutPlanExercise[];
}

export function validateWorkoutPlan(value: unknown) {
  const input = record(value);
  if (!input)
    return invalid<PlanInput>([
      { field: "request", message: "Invalid request body" },
    ]);
  const errors: ValidationError[] = [];
  const name = text(input.name, "name", errors, { required: true, max: 120 });
  const description = text(input.description, "description", errors, {
    max: 2000,
  });
  const difficulty = enumValue(
    input.difficulty,
    "difficulty",
    difficulties,
    errors,
  );
  const category = text(input.category, "category", errors, {
    required: true,
    max: 80,
  });
  const daysPerWeek = numberValue(input.daysPerWeek, "daysPerWeek", errors, {
    min: 1,
    max: 7,
    integer: true,
    required: true,
  });
  const coverImagePath = text(input.coverImagePath, "coverImagePath", errors, {
    max: 300,
  });
  const exercises: WorkoutPlanExercise[] = Array.isArray(input.exercises)
    ? input.exercises.slice(0, 100).map((value, index) => {
        const item = record(value) ?? {};
        const field = `exercises.${index}`;
        return {
          exerciseId:
            idValue(item.exerciseId, `${field}.exerciseId`, errors) ?? "",
          order:
            numberValue(item.order, `${field}.order`, errors, {
              min: 0,
              max: 99,
              integer: true,
              required: true,
            }) ?? index,
          sets:
            numberValue(item.sets, `${field}.sets`, errors, {
              min: 1,
              max: 20,
              integer: true,
              required: true,
            }) ?? 0,
          minimumReps:
            numberValue(item.minimumReps, `${field}.minimumReps`, errors, {
              min: 0,
              max: 10000,
              integer: true,
            }) ?? null,
          maximumReps:
            numberValue(item.maximumReps, `${field}.maximumReps`, errors, {
              min: 0,
              max: 10000,
              integer: true,
            }) ?? null,
          restSeconds:
            numberValue(item.restSeconds, `${field}.restSeconds`, errors, {
              min: 0,
              max: 7200,
              integer: true,
            }) ?? null,
          weightGuidance:
            text(item.weightGuidance, `${field}.weightGuidance`, errors, {
              max: 200,
            }) ?? null,
          notes:
            text(item.notes, `${field}.notes`, errors, { max: 1000 }) ?? null,
        };
      })
    : [];
  if (!Array.isArray(input.exercises) || !exercises.length)
    errors.push({
      field: "exercises",
      message: "At least one exercise is required",
    });
  if (Array.isArray(input.exercises) && input.exercises.length > 100)
    errors.push({
      field: "exercises",
      message: "A Workout Plan can contain at most 100 exercises",
    });
  if (errors.length || !name || !difficulty || !category || !daysPerWeek)
    return invalid<PlanInput>(errors);
  return valid({
    name,
    description,
    difficulty,
    category,
    daysPerWeek,
    coverImagePath,
    exercises,
  });
}
