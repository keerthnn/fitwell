import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  countDailyActiveUsers: vi.fn(),
  countUsers: vi.fn(),
  countWorkouts: vi.fn(),
  countExercises: vi.fn(),
  countWorkoutPlans: vi.fn(),
}));

vi.mock("fitness/lib/auth/requireAdmin", () => ({
  requireAdmin: mocks.requireAdmin,
}));
vi.mock("fitness/lib/analytics/activity", () => ({
  countDailyActiveUsers: mocks.countDailyActiveUsers,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    user: { count: mocks.countUsers },
    workout: { count: mocks.countWorkouts },
    exercise: { count: mocks.countExercises },
    workoutPlan: { count: mocks.countWorkoutPlans },
  },
}));

import handler from "fitness/pages/api/admin/dashboard/summary";

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
    body: () => body,
  };
}

describe("ADMIN-002 separate total and daily active users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockResolvedValue("admin_1");
    mocks.countUsers.mockResolvedValue(12);
    mocks.countDailyActiveUsers.mockResolvedValue(4);
    mocks.countWorkouts.mockResolvedValue(30);
    mocks.countExercises.mockResolvedValue(80);
    mocks.countWorkoutPlans.mockResolvedValue(6);
  });

  it("returns total users independently from users active today", async () => {
    const res = responseDouble();

    await handler({ method: "GET" } as NextApiRequest, res.response);

    expect(mocks.countUsers).toHaveBeenCalledWith({
      where: { deletedAt: null },
    });
    expect(res.body()).toEqual({
      totalUsers: 12,
      activeUsers: 4,
      workouts: 30,
      exercises: 80,
      workoutPlans: 6,
    });
  });
});
