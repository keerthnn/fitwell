import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserIdOrSetError: vi.fn(),
  requireAdmin: vi.fn(),
  transaction: vi.fn(),
  workoutDeleteMany: vi.fn(),
  workoutPlanDeleteMany: vi.fn(),
  feedbackDeleteMany: vi.fn(),
  profileDeleteMany: vi.fn(),
  accessDeleteMany: vi.fn(),
  accessFindUnique: vi.fn(),
  accessCount: vi.fn(),
  userUpdate: vi.fn(),
  auditCreate: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserIdOrSetError,
}));
vi.mock("fitness/lib/auth/requireAdmin", () => ({
  requireAdmin: mocks.requireAdmin,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    adminAccess: {
      findUnique: mocks.accessFindUnique,
      count: mocks.accessCount,
    },
    $transaction: mocks.transaction,
  },
}));

import deleteOwnAccountHandler from "../../pages/api/user/delete-account";
import adminDeleteAccountHandler from "../../pages/api/admin/users/delete";

function response() {
  const res = {} as NextApiResponse;
  res.status = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
}

function request(query: Record<string, string>) {
  const req = {} as NextApiRequest;
  req.method = "DELETE";
  req.query = query;
  return req;
}

describe("feedback account deletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserIdOrSetError.mockResolvedValue("user-1");
    mocks.requireAdmin.mockResolvedValue("admin-1");
    mocks.accessFindUnique.mockResolvedValue(null);
    mocks.accessCount.mockResolvedValue(2);
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        workout: { deleteMany: mocks.workoutDeleteMany },
        workoutPlan: { deleteMany: mocks.workoutPlanDeleteMany },
        feedback: { deleteMany: mocks.feedbackDeleteMany },
        userProfile: { deleteMany: mocks.profileDeleteMany },
        adminAccess: { deleteMany: mocks.accessDeleteMany },
        user: { update: mocks.userUpdate },
        adminAuditLog: { create: mocks.auditCreate },
      }),
    );
  });

  it("removes feedback owned by a user deleting their account", async () => {
    await deleteOwnAccountHandler(
      request({ confirm: "DELETE" }),
      response(),
    );

    expect(mocks.feedbackDeleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    });
  });

  it("removes only target-owned feedback during admin deletion", async () => {
    await adminDeleteAccountHandler(
      request({ id: "user-2" }),
      response(),
    );

    expect(mocks.feedbackDeleteMany).toHaveBeenCalledWith({
      where: { userId: "user-2" },
    });
  });
});
