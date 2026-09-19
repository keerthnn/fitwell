import { validateDuplicateWorkoutPlan } from "fitness/lib/api/validators/workout-plan";
import { describe, expect, it } from "vitest";

describe("PLAN-005 PLAN-010 duplicate workout-plan validation", () => {
  it("trims a valid destination name", () => {
    expect(
      validateDuplicateWorkoutPlan({ id: "plan_1", name: "  My copy  " }),
    ).toEqual({
      valid: true,
      data: { id: "plan_1", name: "My copy" },
      errors: [],
    });
  });

  it.each(["", "   "])("rejects a blank name", (name) => {
    const result = validateDuplicateWorkoutPlan({ id: "plan_1", name });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "name",
      message: "name is required",
    });
  });

  it("accepts exactly 120 characters and rejects 121", () => {
    expect(
      validateDuplicateWorkoutPlan({ id: "plan_1", name: "a".repeat(120) })
        .valid,
    ).toBe(true);

    const result = validateDuplicateWorkoutPlan({
      id: "plan_1",
      name: "a".repeat(121),
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "name",
      message: "name must be 120 characters or fewer",
    });
  });

  it("rejects a missing source ID", () => {
    const result = validateDuplicateWorkoutPlan({
      name: "Copy",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "id",
      message: "id is required",
    });
  });
});
