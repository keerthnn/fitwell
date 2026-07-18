import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import { adminAuth } from "fitness/lib/firebaseAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfDeleteOrSetError(req, res)) return;

  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const userId = req.query.userId;
  if (typeof userId !== "string") {
    return res.status(400).json({ error: "userId is required" });
  }

  if (userId === adminId) {
    return res.status(400).json({ error: "You cannot delete your own account" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  await adminAuth.deleteUser(userId);
  await prisma.user.delete({ where: { id: userId } });

  return res.status(200).json({ success: true });
}
