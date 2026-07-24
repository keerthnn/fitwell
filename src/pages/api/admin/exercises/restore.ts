import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateAdminTarget } from "fitness/lib/api/validators/admin";
import { auditData } from "fitness/lib/admin/audit";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfPostOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const result = validateAdminTarget(req.body);
  if (!result.valid) return res.status(400).json({ errors: result.errors });
  await prisma.$transaction(async (tx) => {
    await tx.exercise.update({ where: { id: result.data.id }, data: { isActive: true } });
    await tx.adminAuditLog.create({ data: auditData(adminId, "EXERCISE_RESTORED", "Exercise", result.data.id) });
  });
  return res.status(200).json({ success: true });
}
