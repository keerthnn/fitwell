// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import WorkoutPlanDetail from "fitness/components/workout-plans/WorkoutPlanDetail";
import createAppTheme from "fitness/theme";
import type { WorkoutPlan } from "fitness/utils/types";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("fitness/components/workout-plans/WorkoutPlanVisual", () => ({
  default: () => <div>Plan visual</div>,
}));
vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const privatePlan: WorkoutPlan = {
  id: "plan_1",
  userId: "user_1",
  name: "Strength",
  description: "Private plan",
  difficulty: "INTERMEDIATE",
  category: "Strength",
  daysPerWeek: 3,
  isBuiltIn: false,
  isFeatured: false,
  isActive: true,
  isArchived: false,
  coverImagePath: null,
  exercises: [],
};

function renderDetail(plan: WorkoutPlan) {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <WorkoutPlanDetail
        plan={plan}
        isStarting={false}
        onStart={vi.fn()}
      />
    </ThemeProvider>,
  );
}

describe("PLAN-013 workout-plan detail actions", () => {
  afterEach(cleanup);

  it("shows deletion for a private plan and retains Start workout", () => {
    renderDetail(privatePlan);

    expect(screen.getByRole("button", { name: "Start workout" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Delete plan" })).toBeTruthy();
  });

  it("does not expose deletion for a built-in plan", () => {
    renderDetail({ ...privatePlan, userId: null, isBuiltIn: true });

    expect(screen.queryByRole("button", { name: "Delete plan" })).toBeNull();
    expect(screen.getByRole("button", { name: "Start workout" })).toBeTruthy();
  });
});
