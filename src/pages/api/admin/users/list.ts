import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { Prisma } from "fitness/generated/prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  if (!(await requireAdmin(req, res))) return;
  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim().slice(0, 120)
      : "";
  const scope = typeof req.query.scope === "string" ? req.query.scope : "all";
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const scopeWhere: Prisma.UserWhereInput | undefined =
    scope === "active"
      ? {
          isDisabled: false,
          deletedAt: null,
          activityDays: { some: { lastActiveAt: { gte: startOfToday } } },
        }
      : scope === "total"
        ? { deletedAt: null }
        : undefined;
  const searchWhere: Prisma.UserWhereInput | undefined = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { displayName: { contains: search, mode: "insensitive" } },
        ],
      }
    : undefined;
  const where =
    scopeWhere && searchWhere
      ? { AND: [scopeWhere, searchWhere] }
      : scopeWhere ?? searchWhere;
  const users = await prisma.user.findMany({
    where,
    include: {
      profile: true,
      adminAccess: true,
      _count: { select: { workouts: true, workoutPlans: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return res.status(200).send({ items: users, nextCursor: null });
}
