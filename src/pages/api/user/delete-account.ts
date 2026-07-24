import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfDeleteOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  if (req.query.confirm !== "DELETE")
    return res.status(400).json({ error: "Confirmation required" });
  const [isAdmin, activeAdminCount] = await Promise.all([
    prisma.adminAccess.findUnique({ where: { userId } }),
    prisma.adminAccess.count({
      where: { user: { isDisabled: false, deletedAt: null } },
    }),
  ]);
  if (isAdmin && activeAdminCount <= 1) {
    return res.status(409).json({
      error: "Grant another active administrator before deleting this account",
    });
  }
  await prisma.$transaction(async (tx) => {
    await tx.workout.deleteMany({ where: { userId } });
    await tx.workoutPlan.deleteMany({ where: { userId } });
    await tx.userProfile.deleteMany({ where: { userId } });
    await tx.adminAccess.deleteMany({ where: { userId } });
    await tx.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@fitwell.invalid`,
        displayName: null,
        photoURL: null,
        isDisabled: true,
        deletedAt: new Date(),
      },
    });
  });
  return res.json({ success: true });
}
