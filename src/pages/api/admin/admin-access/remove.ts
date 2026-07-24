import { auditData } from "fitness/lib/admin/audit";
import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateAdminTarget } from "fitness/lib/api/validators/admin";
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
  const result = validateAdminTarget(req.body);
  if (!result.valid) return res.status(400).send({ errors: result.errors });
  const activeAdmins = await prisma.adminAccess.count({
    where: { user: { isDisabled: false, deletedAt: null } },
  });
  if (activeAdmins <= 1)
    return res
      .status(409)
      .send({ error: "The final active admin cannot be removed" });
  await prisma.$transaction(async (tx) => {
    await tx.adminAccess.delete({ where: { userId: result.data.id } });
    await tx.adminAuditLog.create({
      data: auditData(adminId, "ADMIN_REMOVED", "AdminAccess", result.data.id),
    });
  });
  return res.status(200).send({ success: true });
}
