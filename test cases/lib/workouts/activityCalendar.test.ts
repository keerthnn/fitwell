import { describe, expect, it, vi } from "vitest";

interface ActivityRange {
  timezone: string;
  startDate: string;
  endDate: string;
  todayDate: string;
  queryStart: Date;
  queryEnd: Date;
}

interface ActivityCalendarModule {
  getWorkoutActivityRange: (
    now: Date,
    timezone?: string | null,
  ) => ActivityRange;
  getCompletedWorkoutDates: (
    workoutDates: Date[],
    range: ActivityRange,
  ) => string[];
  listCalendarDateKeys: (startDate: string, endDate: string) => string[];
}

const missingImplementation = () => {
  throw new Error("Workout activity calendar is not implemented");
};

const activityCalendar =
  (await vi
    .importActual<ActivityCalendarModule>(
      "fitness/lib/workouts/activityCalendar",
    )
    .catch(() => null)) ?? {
    getWorkoutActivityRange: missingImplementation,
    getCompletedWorkoutDates: missingImplementation,
    listCalendarDateKeys: missingImplementation,
  };

describe("PROFILE-010 DES-003 workout activity calendar range", () => {
  it.each([
    {
      label: "ordinary current week",
      now: "2026-09-16T10:00:00.000Z",
      timezone: "UTC",
      start: "2025-09-15",
      end: "2026-09-20",
      today: "2026-09-16",
    },
    {
      label: "year boundary",
      now: "2026-01-01T12:00:00.000Z",
      timezone: "UTC",
      start: "2024-12-30",
      end: "2026-01-04",
      today: "2026-01-01",
    },
    {
      label: "leap-year week",
      now: "2024-03-01T12:00:00.000Z",
      timezone: "UTC",
      start: "2023-02-27",
      end: "2024-03-03",
      today: "2024-03-01",
    },
  ])("builds exactly 53 Monday-first weeks for $label", (example) => {
    const range = activityCalendar.getWorkoutActivityRange(
      new Date(example.now),
      example.timezone,
    );
    const keys = activityCalendar.listCalendarDateKeys(
      range.startDate,
      range.endDate,
    );

    expect(range).toMatchObject({
      timezone: example.timezone,
      startDate: example.start,
      endDate: example.end,
      todayDate: example.today,
    });
    expect(keys).toHaveLength(371);
    expect(keys[0]).toBe(example.start);
    expect(keys.at(-1)).toBe(example.end);
  });
});

describe("PROFILE-011 DATA-005 DES-004 DES-006 member-local workout dates", () => {
  it.each([
    ["Asia/Kolkata", "2026-09-19T20:00:00.000Z", "2026-09-20"],
    ["America/Los_Angeles", "2026-09-20T02:00:00.000Z", "2026-09-19"],
    ["America/New_York", "2026-03-08T04:30:00.000Z", "2026-03-07"],
    ["America/New_York", "2026-03-08T07:30:00.000Z", "2026-03-08"],
  ])("groups %s instants without shifting the recorded day", (timezone, instant, expected) => {
    const range = activityCalendar.getWorkoutActivityRange(
      new Date("2026-09-20T12:00:00.000Z"),
      timezone,
    );

    expect(
      activityCalendar.getCompletedWorkoutDates([new Date(instant)], range),
    ).toEqual([expected]);
  });

  it("falls back to UTC when the stored timezone is missing or invalid", () => {
    expect(
      activityCalendar.getWorkoutActivityRange(
        new Date("2026-09-20T12:00:00.000Z"),
        null,
      ).timezone,
    ).toBe("UTC");
    expect(
      activityCalendar.getWorkoutActivityRange(
        new Date("2026-09-20T12:00:00.000Z"),
        "Not/A_Timezone",
      ).timezone,
    ).toBe("UTC");
  });

  it("deduplicates and sorts completed dates while excluding out-of-range and future dates", () => {
    const range = activityCalendar.getWorkoutActivityRange(
      new Date("2026-09-16T12:00:00.000Z"),
      "UTC",
    );

    expect(
      activityCalendar.getCompletedWorkoutDates(
        [
          new Date("2026-09-16T12:00:00.000Z"),
          new Date("2026-09-14T12:00:00.000Z"),
          new Date("2026-09-14T18:00:00.000Z"),
          new Date("2026-09-17T12:00:00.000Z"),
          new Date("2020-01-01T12:00:00.000Z"),
        ],
        range,
      ),
    ).toEqual(["2026-09-14", "2026-09-16"]);
    expect(range.queryStart.getTime()).toBeLessThan(
      new Date(`${range.startDate}T00:00:00.000Z`).getTime(),
    );
    expect(range.queryEnd.getTime()).toBeGreaterThan(
      new Date(`${range.todayDate}T23:59:59.999Z`).getTime(),
    );
  });
});
