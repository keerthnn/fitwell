// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import WorkoutPlanForm from "fitness/components/workout-plans/WorkoutPlanForm";
import createAppTheme from "fitness/theme";
import type { WorkoutPlan } from "fitness/utils/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getExercises: vi.fn(),
  createWorkoutPlan: vi.fn(),
  updateWorkoutPlan: vi.fn(),
  adminCreateWorkoutPlan: vi.fn(),
  adminUpdateWorkoutPlan: vi.fn(),
  push: vi.fn(),
}));

vi.mock("fitness/utils/spec", () => ({
  getExercises: mocks.getExercises,
  createWorkoutPlan: mocks.createWorkoutPlan,
  updateWorkoutPlan: mocks.updateWorkoutPlan,
  adminCreateWorkoutPlan: mocks.adminCreateWorkoutPlan,
  adminUpdateWorkoutPlan: mocks.adminUpdateWorkoutPlan,
}));
vi.mock("next/router", () => ({ useRouter: () => ({ push: mocks.push }) }));

const benchPress = {
  id: "exercise_1",
  name: "Bench press",
  description: null,
  instructions: null,
  equipment: "BARBELL",
  movement: "PUSH",
  category: "Chest",
  primaryMuscle: "Chest",
  secondaryMuscles: [],
  isCompound: true,
  trackingType: "REPS_WEIGHT" as const,
  isActive: true,
  imagePath: null,
  thumbnailPath: null,
  equipmentImagePath: null,
};

const existing: WorkoutPlan = {
  id: "plan_1",
  userId: "user_1",
  name: "Existing",
  description: null,
  difficulty: "BEGINNER",
  category: "Strength",
  daysPerWeek: 3,
  isBuiltIn: false,
  isFeatured: false,
  isActive: true,
  isArchived: false,
  coverImagePath: null,
  exercises: [],
};

describe("PLAN-014 DES-018 WorkoutPlanForm discovery boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getExercises.mockResolvedValue({ items: [benchPress], nextCursor: null });
    mocks.createWorkoutPlan.mockResolvedValue({ id: "plan_2" });
  });
  afterEach(cleanup);

  it("uses discovery for member creation and legacy search for edit", () => {
    const { rerender } = render(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutPlanForm initialExercises={[]} />
      </ThemeProvider>,
    );
    expect(screen.getByText("Select one or more muscles")).toBeTruthy();

    rerender(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutPlanForm initial={existing} initialExercises={[]} />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText("Search exercises")).toBeTruthy();
    expect(screen.queryByText("Select one or more muscles")).toBeNull();
  });

  it("creates only on explicit submit and preserves the default prescription", async () => {
    render(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutPlanForm />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Add Bench press" }),
    );
    expect(mocks.createWorkoutPlan).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/Plan name/), {
      target: { value: "Push plan" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Workout Plan" }));

    await waitFor(() =>
      expect(mocks.createWorkoutPlan).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Push plan",
          exercises: [
            expect.objectContaining({ exerciseId: "exercise_1", order: 0, sets: 3 }),
          ],
        }),
      ),
    );
  });
});
