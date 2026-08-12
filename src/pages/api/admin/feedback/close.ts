import { auditData } from "fitness/lib/admin/audit";
import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateFeedbackTarget } from "fitness/lib/api/validators/feedback";
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
  const validation = validateFeedbackTarget(req.body);
  if (!validation.valid)
    return res
      .status(400)
      .send({ error: "Invalid feedback", details: validation.errors });

  const feedback = await prisma.feedback.findUnique({
    where: { id: validation.data.feedbackId },
    select: { id: true, status: true },
  });
  if (!feedback)
    return res.status(404).send({ error: "Feedback not found" });
  if (feedback.status === "CLOSED")
    return res.status(200).send({ success: true, status: "CLOSED" });

  await prisma.$transaction(async (tx) => {
    const updated = await tx.feedback.updateMany({
      where: { id: feedback.id, status: { not: "CLOSED" } },
      data: { status: "CLOSED" },
    });
    if (!updated.count) return;
    await tx.adminAuditLog.create({
      data: auditData(adminId, "FEEDBACK_CLOSED", "Feedback", feedback.id),
    });
  });

  return res.status(200).send({ success: true, status: "CLOSED" });
}
