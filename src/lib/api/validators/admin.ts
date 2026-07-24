import type { ValidationError } from "fitness/utils/types";
import { idValue, invalid, record, valid } from "./common";

export function validateAdminTarget(value: unknown) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const id = idValue(input?.id ?? input?.userId, "id", errors);
  return errors.length || !id ? invalid<{ id: string }>(errors) : valid({ id });
}
