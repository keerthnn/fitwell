import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  if (!(await requireAdmin(req, res))) return;
  const items = await prisma.adminAuditLog.findMany({
    include: { admin: { select: { email: true, displayName: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return res.status(200).send({ items });
}
