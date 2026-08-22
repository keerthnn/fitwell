import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findVisible: vi.fn(),
  create: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserId,
}));
vi.mock("fitness/lib/workoutPlans/access", () => ({
  findVisibleWorkoutPlan: mocks.findVisible,
  workoutPlanInclude: { exercises: true },
}));
vi.mock("fitness/lib/prisma", () => ({
  default: { workoutPlan: { create: mocks.create } },
}));

import handler from "fitness/pages/api/workout-plans/duplicate";

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
  return {
    response: response as unknown as NextApiResponse,
    statusCode: () => statusCode,
    body: () => body,
  };
}

const source = {
  id: "source_1",
  name: "Strength",
  description: "Source description",
  difficulty: "INTERMEDIATE",
  category: "Strength",
  daysPerWeek: 3,
  coverImagePath: null,
  exercises: [
    {
      exerciseId: "exercise_1",
      order: 0,
      sets: 4,
      minimumReps: 6,
      maximumReps: 8,
      weightGuidance: "Heavy",
      restSeconds: 120,
      notes: "Controlled",
    },
  ],
};

describe("PLAN-010 SEC-002 duplicate workout-plan API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserId.mockResolvedValue("user_1");
  });

  it("rejects non-POST methods before authentication or data access", async () => {
    const res = responseDouble();

    await handler(
      { method: "GET", body: {} } as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(405);
    expect(mocks.getUserId).not.toHaveBeenCalled();
    expect(mocks.findVisible).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("does not access plan data when authentication fails", async () => {
    mocks.getUserId.mockResolvedValue(undefined);
    const res = responseDouble();

    await handler(
      {
        method: "POST",
        body: { id: "source_1", name: "My plan" },
      } as NextApiRequest,
      res.response,
    );

    expect(mocks.findVisible).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it.each(["   ", "a".repeat(121)])(
    "rejects invalid destination name without reading or creating data",
    async (name) => {
      const res = responseDouble();

      await handler(
        {
          method: "POST",
          body: { id: "source_1", name },
        } as NextApiRequest,
        res.response,
      );

      expect(res.statusCode()).toBe(400);
      expect(mocks.findVisible).not.toHaveBeenCalled();
      expect(mocks.create).not.toHaveBeenCalled();
    },
  );

  it("returns a non-disclosing 404 for an inaccessible source", async () => {
    mocks.findVisible.mockResolvedValue(null);
    const res = responseDouble();

    await handler(
      {
        method: "POST",
        body: { id: "source_1", name: "My plan" },
      } as NextApiRequest,
      res.response,
    );

    expect(mocks.findVisible).toHaveBeenCalledWith("source_1", "user_1");
    expect(res.statusCode()).toBe(404);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("creates a caller-owned private copy with the trimmed submitted name", async () => {
    mocks.findVisible.mockResolvedValue(source);
    mocks.create.mockResolvedValue({ id: "copy_1", name: "My copy" });
    const res = responseDouble();

    await handler(
      {
        method: "POST",
        body: { id: "source_1", name: "  My copy  " },
      } as NextApiRequest,
      res.response,
    );

    expect(mocks.findVisible).toHaveBeenCalledWith("source_1", "user_1");
    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        userId: "user_1",
        name: "My copy",
        description: source.description,
        difficulty: source.difficulty,
        category: source.category,
        daysPerWeek: source.daysPerWeek,
        coverImagePath: source.coverImagePath,
        isBuiltIn: false,
        exercises: {
          create: source.exercises.map(({ exerciseId, ...item }) => ({
            exerciseId,
            ...item,
          })),
        },
      },
      include: { exercises: true },
    });
    expect(res.statusCode()).toBe(201);
    expect(res.body()).toEqual({ id: "copy_1", name: "My copy" });
  });
});
