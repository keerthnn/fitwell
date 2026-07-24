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
  if (!result.valid) return res.status(400).json({ errors: result.errors });
  const target = await prisma.user.findFirst({
    where: { id: result.data.id, isDisabled: false, deletedAt: null },
  });
  if (!target) return res.status(404).json({ error: "Active user not found" });
  await prisma.$transaction(async (tx) => {
    await tx.adminAccess.upsert({
      where: { userId: target.id },
      create: { userId: target.id, grantedById: adminId },
      update: {},
    });
    await tx.adminAuditLog.create({
      data: auditData(adminId, "ADMIN_GRANTED", "AdminAccess", target.id),
    });
  });
  return res.status(200).json({ success: true });
}
