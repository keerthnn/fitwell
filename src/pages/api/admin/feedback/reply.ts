import { auditData } from "fitness/lib/admin/audit";
import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateFeedbackReply } from "fitness/lib/api/validators/feedback";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const validation = validateFeedbackReply(req.body);
  if (!validation.valid)
    return res
      .status(400)
      .send({ error: "Invalid reply", details: validation.errors });

  const feedback = await prisma.feedback.findUnique({
    where: { id: validation.data.feedbackId },
    select: { id: true },
  });
  if (!feedback)
    return res.status(404).send({ error: "Feedback not found" });

  const now = new Date();
  const message = await prisma.$transaction(async (tx) => {
    const updated = await tx.feedback.updateMany({
      where: { id: feedback.id, status: { not: "CLOSED" } },
      data: { status: "RESPONDED", lastMessageAt: now },
    });
    if (!updated.count) return null;
    const created = await tx.feedbackMessage.create({
      data: {
        feedbackId: feedback.id,
        authorId: adminId,
        authorRole: "ADMIN",
        content: validation.data.message,
        createdAt: now,
      },
      select: {
        id: true,
        authorRole: true,
        content: true,
        createdAt: true,
      },
    });
    await tx.adminAuditLog.create({
      data: auditData(adminId, "FEEDBACK_REPLIED", "Feedback", feedback.id),
    });
    return created;
  });

  if (!message)
    return res.status(409).send({ error: "Closed feedback cannot be updated" });

  return res.status(201).send({ message, status: "RESPONDED" });
}
