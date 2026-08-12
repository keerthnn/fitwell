import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  RequestInputObject,
  RequestInputValue,
} from "fitness/utils/types";

const mocks = vi.hoisted(() => ({
  getUserIdOrSetError: vi.fn(),
  findFirst: vi.fn(),
  transaction: vi.fn(),
  deleteMany: vi.fn(),
  createMany: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserIdOrSetError,
}));

vi.mock("fitness/lib/prisma", () => ({
  default: {
    workoutExercise: { findFirst: mocks.findFirst },
    $transaction: mocks.transaction,
  },
}));

import handler from "../../pages/api/workout-exercises/save-sets";

function request(sets: RequestInputValue[]): NextApiRequest {
  return {
    method: "POST",
    body: { workoutExerciseId: "workout-exercise-1", sets },
  } as NextApiRequest;
}

function response() {
  const state: { status: number; body?: RequestInputValue } = { status: 200 };
  const res = {} as NextApiResponse;
  res.status = vi.fn((status: number) => {
    state.status = status;
    return res;
  });
  res.send = vi.fn((body: RequestInputValue) => {
    state.body = body;
    return res;
  });
  return { res, state };
}

const set: RequestInputObject = {
  setNumber: 1,
  reps: 8,
  weightKg: 20,
  durationSeconds: null,
  distanceMeters: null,
  restSeconds: 90,
  isCompleted: false,
};

describe("save workout exercise sets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserIdOrSetError.mockResolvedValue("user-1");
    mocks.findFirst.mockResolvedValue({
      id: "workout-exercise-1",
      exercise: { trackingType: "REPS_WEIGHT" },
    });
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        workoutSet: {
          deleteMany: mocks.deleteMany,
          createMany: mocks.createMany,
        },
      }),
    );
  });

  it("returns field-level errors and does not write when reps and weight are missing", async () => {
    const { res, state } = response();

    await handler(request([{ ...set, reps: null, weightKg: null }]), res);

    expect(state.status).toBe(400);
    expect(state.body).toEqual({
      error: "Invalid sets",
      details: [
        { field: "sets.0.reps", message: "Reps are required" },
        { field: "sets.0.weightKg", message: "Weight is required" },
      ],
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("uses the owned exercise tracking type and accepts an explicit zero weight", async () => {
    const { res, state } = response();

    await handler(request([{ ...set, reps: 8, weightKg: 0 }]), res);

    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: {
        id: "workout-exercise-1",
        workout: { userId: "user-1" },
      },
      select: {
        id: true,
        exercise: { select: { trackingType: true } },
      },
    });
    expect(mocks.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ reps: 8, weightKg: 0 })],
    });
    expect(state.status).toBe(200);
    expect(state.body).toEqual({ success: true });
  });

  it("does not require weight for a reps-only exercise", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "workout-exercise-1",
      exercise: { trackingType: "REPS_ONLY" },
    });
    const { res, state } = response();

    await handler(request([{ ...set, weightKg: null }]), res);

    expect(state.status).toBe(200);
    expect(mocks.transaction).toHaveBeenCalledOnce();
  });
});
