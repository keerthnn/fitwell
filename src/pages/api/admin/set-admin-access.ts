import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
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

  const { userId, isAdmin } = req.body;
  if (typeof userId !== "string" || typeof isAdmin !== "boolean") {
    return res.status(400).json({ error: "userId and isAdmin are required" });
  }

  if (userId === adminId && !isAdmin) {
    return res.status(400).json({ error: "You cannot remove your own admin access" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (isAdmin) {
    await prisma.adminAccess.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  } else {
    await prisma.adminAccess.deleteMany({ where: { userId } });
  }

  return res.status(200).json({ success: true, isAdmin });
}
