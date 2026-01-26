import prisma from "fitness/lib/prisma";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> {
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return null;

  const admin = await prisma.adminAccess.findUnique({
    where: { userId },
  });

  if (!admin) {
    res.status(403).send("Admin access required");
    return null;
  }

  return userId;
}
