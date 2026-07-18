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

  const [totalUsers, totalWorkouts, totalExercises] = await prisma.$transaction([
    prisma.user.count(),
    prisma.workout.count(),
    prisma.exercise.count(),
  ]);

  return res.status(200).json({ totalUsers, totalWorkouts, totalExercises });
}
