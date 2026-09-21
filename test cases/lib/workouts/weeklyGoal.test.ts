import { calculateWeeklyGoal } from "fitness/lib/workouts/weeklyGoal";
import { describe, expect, it } from "vitest";

const at = (value: string) => new Date(value);

describe("DASH-002 DASH-003 DES-005 weekly workout-day goals", () => {
  it("counts distinct completed dates rather than workout records", () => {
    expect(
      calculateWeeklyGoal({
        now: at("2026-09-16T12:00:00.000Z"),
        timezone: "UTC",
        currentTarget: 5,
        targetHistory: [],
        workoutDates: [
          at("2026-09-14T08:00:00.000Z"),
          at("2026-09-14T18:00:00.000Z"),
          at("2026-09-15T08:00:00.000Z"),
        ],
      }),
    ).toMatchObject({ workoutDaysThisWeek: 2, weeklyWorkoutDayTarget: 5 });
  });

  it("keeps a successful prior streak while the current week is pending", () => {
    const result = calculateWeeklyGoal({
      now: at("2026-09-16T12:00:00.000Z"),
      timezone: "UTC",
      currentTarget: 5,
      targetHistory: [
        { daysPerWeek: 5, effectiveAt: at("2026-08-01T00:00:00.000Z") },
      ],
      workoutDates: [
        ...[7, 8, 9, 10, 11].map((day) =>
          at(`2026-09-${String(day).padStart(2, "0")}T12:00:00.000Z`),
        ),
        at("2026-09-14T12:00:00.000Z"),
        at("2026-09-15T12:00:00.000Z"),
      ],
    });

    expect(result).toEqual({
      workoutDaysThisWeek: 2,
      weeklyWorkoutDayTarget: 5,
      weeklyGoalStreak: 1,
    });
  });

  it("uses historical targets for completed weeks and the new target for the current week", () => {
    const workoutDates = [
      ...[31].map((day) => at(`2026-08-${day}T12:00:00.000Z`)),
      ...[1, 2, 3, 4].map((day) =>
        at(`2026-09-${String(day).padStart(2, "0")}T12:00:00.000Z`),
      ),
      ...[7, 8, 9, 10, 11].map((day) =>
        at(`2026-09-${String(day).padStart(2, "0")}T12:00:00.000Z`),
      ),
      ...[14, 15, 16].map((day) =>
        at(`2026-09-${day}T12:00:00.000Z`),
      ),
    ];

    expect(
      calculateWeeklyGoal({
        now: at("2026-09-16T18:00:00.000Z"),
        timezone: "UTC",
        currentTarget: 3,
        targetHistory: [
          { daysPerWeek: 5, effectiveAt: at("2026-08-01T00:00:00.000Z") },
          { daysPerWeek: 3, effectiveAt: at("2026-09-16T10:00:00.000Z") },
        ],
        workoutDates,
      }),
    ).toEqual({
      workoutDaysThisWeek: 3,
      weeklyWorkoutDayTarget: 3,
      weeklyGoalStreak: 3,
    });
  });

  it("stops after a completed week misses its applicable target", () => {
    const result = calculateWeeklyGoal({
      now: at("2026-09-18T12:00:00.000Z"),
      timezone: "UTC",
      currentTarget: 3,
      targetHistory: [
        { daysPerWeek: 5, effectiveAt: at("2026-08-01T00:00:00.000Z") },
        { daysPerWeek: 3, effectiveAt: at("2026-09-14T00:00:00.000Z") },
      ],
      workoutDates: [
        ...[7, 8, 9, 10].map((day) =>
          at(`2026-09-${String(day).padStart(2, "0")}T12:00:00.000Z`),
        ),
        ...[14, 15, 16].map((day) =>
          at(`2026-09-${day}T12:00:00.000Z`),
        ),
      ],
    });

    expect(result.weeklyGoalStreak).toBe(1);
  });

  it("groups boundary workouts in the profile timezone", () => {
    expect(
      calculateWeeklyGoal({
        now: at("2026-09-14T12:00:00.000Z"),
        timezone: "Asia/Kolkata",
        currentTarget: 1,
        targetHistory: [],
        workoutDates: [at("2026-09-13T20:00:00.000Z")],
      }),
    ).toEqual({
      workoutDaysThisWeek: 1,
      weeklyWorkoutDayTarget: 1,
      weeklyGoalStreak: 1,
    });
  });
});
