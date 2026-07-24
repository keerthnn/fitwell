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
  const items = await prisma.workout.findMany({
    include: {
      user: { select: { email: true, displayName: true } },
      _count: { select: { exercises: true } },
    },
    orderBy: { workoutDate: "desc" },
    take: 100,
  });
  return res.status(200).json({ items, nextCursor: null });
}
