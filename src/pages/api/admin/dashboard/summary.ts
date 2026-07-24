import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfGetOrSetError(req, res)) return;
  if (!(await requireAdmin(req, res))) return;
  const [users, workouts, exercises, workoutPlans] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.workout.count(),
    prisma.exercise.count({ where: { isActive: true } }),
    prisma.workoutPlan.count({ where: { isBuiltIn: true, isActive: true } }),
  ]);
  return res.status(200).json({ users, workouts, exercises, workoutPlans });
}
