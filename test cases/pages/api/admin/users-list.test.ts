import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  findUsers: vi.fn(),
}));

vi.mock("fitness/lib/auth/requireAdmin", () => ({
  requireAdmin: mocks.requireAdmin,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: { user: { findMany: mocks.findUsers } },
}));

import handler from "fitness/pages/api/admin/users/list";

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

describe("ADMIN-003 scoped user lists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    mocks.requireAdmin.mockResolvedValue("admin_1");
    mocks.findUsers.mockResolvedValue([]);
  });

  it("lists all non-deleted users for the total-users scope", async () => {
    const res = responseDouble();

    await handler(
      { method: "GET", query: { scope: "total" } } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findUsers).toHaveBeenCalledWith(
      expect.objectContaining({ where: { deletedAt: null } }),
    );
    expect(res.body()).toEqual({ items: [], nextCursor: null });
  });

  it("lists enabled users with authenticated activity since UTC midnight", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-21T18:45:00.000Z"));
    const res = responseDouble();

    await handler(
      { method: "GET", query: { scope: "active" } } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isDisabled: false,
          deletedAt: null,
          activityDays: {
            some: {
              lastActiveAt: { gte: new Date("2026-09-21T00:00:00.000Z") },
            },
          },
        },
      }),
    );
  });
});
