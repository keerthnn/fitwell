// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import WorkoutExerciseEditor from "fitness/components/workouts/WorkoutExerciseEditor";
import createAppTheme from "fitness/theme";
import type { Exercise, Workout } from "fitness/utils/types";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  addExerciseToWorkout: vi.fn(),
  getExercises: vi.fn(),
}));

vi.mock("fitness/utils/spec", () => ({
  addExerciseToWorkout: mocks.addExerciseToWorkout,
  getExercises: mocks.getExercises,
}));

const exercise: Exercise = {
  id: "exercise-squat",
  name: "Barbell Front Squat",
  description: null,
  instructions: null,
  equipment: "BARBELL",
  movement: "SQUAT",
  category: "STRENGTH",
  primaryMuscle: "QUADRICEPS",
  secondaryMuscles: [],
  isCompound: true,
  trackingType: "REPS_WEIGHT",
  isActive: true,
  imagePath: null,
  thumbnailPath: null,
  equipmentImagePath: null,
};

const workout: Workout = {
  id: "workout-1",
  name: "My workout",
  workoutDate: "2026-08-12",
  status: "IN_PROGRESS",
  entryMode: "LIVE",
  startedAt: "2026-08-12T10:00:00.000Z",
  completedAt: null,
  durationMinutes: null,
  notes: null,
  sourceWorkoutPlanId: null,
  exercises: [],
};

const renderEditor = (onReload = vi.fn().mockResolvedValue(undefined)) => {
  render(
    <ThemeProvider theme={createAppTheme("light")}>
      <WorkoutExerciseEditor workout={workout} onReload={onReload} />
    </ThemeProvider>,
  );
  return onReload;
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("WorkoutExerciseEditor exercise search", () => {
  it("searches the full catalogue as the user types", async () => {
    mocks.getExercises.mockImplementation(
      async (params: Record<string, string>) => ({
        items: params.search === "squat" ? [exercise] : [],
        nextCursor: null,
      }),
    );
    renderEditor();

    const input = screen.getByRole("combobox", { name: "Add exercise" });
    fireEvent.change(input, { target: { value: "squat" } });

    await waitFor(() =>
      expect(mocks.getExercises).toHaveBeenCalledWith({
        limit: "100",
        search: "squat",
      }),
    );
    expect(
      await screen.findByRole("option", { name: exercise.name }),
    ).toBeInTheDocument();
  });

  it("adds the exercise selected from the search results", async () => {
    const onReload = vi.fn().mockResolvedValue(undefined);
    mocks.getExercises.mockResolvedValue({
      items: [exercise],
      nextCursor: null,
    });
    mocks.addExerciseToWorkout.mockResolvedValue({});
    renderEditor(onReload);

    fireEvent.click(screen.getByRole("combobox", { name: "Add exercise" }));
    fireEvent.click(
      await screen.findByRole("option", { name: exercise.name }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() =>
      expect(mocks.addExerciseToWorkout).toHaveBeenCalledWith("workout-1", {
        exerciseId: exercise.id,
        order: 0,
      }),
    );
    expect(onReload).toHaveBeenCalledOnce();
  });
});
