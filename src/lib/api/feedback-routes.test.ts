import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestInputValue } from "fitness/utils/types";

const mocks = vi.hoisted(() => ({
  getUserIdOrSetError: vi.fn(),
  requireAdmin: vi.fn(),
  findFirst: vi.fn(),
  findUnique: vi.fn(),
  transaction: vi.fn(),
  messageCreate: vi.fn(),
  feedbackUpdateMany: vi.fn(),
  feedbackDeleteMany: vi.fn(),
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
    feedback: {
      findFirst: mocks.findFirst,
      findUnique: mocks.findUnique,
      deleteMany: mocks.feedbackDeleteMany,
    },
    $transaction: mocks.transaction,
  },
}));

import userReplyHandler from "../../pages/api/feedback/reply";
import userDeleteHandler from "../../pages/api/feedback/delete";
import adminReplyHandler from "../../pages/api/admin/feedback/reply";
import adminCloseHandler from "../../pages/api/admin/feedback/close";

function request(body: RequestInputValue): NextApiRequest {
  return { method: "POST", body } as NextApiRequest;
}

function deleteRequest(id: string): NextApiRequest {
  const req = {} as NextApiRequest;
  req.method = "DELETE";
  req.query = { id };
  return req;
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

describe("feedback reply routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserIdOrSetError.mockResolvedValue("user-1");
    mocks.requireAdmin.mockResolvedValue("admin-1");
    mocks.findFirst.mockResolvedValue({
      id: "feedback-1",
      _count: { messages: 0 },
    });
    mocks.findUnique.mockResolvedValue({ id: "feedback-1", status: "OPEN" });
    mocks.feedbackUpdateMany.mockResolvedValue({ count: 1 });
    mocks.feedbackDeleteMany.mockResolvedValue({ count: 1 });
    mocks.messageCreate.mockResolvedValue({
      id: "message-1",
      authorRole: "USER",
      content: "Follow-up",
      createdAt: new Date("2026-08-12T00:00:00Z"),
    });
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        feedbackMessage: { create: mocks.messageCreate },
        feedback: { updateMany: mocks.feedbackUpdateMany },
        adminAuditLog: { create: mocks.auditCreate },
      }),
    );
  });

  it("rejects signed-out user replies before reading feedback", async () => {
    mocks.getUserIdOrSetError.mockImplementation(
      async (_req: NextApiRequest, res: NextApiResponse) => {
        res.status(401).send({ error: "Authentication required" });
        return null;
      },
    );
    const { res, state } = response();

    await userReplyHandler(
      request({ feedbackId: "feedback-1", message: "Follow-up" }),
      res,
    );

    expect(state.status).toBe(401);
    expect(mocks.findFirst).not.toHaveBeenCalled();
  });

  it("does not reveal or update another user's conversation", async () => {
    mocks.findFirst.mockResolvedValue(null);
    const { res, state } = response();

    await userReplyHandler(
      request({ feedbackId: "feedback-2", message: "Follow-up" }),
      res,
    );

    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: { id: "feedback-2", userId: "user-1" },
      select: { id: true },
    });
    expect(state.status).toBe(404);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("stores a user follow-up and reopens the conversation", async () => {
    const { res, state } = response();

    await userReplyHandler(
      request({ feedbackId: "feedback-1", message: "  Follow-up  " }),
      res,
    );

    expect(mocks.messageCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          feedbackId: "feedback-1",
          authorId: "user-1",
          authorRole: "USER",
          content: "Follow-up",
        }),
      }),
    );
    expect(mocks.feedbackUpdateMany).toHaveBeenCalledWith({
      where: { id: "feedback-1", status: { not: "CLOSED" } },
      data: { status: "OPEN", lastMessageAt: expect.any(Date) },
    });
    expect(state.status).toBe(201);
  });

  it("blocks non-admin replies", async () => {
    mocks.requireAdmin.mockResolvedValue(null);
    const { res } = response();

    await adminReplyHandler(
      request({ feedbackId: "feedback-1", message: "Answer" }),
      res,
    );

    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("stores an admin reply, responds, and audits without message content", async () => {
    mocks.messageCreate.mockResolvedValue({
      id: "message-2",
      authorRole: "ADMIN",
      content: "Answer",
      createdAt: new Date("2026-08-12T00:00:00Z"),
    });
    const { res, state } = response();

    await adminReplyHandler(
      request({ feedbackId: "feedback-1", message: "Answer" }),
      res,
    );

    expect(mocks.feedbackUpdateMany).toHaveBeenCalledWith({
      where: { id: "feedback-1", status: { not: "CLOSED" } },
      data: { status: "RESPONDED", lastMessageAt: expect.any(Date) },
    });
    expect(mocks.auditCreate).toHaveBeenCalledWith({
      data: {
        adminId: "admin-1",
        action: "FEEDBACK_REPLIED",
        entityType: "Feedback",
        entityId: "feedback-1",
      },
    });
    expect(JSON.stringify(mocks.auditCreate.mock.calls)).not.toContain("Answer");
    expect(state.status).toBe(201);
  });

  it("rejects replies after an admin closes the feedback", async () => {
    mocks.feedbackUpdateMany.mockResolvedValue({ count: 0 });
    const { res, state } = response();

    await userReplyHandler(
      request({ feedbackId: "feedback-1", message: "Follow-up" }),
      res,
    );

    expect(state.status).toBe(409);
    expect(mocks.messageCreate).not.toHaveBeenCalled();
  });

  it("lets an admin close feedback and records an audit event", async () => {
    const { res, state } = response();

    await adminCloseHandler(request({ feedbackId: "feedback-1" }), res);

    expect(mocks.feedbackUpdateMany).toHaveBeenCalledWith({
      where: { id: "feedback-1", status: { not: "CLOSED" } },
      data: { status: "CLOSED" },
    });
    expect(mocks.auditCreate).toHaveBeenCalledWith({
      data: {
        adminId: "admin-1",
        action: "FEEDBACK_CLOSED",
        entityType: "Feedback",
        entityId: "feedback-1",
      },
    });
    expect(state.status).toBe(200);
  });

  it("allows the owner to delete feedback before any admin reply", async () => {
    const { res, state } = response();

    await userDeleteHandler(deleteRequest("feedback-1"), res);

    expect(mocks.feedbackDeleteMany).toHaveBeenCalledWith({
      where: {
        id: "feedback-1",
        userId: "user-1",
        messages: { none: { authorRole: "ADMIN" } },
      },
    });
    expect(state.status).toBe(200);
  });

  it("blocks owner deletion after any admin reply", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "feedback-1",
      _count: { messages: 1 },
    });
    const { res, state } = response();

    await userDeleteHandler(deleteRequest("feedback-1"), res);

    expect(state.status).toBe(409);
    expect(mocks.feedbackDeleteMany).not.toHaveBeenCalled();
  });
});
