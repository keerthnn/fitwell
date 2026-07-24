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
  const [completedWorkouts, activeUsers, duration] = await Promise.all([
    prisma.workout.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({ where: { isDisabled: false, deletedAt: null } }),
    prisma.workout.aggregate({
      where: { status: "COMPLETED" },
      _sum: { durationMinutes: true },
    }),
  ]);
  return res
    .status(200)
    .send({
      completedWorkouts,
      activeUsers,
      durationMinutes: duration._sum.durationMinutes ?? 0,
    });
}
