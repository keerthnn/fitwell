// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import SetEditor from "fitness/components/workouts/SetEditor";
import createAppTheme from "fitness/theme";
import type { WorkoutExerciseDetail, WorkoutSet } from "fitness/utils/types";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  saveWorkoutExerciseSets: vi.fn(),
}));

vi.mock("fitness/utils/spec", () => ({
  saveWorkoutExerciseSets: mocks.saveWorkoutExerciseSets,
}));

const set = (
  setNumber: number,
  restSeconds: number | null,
  isCompleted = false,
): WorkoutSet => ({
  id: `set-${setNumber}`,
  setNumber,
  reps: 8,
  weightKg: 20,
  durationSeconds: null,
  distanceMeters: null,
  restSeconds,
  isCompleted,
});

const item = (
  sets: WorkoutSet[],
  trackingType: WorkoutExerciseDetail["exercise"]["trackingType"] =
    "REPS_WEIGHT",
): WorkoutExerciseDetail => ({
  id: "workout-exercise-1",
  workoutId: "workout-1",
  exerciseId: "exercise-1",
  order: 0,
  notes: null,
  exercise: {
    id: "exercise-1",
    name: "Goblet squat",
    description: null,
    instructions: null,
    equipment: "DUMBBELL",
    movement: "SQUAT",
    category: "STRENGTH",
    primaryMuscle: "QUADRICEPS",
    secondaryMuscles: [],
    isCompound: true,
    trackingType,
    isActive: true,
    imagePath: null,
    thumbnailPath: null,
    equipmentImagePath: null,
  },
  sets,
});

