import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;

  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const activeSince = new Date(Date.now() - 30 * 86400000);
  const [
    totalUsers,
    totalWorkouts,
    totalExercises,
    activeUsers,
    publicTemplates,
    totalTemplates,
    nutritionEntries,
    completedWorkouts,
    activeInjuries,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.workout.count(),
    prisma.exercise.count(),
    prisma.user.count({ where: { updatedAt: { gte: activeSince } } }),
    prisma.workoutTemplate.count({
      where: { visibility: "PUBLIC", isArchived: false },
    }),
    prisma.workoutTemplate.count(),
    prisma.nutritionEntry.count(),
    prisma.workout.count({ where: { status: "COMPLETED" } }),
    prisma.injury.count({
      where: { status: { in: ["ACTIVE", "RECOVERING"] } },
    }),
  ]);

  return res
    .status(200)
    .json({
      totalUsers,
      totalWorkouts,
      totalExercises,
      activeUsers,
      publicTemplates,
      totalTemplates,
      nutritionEntries,
      completedWorkouts,
      activeInjuries,
    });
}
