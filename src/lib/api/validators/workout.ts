import type {
  CreateWorkoutRequest,
  RequestInputValue,
  TrackingType,
  ValidationError,
  WorkoutSet,
} from "fitness/utils/types";
import {
  dateValue,
  enumValue,
  idValue,
  invalid,
  numberValue,
  record,
  text,
  valid,
} from "./common";

const modes = ["LIVE", "QUICK_ENTRY", "PLAN"] as const;

export function validateCreateWorkout(value: RequestInputValue) {
  const input = record(value);
  if (!input)
    return invalid<CreateWorkoutRequest>([
      { field: "request", message: "Invalid request body" },
    ]);
  const errors: ValidationError[] = [];
  const name = text(input.name, "name", errors, { required: true, max: 120 });
  const workoutDate = dateValue(input.workoutDate, "workoutDate", errors);
  const entryMode = enumValue(input.entryMode, "entryMode", modes, errors);
  const durationMinutes = numberValue(
    input.durationMinutes,
    "durationMinutes",
    errors,
    { min: 1, max: 1440, integer: true },
  );
  const notes = text(input.notes, "notes", errors, { max: 2000 });
  const exerciseIds = Array.isArray(input.exerciseIds)
    ? [
        ...new Set(
          input.exerciseIds
            .map((value, index) =>
              idValue(value, `exerciseIds.${index}`, errors),
            )
            .filter((value): value is string => Boolean(value)),
        ),
      ]
    : [];
  if (input.exerciseIds !== undefined && !Array.isArray(input.exerciseIds)) {
    errors.push({
      field: "exerciseIds",
      message: "exerciseIds must be an array",
    });
  }
  if (exerciseIds.length > 50) {
    errors.push({
      field: "exerciseIds",
      message: "A workout can contain at most 50 exercises",
    });
  }
  if (errors.length || !name || !workoutDate || !entryMode)
    return invalid<CreateWorkoutRequest>(errors);
  return valid<CreateWorkoutRequest>({
    name,
    workoutDate,
    entryMode,
    durationMinutes,
    notes,
    exerciseIds,
  });
}

export function validateIdBody(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const id = idValue(input?.id, "id", errors);
  return errors.length || !id ? invalid<{ id: string }>(errors) : valid({ id });
}

export function validateSets(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const workoutExerciseId = idValue(
    input?.workoutExerciseId,
    "workoutExerciseId",
    errors,
  );
  if (!Array.isArray(input?.sets))
    errors.push({ field: "sets", message: "sets must be an array" });
  const sets: WorkoutSet[] = Array.isArray(input?.sets)
    ? input.sets.map((item, index) => {
        const set = record(item) ?? {};
        const prefix = `sets.${index}`;
        return {
          id: typeof set.id === "string" ? set.id : undefined,
          setNumber:
            numberValue(set.setNumber, `${prefix}.setNumber`, errors, {
              min: 1,
              max: 100,
              integer: true,
              required: true,
            }) ?? 0,
          reps:
            numberValue(set.reps, `${prefix}.reps`, errors, {
              min: 0,
              max: 10000,
              integer: true,
            }) ?? null,
          weightKg:
            numberValue(set.weightKg, `${prefix}.weightKg`, errors, {
              min: 0,
              max: 2000,
            }) ?? null,
          durationSeconds:
            numberValue(
              set.durationSeconds,
              `${prefix}.durationSeconds`,
              errors,
              { min: 0, max: 86400, integer: true },
            ) ?? null,
          distanceMeters:
            numberValue(
              set.distanceMeters,
              `${prefix}.distanceMeters`,
              errors,
              { min: 0, max: 1000000 },
            ) ?? null,
          restSeconds:
            numberValue(set.restSeconds, `${prefix}.restSeconds`, errors, {
              min: 0,
              max: 7200,
              integer: true,
            }) ?? null,
          isCompleted: set.isCompleted === true,
        };
      })
    : [];
  if (sets.length > 100)
    errors.push({ field: "sets", message: "Too many sets" });
  return errors.length || !workoutExerciseId
    ? invalid<{ workoutExerciseId: string; sets: WorkoutSet[] }>(errors)
    : valid({ workoutExerciseId, sets });
}

