import type { NextApiRequest, NextApiResponse } from "next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findUser: vi.fn(),
  findProfile: vi.fn(),
  findWorkouts: vi.fn(),
  findActiveWorkout: vi.fn(),
  findPlans: vi.fn(),
  groupExercises: vi.fn(),
  findExercises: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserId,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.findUser },
    userProfile: { findUnique: mocks.findProfile },
    workout: {
      findMany: mocks.findWorkouts,
      findFirst: mocks.findActiveWorkout,
    },
    workoutPlan: { findMany: mocks.findPlans },
    workoutExercise: { groupBy: mocks.groupExercises },
    exercise: { findMany: mocks.findExercises },
  },
}));

import handler from "fitness/pages/api/dashboard/summary";

function workout(workoutDate: string) {
  return {
    id: workoutDate,
    name: "Workout",
    workoutDate: new Date(workoutDate),
    status: "COMPLETED",
    entryMode: "LIVE",
    durationMinutes: 30,
    _count: { exercises: 0 },
    exercises: [],
    sourceWorkoutPlan: null,
  };
}

function responseDouble() {
  let body: unknown;
  const response = {
    status: vi.fn(() => response),
    send: vi.fn((value: unknown) => {
      body = value;
      return response;
    }),
  };
  return {
    response: response as unknown as NextApiResponse,
    body: () => body as Record<string, unknown>,
  };
}

describe("DASH-002 DASH-003 DES-006 dashboard weekly goal contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-16T12:00:00.000Z"));
    mocks.getUserId.mockResolvedValue("user_1");
    mocks.findUser.mockResolvedValue({ displayName: "Keerthan" });
    mocks.findProfile.mockResolvedValue({
      firstName: "Keerthan",
      timezone: "UTC",
      weeklyWorkoutTarget: 2,
      workoutDayTargetHistory: [
        { daysPerWeek: 2, effectiveAt: new Date("2026-08-01T00:00:00Z") },
      ],
    });
    mocks.findWorkouts.mockResolvedValue([
      workout("2026-09-14T08:00:00.000Z"),
      workout("2026-09-14T18:00:00.000Z"),
      workout("2026-09-15T08:00:00.000Z"),
      workout("2026-09-07T08:00:00.000Z"),
      workout("2026-09-08T08:00:00.000Z"),
    ]);
    mocks.findActiveWorkout.mockResolvedValue(null);
    mocks.findPlans.mockResolvedValue([]);
    mocks.groupExercises.mockResolvedValue([]);
    mocks.findExercises.mockResolvedValue([]);
  });

  afterEach(() => vi.useRealTimers());

  it("returns distinct workout days and a weekly streak without exposing history", async () => {
    const res = responseDouble();
    await handler({ method: "GET", query: {} } as NextApiRequest, res.response);

    expect(mocks.findWorkouts).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user_1", status: "COMPLETED" },
      }),
    );
    expect(res.body()).toMatchObject({
      workoutDaysThisWeek: 2,
      weeklyWorkoutDayTarget: 2,
      weeklyGoalStreak: 2,
    });
    expect(res.body()).not.toHaveProperty("workoutsThisWeek");
    expect(res.body()).not.toHaveProperty("weeklyTarget");
    expect(res.body()).not.toHaveProperty("currentStreak");
    expect(JSON.stringify(res.body())).not.toContain("targetHistory");
  });
});
