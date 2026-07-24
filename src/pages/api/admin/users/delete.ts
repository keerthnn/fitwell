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
  if (!isIdentifier(id) || id === adminId)
    return res.status(400).json({ error: "Invalid user target" });
  await prisma.$transaction(async (tx) => {
    await tx.workout.deleteMany({ where: { userId: id } });
    await tx.workoutPlan.deleteMany({
      where: { userId: id, isBuiltIn: false },
    });
    await tx.userProfile.deleteMany({ where: { userId: id } });
    await tx.adminAccess.deleteMany({ where: { userId: id } });
    await tx.user.update({
      where: { id },
      data: {
        email: `deleted-${id}@fitwell.invalid`,
        displayName: null,
        photoURL: null,
        isDisabled: true,
        deletedAt: new Date(),
      },
    });
    await tx.adminAuditLog.create({
      data: auditData(adminId, "USER_DELETED", "User", id),
    });
  });
  return res.status(200).json({ success: true });
}
