import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findWorkout: vi.fn(),
  findExercise: vi.fn(),
  createWorkoutExercise: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({ getUserIdOrSetError: mocks.getUserId }));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    workout: { findFirst: mocks.findWorkout },
    exercise: { findFirst: mocks.findExercise },
    workoutExercise: { create: mocks.createWorkoutExercise },
  },
}));

import handler from "fitness/pages/api/workout-exercises/add-exercise";

function responseDouble() {
  let statusCode = 200;
  const response = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return response;
    }),
    send: vi.fn(() => response),
  };
  return { response: response as unknown as NextApiResponse, statusCode: () => statusCode };
}

describe("WORKOUT-019 SEC-002 DES-021 add exercise authority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserId.mockResolvedValue("user_1");
    mocks.findWorkout.mockResolvedValue({ id: "workout_1", userId: "user_1" });
    mocks.findExercise.mockResolvedValue({ id: "exercise_1", isActive: true });
    mocks.createWorkoutExercise.mockResolvedValue({ id: "item_1" });
  });

  it("binds workout ownership to the authenticated user", async () => {
    const res = responseDouble();

    await handler(
      { method: "POST", body: { workoutId: "workout_1", exerciseId: "exercise_1", order: 0 } } as NextApiRequest,
      res.response,
    );

    expect(mocks.findWorkout).toHaveBeenCalledWith({ where: { id: "workout_1", userId: "user_1" } });
    expect(mocks.createWorkoutExercise).toHaveBeenCalledWith({
      data: { workoutId: "workout_1", exerciseId: "exercise_1", order: 0 },
    });
  });

  it("rejects cross-user workout or inactive exercise without creating a row", async () => {
    mocks.findWorkout.mockResolvedValue(null);
    mocks.findExercise.mockResolvedValue(null);
    const res = responseDouble();

    await handler(
      { method: "POST", body: { workoutId: "other", exerciseId: "inactive", order: 0 } } as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(404);
    expect(mocks.findExercise).toHaveBeenCalledWith({ where: { id: "inactive", isActive: true } });
    expect(mocks.createWorkoutExercise).not.toHaveBeenCalled();
  });
});
