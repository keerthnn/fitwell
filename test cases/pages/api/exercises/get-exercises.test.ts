import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findMany: vi.fn(),
  findAdmin: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserId,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    exercise: { findMany: mocks.findMany },
    adminAccess: { findUnique: mocks.findAdmin },
  },
}));

import handler from "fitness/pages/api/exercises/get-exercises";

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

const exercise = (id: string, name: string, category: string, primaryMuscle: string) => ({
  id,
  name,
  category,
  primaryMuscle,
  secondaryMuscles: [],
  isActive: true,
});

describe("EXERCISE-011 EXERCISE-012 EXERCISE-013 DES-013 DES-014 exercise list API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserId.mockResolvedValue("user_1");
    mocks.findAdmin.mockResolvedValue(null);
    mocks.findMany.mockResolvedValue([]);
  });

  it("rejects unsupported methods before authentication", async () => {
    const res = responseDouble();

    await handler(
      { method: "POST", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(405);
    expect(mocks.getUserId).not.toHaveBeenCalled();
    expect(mocks.findMany).not.toHaveBeenCalled();
  });

  it("does not query catalog data when authentication fails", async () => {
    mocks.getUserId.mockResolvedValue(undefined);
    const res = responseDouble();

    await handler(
      { method: "GET", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findMany).not.toHaveBeenCalled();
  });

  it("filters the active catalog by the selected category union only", async () => {
    mocks.findMany.mockResolvedValue([
      exercise("back_1", "Low row", "Back", "Lower lats"),
      exercise("triceps_1", "Pressdown", "Triceps", "Triceps"),
    ]);
    const res = responseDouble();

    await handler(
      {
        method: "GET",
        query: {
          categories: "Back,Triceps",
          search: "press",
          limit: "24",
        },
      } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
        name: { contains: "press", mode: "insensitive" },
        category: { in: ["Back", "Triceps"] },
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      take: 25,
    });
    expect(res.body()).toEqual({
      items: [
        exercise("back_1", "Low row", "Back", "Lower lats"),
        exercise("triceps_1", "Pressdown", "Triceps", "Triceps"),
      ],
      nextCursor: null,
    });
  });

  it("EXERCISE-012 filters by the selected equipment union", async () => {
    const res = responseDouble();

    await handler(
      {
        method: "GET",
        query: { equipments: "BARBELL,BODYWEIGHT", limit: "24" },
      } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
        equipment: { in: ["BARBELL", "BODYWEIGHT"] },
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      take: 25,
    });
  });

  it("leaves Full Body and unknown categories reachable when browsing all", async () => {
    mocks.findMany.mockResolvedValue([
      exercise("full_1", "Burpee", "Full Body", "Full Body"),
      exercise("other_1", "Mobility flow", "Mobility", "Hips"),
    ]);
    const res = responseDouble();

    await handler(
      { method: "GET", query: { limit: "24" } } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      take: 25,
    });
    expect(res.body()).toMatchObject({
      items: [
        expect.objectContaining({ category: "Full Body" }),
        expect.objectContaining({ category: "Mobility" }),
      ],
    });
  });

  it("returns bounded deterministic cursor pages without repeated response rows", async () => {
    const first = exercise("a", "Press", "Chest", "Chest");
    const second = exercise("b", "Press", "Chest", "Chest");
    const lookahead = exercise("c", "Press fly", "Chest", "Chest");
    mocks.findMany.mockResolvedValue([first, second, lookahead]);
    const res = responseDouble();

    await handler(
      {
        method: "GET",
        query: { categories: "Chest", limit: "2", cursor: "prior" },
      } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ name: "asc" }, { id: "asc" }],
        take: 3,
        cursor: { id: "prior" },
        skip: 1,
      }),
    );
    expect(res.body()).toEqual({ items: [first, second], nextCursor: "b" });
  });

  it("rejects malformed discovery input without querying", async () => {
    const res = responseDouble();

    await handler(
      {
        method: "GET",
        query: { category: "Chest", categories: "Back" },
      } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(400);
    expect(mocks.findMany).not.toHaveBeenCalled();
  });

  it("cannot expose inactive exercises through discovery inputs", async () => {
    const res = responseDouble();

    await handler(
      {
        method: "GET",
        query: { categories: "Chest", includeInactive: "true" },
      } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findAdmin).toHaveBeenCalledWith({ where: { userId: "user_1" } });
    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      }),
    );
  });
});
