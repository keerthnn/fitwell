import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import { workoutPlanInclude } from "fitness/lib/workoutPlans/access";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const includeArchived = req.query.includeArchived === "true";
  const isAdmin = includeArchived
    ? Boolean(await prisma.adminAccess.findUnique({ where: { userId } }))
    : false;
  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim().slice(0, 120)
      : "";
  const plans = await prisma.workoutPlan.findMany({
    where: {
      isActive: true,
      ...(isAdmin ? {} : { isArchived: false }),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      OR: [
        { userId, isBuiltIn: false },
        { userId: null, isBuiltIn: true },
      ],
    },
    include: workoutPlanInclude,
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 100,
  });
  return res.status(200).json({ items: plans, nextCursor: null });
}
