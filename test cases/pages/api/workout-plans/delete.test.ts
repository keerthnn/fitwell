import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  deleteMany: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserId,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: { workoutPlan: { deleteMany: mocks.deleteMany } },
}));

import handler from "fitness/pages/api/workout-plans/delete";

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

describe("PLAN-013 SEC-002 owner-scoped workout-plan deletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserId.mockResolvedValue("user_1");
  });

  it("rejects non-DELETE methods before authentication or data access", async () => {
    const res = responseDouble();

    await handler(
      { method: "POST", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(405);
    expect(mocks.getUserId).not.toHaveBeenCalled();
    expect(mocks.deleteMany).not.toHaveBeenCalled();
  });

  it("does not delete plan data when authentication fails", async () => {
    mocks.getUserId.mockResolvedValue(undefined);
    const res = responseDouble();

    await handler(
      { method: "DELETE", query: { id: "plan_1" } } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.deleteMany).not.toHaveBeenCalled();
  });

  it("rejects an invalid ID before deleting", async () => {
    const res = responseDouble();

    await handler(
      { method: "DELETE", query: { id: "invalid id" } } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(400);
    expect(mocks.deleteMany).not.toHaveBeenCalled();
  });

  it("binds deletion to the authenticated owner and private-plan class", async () => {
    mocks.deleteMany.mockResolvedValue({ count: 1 });
    const res = responseDouble();

    await handler(
      { method: "DELETE", query: { id: "plan_1" } } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.deleteMany).toHaveBeenCalledWith({
      where: { id: "plan_1", userId: "user_1", isBuiltIn: false },
    });
    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true });
  });

  it("returns the same 404 when no owned private plan was deleted", async () => {
    mocks.deleteMany.mockResolvedValue({ count: 0 });
    const res = responseDouble();

    await handler(
      { method: "DELETE", query: { id: "plan_1" } } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(404);
    expect(res.body()).toEqual({ error: "Workout Plan not found" });
  });
});
