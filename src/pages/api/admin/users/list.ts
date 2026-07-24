import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfGetOrSetError(req, res)) return;
  if (!(await requireAdmin(req, res))) return;
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 120) : "";
  const users = await prisma.user.findMany({
    where: search ? { OR: [{ email: { contains: search, mode: "insensitive" } }, { displayName: { contains: search, mode: "insensitive" } }] } : undefined,
    include: { profile: true, adminAccess: true, _count: { select: { workouts: true, workoutPlans: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return res.status(200).json({ items: users, nextCursor: null });
}
