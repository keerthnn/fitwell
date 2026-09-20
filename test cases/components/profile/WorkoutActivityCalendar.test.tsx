// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen, within } from "@testing-library/react";
import type { ComponentType } from "react";
import createAppTheme from "fitness/theme";
import { afterEach, describe, expect, it, vi } from "vitest";

interface ActivityData {
  timezone: string;
  startDate: string;
  endDate: string;
  todayDate: string;
  completedDates: string[];
}

type ActivityProps = { data: ActivityData };

const componentModule = await vi
  .importActual<{ default: ComponentType<ActivityProps> }>(
    "fitness/components/profile/WorkoutActivityCalendar",
  )
  .catch(() => null);

const WorkoutActivityCalendar: ComponentType<ActivityProps> =
  componentModule?.default ??
  (() => <div data-testid="missing-workout-activity-calendar" />);

const activity: ActivityData = {
  timezone: "UTC",
  startDate: "2025-09-15",
  endDate: "2026-09-20",
  todayDate: "2026-09-16",
  completedDates: ["2026-09-14"],
};

function renderCalendar(data: ActivityData = activity) {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <WorkoutActivityCalendar data={data} />
    </ThemeProvider>,
  );
}

afterEach(cleanup);

describe("PROFILE-010 PROFILE-012 DES-012 DES-013 workout activity calendar", () => {
  it("renders 53 Monday-first weeks with month context and a binary legend", () => {
    renderCalendar();

    const calendar = screen.getByRole("grid", {
      name: "Workout activity calendar",
    });
    expect(within(calendar).getAllByRole("gridcell")).toHaveLength(371);
    expect(within(calendar).getByText("Mon")).toBeTruthy();
    expect(within(calendar).getByText("Sun")).toBeTruthy();
    expect(screen.getAllByText(/Sep/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Workout completed")).toBeTruthy();
    expect(screen.getByText("No completed workout")).toBeTruthy();
  });

  it("uses accessible date states plus a visible non-color mark", () => {
    renderCalendar();

    const completed = screen.getByRole("gridcell", {
      name: /September 14, 2026.*workout completed/i,
    });
    expect(completed.textContent?.trim()).not.toBe("");
    expect(
      screen.getByRole("gridcell", {
        name: /September 15, 2026.*no completed workout/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("gridcell", {
        name: /September 17, 2026.*future date unavailable/i,
      }),
    ).toBeTruthy();
  });

  it("keeps read-only dates out of keyboard action semantics", () => {
    renderCalendar();

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(
      screen
        .getAllByRole("gridcell")
        .filter((cell) => cell.getAttribute("tabindex") === "0"),
    ).toHaveLength(0);
  });

  it("DES-015 preserves server date keys regardless of the browser clock", () => {
    renderCalendar({
      ...activity,
      timezone: "Pacific/Kiritimati",
      todayDate: "2026-09-16",
      completedDates: ["2026-09-15"],
    });

    expect(
      screen.getByRole("gridcell", {
        name: /September 15, 2026.*workout completed/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("gridcell", {
        name: /September 17, 2026.*future date unavailable/i,
      }),
    ).toBeTruthy();
  });
});
