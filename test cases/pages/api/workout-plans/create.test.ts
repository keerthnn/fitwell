import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findExercises: vi.fn(),
  createPlan: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({ getUserIdOrSetError: mocks.getUserId }));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    exercise: { findMany: mocks.findExercises },
    workoutPlan: { create: mocks.createPlan },
  },
}));
vi.mock("fitness/lib/workoutPlans/access", () => ({ workoutPlanInclude: { exercises: true } }));

import handler from "fitness/pages/api/workout-plans/create";

function responseDouble() {
  let statusCode = 200;
  let body: unknown;
  const response = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return response;
    }),
    send: vi.fn((value: unknown) => {
      body = value;
      return response;
    }),
  };
  return { response: response as unknown as NextApiResponse, statusCode: () => statusCode, body: () => body };
}

const body = {
  name: "Push plan",
  description: "",
  difficulty: "BEGINNER",
  category: "Strength",
  daysPerWeek: 3,
  exercises: [
    { exerciseId: "exercise_1", order: 0, sets: 3, minimumReps: 8, maximumReps: 12, restSeconds: 90 },
  ],
};

describe("PLAN-014 DES-021 workout-plan creation authority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserId.mockResolvedValue("user_1");
    mocks.findExercises.mockResolvedValue([{ id: "exercise_1" }]);
    mocks.createPlan.mockResolvedValue({ id: "plan_1", exercises: [] });
  });

  it("rejects an exercise that became inactive without creating a partial plan", async () => {
    mocks.findExercises.mockResolvedValue([]);
    const res = responseDouble();

    await handler({ method: "POST", body } as NextApiRequest, res.response);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toEqual({ error: "One or more selected exercises are unavailable" });
    expect(mocks.createPlan).not.toHaveBeenCalled();
  });

  it("creates a caller-owned private plan after validating active exercises", async () => {
    const res = responseDouble();

    await handler({ method: "POST", body } as NextApiRequest, res.response);

    expect(mocks.findExercises).toHaveBeenCalledWith({
      where: { id: { in: ["exercise_1"] }, isActive: true },
      select: { id: true },
    });
    expect(mocks.createPlan).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: "user_1", isBuiltIn: false }) }),
    );
    expect(res.statusCode()).toBe(201);
  });
});
