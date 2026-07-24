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
  const changed = await prisma.$transaction(async (tx) => {
    const update = await tx.workoutPlan.updateMany({ where: { id: result.data.id, userId: null, isBuiltIn: true }, data: { isArchived: true } });
    if (update.count) await tx.adminAuditLog.create({ data: auditData(adminId, "WORKOUT_PLAN_ARCHIVED", "WorkoutPlan", result.data.id) });
    return update.count;
  });
  if (!changed) return res.status(404).json({ error: "Built-in Workout Plan not found" });
  return res.status(200).json({ success: true });
}
