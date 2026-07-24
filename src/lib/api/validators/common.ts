import type { ValidationError } from "fitness/utils/types";

export type ValidationResult<T> =
  | { valid: true; data: T; errors: [] }
  | { valid: false; errors: ValidationError[]; data?: never };

export const invalid = <T>(errors: ValidationError[]): ValidationResult<T> => ({
  valid: false,
  errors,
});
export const valid = <T>(data: T): ValidationResult<T> => ({
  valid: true,
  data,
  errors: [],
});
export const record = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
export const text = (
  value: unknown,
  field: string,
  errors: ValidationError[],
  options: { required?: boolean; max?: number } = {},
) => {
  if (value === undefined || value === null || value === "") {
    if (options.required)
      errors.push({ field, message: `${field} is required` });
    return undefined;
  }
  if (typeof value !== "string") {
    errors.push({ field, message: `${field} must be text` });
    return undefined;
  }
  const result = value.trim();
  if (options.required && !result)
    errors.push({ field, message: `${field} is required` });
  if (options.max && result.length > options.max)
    errors.push({
      field,
      message: `${field} must be ${options.max} characters or fewer`,
    });
  return result;
};
export const numberValue = (
  value: unknown,
  field: string,
  errors: ValidationError[],
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
    required?: boolean;
  } = {},
) => {
  if (value === undefined || value === null || value === "") {
    if (options.required)
      errors.push({ field, message: `${field} is required` });
    return undefined;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors.push({ field, message: `${field} must be a number` });
    return undefined;
  }
  if (options.integer && !Number.isInteger(value))
    errors.push({ field, message: `${field} must be a whole number` });
  if (options.min !== undefined && value < options.min)
    errors.push({ field, message: `${field} must be at least ${options.min}` });
  if (options.max !== undefined && value > options.max)
    errors.push({ field, message: `${field} must be at most ${options.max}` });
  return value;
};
export const enumValue = <T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
  errors: ValidationError[],
): T | undefined => {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    errors.push({ field, message: `Invalid ${field}` });
    return undefined;
  }
  return value as T;
};
export const dateValue = (
  value: unknown,
  field: string,
  errors: ValidationError[],
) => {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    errors.push({ field, message: `${field} must be a valid date` });
    return undefined;
  }
  return value;
};
export const idValue = (
  value: unknown,
  field: string,
  errors: ValidationError[],
) => text(value, field, errors, { required: true, max: 128 });

export const isIdentifier = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= 128 &&
  /^[A-Za-z0-9_-]+$/.test(value);
