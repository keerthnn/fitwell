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
  const items = await prisma.adminAccess.findMany({
    include: {
      user: {
        select: { id: true, email: true, displayName: true, isDisabled: true },
      },
      grantedBy: { select: { email: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  return res.status(200).send({ items });
}
