import { auditData } from "fitness/lib/admin/audit";
import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfDeleteOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!isIdentifier(id))
    return res.status(400).json({ error: "Invalid workout id" });
  await prisma.$transaction(async (tx) => {
    await tx.workout.delete({ where: { id } });
    await tx.adminAuditLog.create({
      data: auditData(adminId, "WORKOUT_DELETED", "Workout", id),
    });
  });
  return res.status(200).json({ success: true });
}
