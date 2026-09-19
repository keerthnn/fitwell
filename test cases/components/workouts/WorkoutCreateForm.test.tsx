// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import WorkoutCreateForm from "fitness/components/workouts/WorkoutCreateForm";
import createAppTheme from "fitness/theme";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createWorkout: vi.fn(),
  getExercises: vi.fn(),
  push: vi.fn(),
}));

vi.mock("fitness/utils/spec", () => ({
  createWorkout: mocks.createWorkout,
  getExercises: mocks.getExercises,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ push: mocks.push }),
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

describe("WorkoutCreateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getExercises.mockResolvedValue({ items: [benchPress], nextCursor: null });
    mocks.createWorkout.mockResolvedValue({ id: "workout_1" });
  });
  afterEach(cleanup);

  const renderForm = () =>
    renderToStaticMarkup(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutCreateForm mode="LIVE" initialExercises={[]} />
      </ThemeProvider>,
    );

  it("WORKOUT-002 starts with an empty required workout name", () => {
    const html = renderForm();

    expect(html).toMatch(
      /<input(?=[^>]*name="workoutName")(?=[^>]*required="")(?=[^>]*value="")[^>]*>/,
    );
  });

  it("WORKOUT-002 exposes the workout date calendar control", () => {
    const html = renderForm();

    expect(html).toContain("Workout date");
    expect(html).toContain('aria-label="Open workout date calendar"');
  });

  it("WORKOUT-018 AC-01 begins live setup with muscle-guided discovery", () => {
    const html = renderForm();

    expect(html).toContain("Select one or more muscles");
    expect(html).toContain("Browse all exercises");
  });

  it("WORKOUT-018 AC-07 only starts explicitly with ordered chosen exercises", async () => {
    render(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutCreateForm mode="LIVE" />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Add Bench press" }),
    );
    expect(mocks.createWorkout).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/Workout name/), {
      target: { value: "Push day" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Start with 1 exercise" }),
    );

    await waitFor(() =>
      expect(mocks.createWorkout).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Push day",
          entryMode: "LIVE",
          exerciseIds: ["exercise_1"],
        }),
      ),
    );
  });
});
