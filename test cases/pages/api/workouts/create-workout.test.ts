import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findExercises: vi.fn(),
  createWorkout: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({ getUserIdOrSetError: mocks.getUserId }));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    exercise: { findMany: mocks.findExercises },
    workout: { create: mocks.createWorkout },
  },
}));

import handler from "fitness/pages/api/workouts/create-workout";

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

const requestBody = {
  name: "Push day",
  workoutDate: "2026-09-19T12:00:00.000Z",
  entryMode: "LIVE",
  exerciseIds: ["exercise_1", "exercise_2"],
};

describe("WORKOUT-018 DES-021 workout creation authority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserId.mockResolvedValue("user_1");
    mocks.findExercises.mockResolvedValue([{ id: "exercise_1" }, { id: "exercise_2" }]);
    mocks.createWorkout.mockResolvedValue({ id: "workout_1" });
  });

  it("rejects an exercise that became inactive without creating a partial workout", async () => {
    mocks.findExercises.mockResolvedValue([{ id: "exercise_1" }]);
    const res = responseDouble();

    await handler({ method: "POST", body: requestBody } as NextApiRequest, res.response);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toEqual({ error: "One or more selected exercises are unavailable" });
    expect(mocks.createWorkout).not.toHaveBeenCalled();
  });

  it("creates one owner aggregate with ordered unique active exercises", async () => {
    const res = responseDouble();

    await handler({ method: "POST", body: requestBody } as NextApiRequest, res.response);

    expect(mocks.findExercises).toHaveBeenCalledWith({
      where: { id: { in: ["exercise_1", "exercise_2"] }, isActive: true },
      select: { id: true },
    });
    expect(mocks.createWorkout).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user_1",
        status: "IN_PROGRESS",
        exercises: {
          create: [
            { exerciseId: "exercise_1", order: 0 },
            { exerciseId: "exercise_2", order: 1 },
          ],
        },
      }),
    });
    expect(res.statusCode()).toBe(201);
  });

  it("rejects more than 50 unique exercises before data access", async () => {
    const res = responseDouble();

    await handler(
      {
        method: "POST",
        body: { ...requestBody, exerciseIds: Array.from({ length: 51 }, (_, index) => `e_${index}`) },
      } as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(400);
    expect(mocks.findExercises).not.toHaveBeenCalled();
    expect(mocks.createWorkout).not.toHaveBeenCalled();
  });
});
