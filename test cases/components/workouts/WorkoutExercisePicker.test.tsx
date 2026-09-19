// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import WorkoutExercisePicker from "fitness/components/workouts/WorkoutExercisePicker";
import createAppTheme from "fitness/theme";
import { describe, expect, it, vi } from "vitest";

vi.mock("fitness/utils/spec", () => ({
  getExercises: vi.fn().mockResolvedValue({ items: [], nextCursor: null }),
}));

describe("EXERCISE-014 DES-020 WorkoutExercisePicker compatibility", () => {
  it("renders muscle discovery only for the explicit guided variant", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutExercisePicker
          selected={[]}
          onChange={onChange}
          initialExercises={[]}
          variant="muscle-guided"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Select one or more muscles")).toBeTruthy();

    rerender(
      <ThemeProvider theme={createAppTheme("light")}>
        <WorkoutExercisePicker
          selected={[]}
          onChange={onChange}
          initialExercises={[]}
          variant="legacy"
        />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText("Search exercises")).toBeTruthy();
    expect(screen.queryByText("Select one or more muscles")).toBeNull();
  });
});
