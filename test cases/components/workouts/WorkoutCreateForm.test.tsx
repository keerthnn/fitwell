import { ThemeProvider } from "@mui/material/styles";
import WorkoutCreateForm from "fitness/components/workouts/WorkoutCreateForm";
import createAppTheme from "fitness/theme";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("WorkoutCreateForm", () => {
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
});