const renderEditor = (
  sets: WorkoutSet[],
  props: {
    disabled?: boolean;
    onStartRest?: (seconds: number) => void;
  } = {},
  trackingType: WorkoutExerciseDetail["exercise"]["trackingType"] =
    "REPS_WEIGHT",
) =>
  render(
    <ThemeProvider theme={createAppTheme("light")}>
      <SetEditor item={item(sets, trackingType)} {...props} />
    </ThemeProvider>,
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SetEditor exercise-wide rest", () => {
  it("does not complete a set or start rest until required values are entered", () => {
    const onStartRest = vi.fn();
    renderEditor(
      [{ ...set(1, 60), reps: null, weightKg: null }],
      { onStartRest },
    );

    fireEvent.click(screen.getByLabelText("Complete set 1"));

    expect(screen.getByLabelText("Complete set 1")).not.toBeChecked();
    expect(onStartRest).not.toHaveBeenCalled();
    expect(screen.getByText("Reps are required")).toBeInTheDocument();
    expect(screen.getByText("Weight is required")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Reps", { exact: false }), {
      target: { value: "8" },
    });
    fireEvent.change(screen.getByLabelText("Weight (kg)", { exact: false }), {
      target: { value: "20" },
    });
    fireEvent.click(screen.getByLabelText("Complete set 1"));

    expect(screen.getByLabelText("Complete set 1")).toBeChecked();
    expect(onStartRest).toHaveBeenCalledOnce();
    expect(onStartRest).toHaveBeenCalledWith(60);
  });

  it.each([
    ["live", { onStartRest: vi.fn() }],
    ["edit", {}],
  ])(
    "blocks %s saves until every set has reps and weight",
    async (_surface, props) => {
      mocks.saveWorkoutExerciseSets.mockResolvedValue({ success: true });
      renderEditor(
        [
          { ...set(1, 60), reps: null, weightKg: null },
          { ...set(2, 60), weightKg: null },
        ],
        props,
      );

      fireEvent.click(screen.getByRole("button", { name: "Save sets" }));

      expect(mocks.saveWorkoutExerciseSets).not.toHaveBeenCalled();
      expect(
        screen.getByText("Enter every required value for each set before saving."),
      ).toBeInTheDocument();
      expect(screen.getByText("Reps are required")).toBeInTheDocument();
      expect(screen.getAllByText("Weight is required")).toHaveLength(2);

      fireEvent.change(screen.getAllByLabelText("Reps", { exact: false })[0], {
        target: { value: "8" },
      });
      fireEvent.change(screen.getAllByLabelText("Weight (kg)", { exact: false })[0], {
        target: { value: "0" },
      });
      fireEvent.change(screen.getAllByLabelText("Weight (kg)", { exact: false })[1], {
        target: { value: "20" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Save sets" }));

      await waitFor(() =>
        expect(mocks.saveWorkoutExerciseSets).toHaveBeenCalledWith(
          "workout-exercise-1",
          expect.arrayContaining([
            expect.objectContaining({ setNumber: 1, reps: 8, weightKg: 0 }),
            expect.objectContaining({ setNumber: 2, reps: 8, weightKg: 20 }),
          ]),
        ),
      );
    },
  );

  it("rejects zero reps while preserving zero as a valid weight", async () => {
    mocks.saveWorkoutExerciseSets.mockResolvedValue({ success: true });
    renderEditor([{ ...set(1, 60), reps: 0, weightKg: 0 }]);

    fireEvent.click(screen.getByRole("button", { name: "Save sets" }));

    expect(mocks.saveWorkoutExerciseSets).not.toHaveBeenCalled();
    expect(
      screen.getByText("Enter a whole number from 1 to 10,000"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Weight is required")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Reps", { exact: false }), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save sets" }));

    await waitFor(() =>
      expect(mocks.saveWorkoutExerciseSets).toHaveBeenCalledWith(
        "workout-exercise-1",
        [expect.objectContaining({ reps: 1, weightKg: 0 })],
      ),
    );
  });

  it.each([
    ["REPS_ONLY", "Reps", "Reps are required"],
    ["DURATION", "Duration (sec)", "Duration is required"],
    ["DISTANCE", "Distance (m)", "Distance is required"],
  ] as const)(
    "requires only the applicable metric for %s exercises",
    (trackingType, fieldLabel, errorMessage) => {
      const blank = {
        ...set(1, 60),
        reps: null,
        weightKg: null,
        durationSeconds: null,
        distanceMeters: null,
      };
      renderEditor([blank], {}, trackingType);

      fireEvent.click(screen.getByRole("button", { name: "Save sets" }));

      expect(mocks.saveWorkoutExerciseSets).not.toHaveBeenCalled();
      expect(
        screen.getByLabelText(fieldLabel, { exact: false }),
      ).toBeRequired();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      if (trackingType !== "REPS_ONLY") {
        expect(screen.queryByLabelText("Reps")).not.toBeInTheDocument();
      }
      expect(screen.queryByLabelText("Weight (kg)")).not.toBeInTheDocument();
    },
  );

  it("requires both duration and distance for combined tracking", () => {
    renderEditor(
      [
        {
          ...set(1, 60),
          durationSeconds: null,
          distanceMeters: null,
        },
      ],
      {},
      "DURATION_DISTANCE",
    );

    fireEvent.click(screen.getByRole("button", { name: "Save sets" }));

    expect(mocks.saveWorkoutExerciseSets).not.toHaveBeenCalled();
    expect(screen.getByText("Duration is required")).toBeInTheDocument();
    expect(screen.getByText("Distance is required")).toBeInTheDocument();
  });

  it("shows one shared field and starts the same rest for every completed set", () => {
    const onStartRest = vi.fn();
    renderEditor([set(2, 120), set(1, 60)], { onStartRest });

    expect(screen.getAllByLabelText("Rest (sec)")).toHaveLength(1);
    expect(screen.getByLabelText("Rest (sec)")).toHaveValue(60);

    fireEvent.click(screen.getByLabelText("Complete set 1"));
    expect(onStartRest).toHaveBeenLastCalledWith(60);

    fireEvent.click(screen.getByLabelText("Complete set 1"));
    expect(onStartRest).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText("Complete set 2"));
    expect(onStartRest).toHaveBeenLastCalledWith(60);
    expect(onStartRest).toHaveBeenCalledTimes(2);
  });

  it("manually starts rest from the exercise-wide value", () => {
    const onStartRest = vi.fn();
    renderEditor([set(1, 75), set(2, 120)], { onStartRest });

    fireEvent.click(screen.getByRole("button", { name: "Start rest" }));

    expect(onStartRest).toHaveBeenCalledOnce();
    expect(onStartRest).toHaveBeenCalledWith(75);
  });

  it("disables manual start at zero but still reports zero on completion", () => {
    const onStartRest = vi.fn();
    renderEditor([set(1, 0)], { onStartRest });

    expect(screen.getByRole("button", { name: "Start rest" })).toBeDisabled();
    fireEvent.click(screen.getByLabelText("Complete set 1"));
    expect(onStartRest).toHaveBeenCalledWith(0);
  });

  it("stamps an edited shared value onto every set when saving", async () => {
    mocks.saveWorkoutExerciseSets.mockResolvedValue({ success: true });
    renderEditor([set(1, 30), set(2, 60)], { onStartRest: vi.fn() });

    fireEvent.change(screen.getByLabelText("Rest (sec)"), {
      target: { value: "45" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save sets" }));

    await waitFor(() =>
      expect(mocks.saveWorkoutExerciseSets).toHaveBeenCalledWith(
        "workout-exercise-1",
        expect.arrayContaining([
          expect.objectContaining({ setNumber: 1, restSeconds: 45 }),
          expect.objectContaining({ setNumber: 2, restSeconds: 45 }),
        ]),
      ),
    );
  });

  it("keeps the edit-page surface unchanged without a timer callback", () => {
    renderEditor([set(1, 30)]);

    expect(screen.queryByLabelText("Rest (sec)")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Start rest" }),
    ).not.toBeInTheDocument();
  });

  it("disables all set and rest editing while the workout is paused", () => {
    renderEditor([set(1, 60)], { disabled: true, onStartRest: vi.fn() });

    expect(screen.getByLabelText("Rest (sec)")).toBeDisabled();
    expect(screen.getByLabelText("Reps", { exact: false })).toBeDisabled();
    expect(
      screen.getByLabelText("Weight (kg)", { exact: false }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Complete set 1")).toBeDisabled();
    expect(screen.getByLabelText("Remove set 1")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Add set" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save sets" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Start rest" })).toBeDisabled();
  });
});
