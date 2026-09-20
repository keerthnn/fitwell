import { validateExerciseQuery } from "fitness/lib/api/validators/exercise";
import { describe, expect, it } from "vitest";

describe("DES-001 DES-012 AC-05 exercise discovery query validation", () => {
  it("accepts one to twelve unique canonical categories", () => {
    expect(
      validateExerciseQuery({
        categories: "Chest,Triceps,Back",
        search: " press ",
        limit: "24",
      }),
    ).toEqual({
      valid: true,
      data: {
        search: "press",
        category: undefined,
        categories: ["Chest", "Triceps", "Back"],
        equipment: undefined,
        equipments: undefined,
        movement: undefined,
        limit: 24,
        cursor: undefined,
      },
      errors: [],
    });
  });

  it("EXERCISE-012 accepts one to six unique canonical equipment choices", () => {
    expect(
      validateExerciseQuery({ equipments: "BARBELL,BODYWEIGHT,CABLE" }),
    ).toMatchObject({
      valid: true,
      data: {
        equipment: undefined,
        equipments: ["BARBELL", "BODYWEIGHT", "CABLE"],
      },
    });
  });

  it.each([
    { equipments: "" },
    { equipments: "BARBELL," },
    { equipments: "BARBELL,BARBELL" },
    { equipments: ["BARBELL", "CABLE"] },
    { equipments: "BARBELL,UNKNOWN" },
    { equipment: "BARBELL", equipments: "CABLE" },
  ])("EXERCISE-012 rejects invalid plural equipment input %#", (query) => {
    const result = validateExerciseQuery(query);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === "equipments")).toBe(
      true,
    );
  });

  it("preserves the legacy singular category contract", () => {
    const result = validateExerciseQuery({
      category: "Full Body",
      limit: "12",
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.category).toBe("Full Body");
      expect(result.data.categories).toBeUndefined();
    }
  });

  it.each([
    { categories: "" },
    { categories: "Chest," },
    { categories: "Chest,Chest" },
    { categories: ["Chest", "Back"] },
    { categories: "Chest,Full Body" },
    { categories: "Chest,Unknown" },
    {
      categories:
        "Chest,Back,Shoulders,Biceps,Triceps,Quadriceps,Hamstrings,Glutes,Calves,Abs,Traps,Forearms,Chest",
    },
  ])("rejects invalid plural category input %#", (query) => {
    const result = validateExerciseQuery(query);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === "categories")).toBe(
      true,
    );
  });

  it.each(["Chest", ""])("rejects mixed singular and plural category filters (%s)", (category) => {
    const result = validateExerciseQuery({
      category,
      categories: "Back,Triceps",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "categories",
      message: "category and categories cannot be combined",
    });
  });
});