export function validateSetsForTrackingType(
  sets: WorkoutSet[],
  trackingType: TrackingType,
) {
  const errors: ValidationError[] = [];
  const requiresReps =
    trackingType === "REPS_ONLY" || trackingType === "REPS_WEIGHT";
  const requiresWeight = trackingType === "REPS_WEIGHT";
  const requiresDuration =
    trackingType === "DURATION" || trackingType === "DURATION_DISTANCE";
  const requiresDistance =
    trackingType === "DISTANCE" || trackingType === "DURATION_DISTANCE";

  sets.forEach((set, index) => {
    if (requiresReps) {
      if (set.reps === null || set.reps === undefined) {
        errors.push({
          field: `sets.${index}.reps`,
          message: "Reps are required",
        });
      } else if (set.reps < 1) {
        errors.push({
          field: `sets.${index}.reps`,
          message: "Reps must be at least 1",
        });
      }
    }

    if (requiresWeight && (set.weightKg === null || set.weightKg === undefined)) {
      errors.push({
        field: `sets.${index}.weightKg`,
        message: "Weight is required",
      });
    }

    if (
      requiresDuration &&
      (set.durationSeconds === null || set.durationSeconds === undefined)
    ) {
      errors.push({
        field: `sets.${index}.durationSeconds`,
        message: "Duration is required",
      });
    }

    if (
      requiresDistance &&
      (set.distanceMeters === null || set.distanceMeters === undefined)
    ) {
      errors.push({
        field: `sets.${index}.distanceMeters`,
        message: "Distance is required",
      });
    }
  });

  return errors.length ? invalid<WorkoutSet[]>(errors) : valid(sets);
}

export function validateWorkoutQuery(value: RequestInputValue) {
  const input = record(value) ?? {};
  const errors: ValidationError[] = [];
  const status =
    input.status === undefined
      ? undefined
      : enumValue(
          input.status,
          "status",
          ["DRAFT", "IN_PROGRESS", "COMPLETED"] as const,
          errors,
        );
  const search = text(input.search, "search", errors, { max: 120 });
  const cursor = text(input.cursor, "cursor", errors, { max: 128 });
  const sort =
    input.sort === undefined
      ? "newest"
      : enumValue(input.sort, "sort", ["newest", "oldest"] as const, errors);
  const parsed = input.limit === undefined ? 20 : Number(input.limit);
  const limit =
    Number.isInteger(parsed) && parsed >= 1 && parsed <= 50 ? parsed : 20;
  if (input.limit !== undefined && limit !== parsed)
    errors.push({ field: "limit", message: "limit must be between 1 and 50" });
  return errors.length
    ? invalid<never>(errors)
    : valid({ status, search, cursor, sort, limit });
}

export function validateUpdateWorkout(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const id = idValue(input?.id, "id", errors);
  const name = text(input?.name, "name", errors, { max: 120 });
  const workoutDate =
    input?.workoutDate === undefined
      ? undefined
      : dateValue(input.workoutDate, "workoutDate", errors);
  const durationMinutes = numberValue(
    input?.durationMinutes,
    "durationMinutes",
    errors,
    { min: 1, max: 1440, integer: true },
  );
  const notes = text(input?.notes, "notes", errors, { max: 2000 });
  return errors.length || !id
    ? invalid<never>(errors)
    : valid({ id, name, workoutDate, durationMinutes, notes });
}

export function validateExerciseOrder(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const workoutId = idValue(input?.workoutId, "workoutId", errors);
  const ids =
    Array.isArray(input?.ids) && input.ids.every((id) => typeof id === "string")
      ? [...new Set(input.ids as string[])].slice(0, 100)
      : [];
  if (!ids.length)
    errors.push({
      field: "ids",
      message: "ids must contain exercise identifiers",
    });
  return errors.length || !workoutId
    ? invalid<never>(errors)
    : valid({ workoutId, ids });
}

export function validateAddExercise(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const workoutId = idValue(input?.workoutId, "workoutId", errors);
  const exerciseId = idValue(input?.exerciseId, "exerciseId", errors);
  const order = numberValue(input?.order, "order", errors, {
    min: 0,
    max: 99,
    integer: true,
    required: true,
  });
  return errors.length || !workoutId || !exerciseId || order === undefined
    ? invalid<never>(errors)
    : valid({ workoutId, exerciseId, order });
}

export function validateWorkoutExerciseUpdate(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const id = idValue(input?.id, "id", errors);
  const notes = text(input?.notes, "notes", errors, { max: 1000 });
  return errors.length || !id ? invalid<never>(errors) : valid({ id, notes });
}
