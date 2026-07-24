import type { Profile, ValidationError } from "fitness/utils/types";
import {
  dateValue,
  enumValue,
  invalid,
  numberValue,
  record,
  text,
  valid,
} from "./common";

const goals = [
  "LOSE_FAT",
  "BUILD_MUSCLE",
  "IMPROVE_STRENGTH",
  "IMPROVE_ENDURANCE",
  "MAINTAIN_FITNESS",
  "GENERAL_FITNESS",
] as const;
const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
const units = ["METRIC", "IMPERIAL"] as const;

export function validateProfile(value: unknown) {
  const input = record(value);
  if (!input)
    return invalid<Profile>([
      { field: "request", message: "Invalid request body" },
    ]);
  const errors: ValidationError[] = [];
  const firstName = text(input.firstName, "firstName", errors, {
    required: true,
    max: 80,
  });
  const lastName = text(input.lastName, "lastName", errors, {
    required: true,
    max: 80,
  });
  const gender = text(input.gender, "gender", errors, { max: 40 });
  const dateOfBirth = input.dateOfBirth
    ? dateValue(input.dateOfBirth, "dateOfBirth", errors)
    : null;
  const heightCm = numberValue(input.heightCm, "heightCm", errors, {
    min: 50,
    max: 300,
  });
  const currentWeightKg = numberValue(
    input.currentWeightKg,
    "currentWeightKg",
    errors,
    { min: 1, max: 600 },
  );
  const unitSystem = enumValue(input.unitSystem, "unitSystem", units, errors);
  const fitnessGoal = enumValue(
    input.fitnessGoal,
    "fitnessGoal",
    goals,
    errors,
  );
  const experienceLevel = enumValue(
    input.experienceLevel,
    "experienceLevel",
    levels,
    errors,
  );
  const weeklyWorkoutTarget = numberValue(
    input.weeklyWorkoutTarget,
    "weeklyWorkoutTarget",
    errors,
    { min: 1, max: 14, integer: true, required: true },
  );
  const typicalWorkoutDuration = numberValue(
    input.typicalWorkoutDuration,
    "typicalWorkoutDuration",
    errors,
    { min: 1, max: 1440, integer: true },
  );
  const preferredWorkoutTime = text(
    input.preferredWorkoutTime,
    "preferredWorkoutTime",
    errors,
    { max: 20 },
  );
  const timezone = text(input.timezone, "timezone", errors, {
    required: true,
    max: 100,
  });
  if (
    errors.length ||
    !firstName ||
    !lastName ||
    !unitSystem ||
    !fitnessGoal ||
    !experienceLevel ||
    !weeklyWorkoutTarget ||
    !timezone
  )
    return invalid<Profile>(errors);
  return valid<Profile>({
    firstName,
    lastName,
    gender: gender ?? null,
    dateOfBirth,
    heightCm: heightCm ?? null,
    currentWeightKg: currentWeightKg ?? null,
    unitSystem,
    fitnessGoal,
    experienceLevel,
    weeklyWorkoutTarget,
    typicalWorkoutDuration: typicalWorkoutDuration ?? null,
    preferredWorkoutTime: preferredWorkoutTime ?? null,
    timezone,
    onboardingCompleted: input.onboardingCompleted === true,
  });
}
