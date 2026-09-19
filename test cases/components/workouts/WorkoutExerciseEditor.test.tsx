// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import WorkoutExerciseEditor from "fitness/components/workouts/WorkoutExerciseEditor";
import createAppTheme from "fitness/theme";
import type { Workout } from "fitness/utils/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getExercises: vi.fn(),
  addExerciseToWorkout: vi.fn(),
}));

vi.mock("fitness/utils/spec", () => ({
  getExercises: mocks.getExercises,
  addExerciseToWorkout: mocks.addExerciseToWorkout,
}));

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

const workout: Workout = {
  id: "workout_1",
  name: "Past workout",
  workoutDate: "2026-09-18T12:00:00.000Z",
  status: "DRAFT",
  entryMode: "QUICK_ENTRY",
  startedAt: null,
  completedAt: null,
  durationMinutes: 45,
  notes: null,
  sourceWorkoutPlanId: null,
  exercises: [],
};

describe("WORKOUT-019 DES-019 WorkoutExerciseEditor discovery boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getExercises.mockResolvedValue({ items: [benchPress], nextCursor: null });
  });
  afterEach(cleanup);

  it("uses discovery only when the quick-entry edit page enables it", () => {
    const { rerender } = render(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutExerciseEditor
          workout={workout}
          onReload={vi.fn()}
          enableMuscleDiscovery
        />
      </ThemeProvider>,
    );
    expect(screen.getByText("Select one or more muscles")).toBeTruthy();

    rerender(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutExerciseEditor workout={workout} onReload={vi.fn()} />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText("Add exercise")).toBeTruthy();
    expect(screen.queryByText("Select one or more muscles")).toBeNull();
  });

  it("keeps discovery usable and shows a failed explicit add", async () => {
    mocks.addExerciseToWorkout.mockRejectedValue(new Error("inactive"));
    const onReload = vi.fn();
    render(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutExerciseEditor
          workout={workout}
          onReload={onReload}
          enableMuscleDiscovery
        />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Add Bench press" }),
    );

    expect(
      await screen.findByText("The exercise could not be added. Please try again."),
    ).toBeTruthy();
    expect(onReload).not.toHaveBeenCalled();
    expect(screen.getByText("Bench press")).toBeTruthy();
  });

  it("DES-019 serializes additions and does not report a saved add as failed when reload fails", async () => {
    let finish: (() => void) | undefined;
    mocks.addExerciseToWorkout.mockReturnValue(new Promise<void>((resolve) => { finish = resolve; }));
    render(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutExerciseEditor workout={workout} enableMuscleDiscovery
          onReload={vi.fn().mockRejectedValue(new Error("offline"))} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    const add = await screen.findByRole("button", { name: "Add Bench press" });
    fireEvent.click(add);
    fireEvent.click(add);
    expect(mocks.addExerciseToWorkout).toHaveBeenCalledTimes(1);
    finish?.();
    expect(await screen.findByText("The exercise was added, but the workout could not be refreshed. Retry refresh before adding more.")).toBeTruthy();
    expect((add as HTMLButtonElement).disabled).toBe(true);
  });
});
