import { z } from "zod";

export const idSchema = z.string().uuid();
export const dateSchema = z.coerce.date();
export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export function parseOrError<T>(
  schema: z.ZodType<T>,
  value: unknown,
):
  | { data: T; error?: never }
  | {
      data?: never;
      error: { error: string; fieldErrors: Record<string, string[]> };
    } {
  const result = schema.safeParse(value);
  if (result.success) return { data: result.data };
  const flattened = z.flattenError(result.error);
  const fieldErrors = Object.fromEntries(
    Object.entries(flattened.fieldErrors).filter(
      (entry): entry is [string, string[]] => Array.isArray(entry[1]),
    ),
  );
  return { error: { error: "Invalid request", fieldErrors } };
}
