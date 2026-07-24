import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;

  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      adminAccess: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(users);
}
