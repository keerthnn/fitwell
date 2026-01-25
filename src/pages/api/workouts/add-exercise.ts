import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { workoutId, exerciseId, order } = req.body;

  if (!workoutId || !exerciseId || typeof order !== "number") {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    select: { userId: true },
  });

  if (!workout || workout.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const workoutExercise = await prisma.workoutExercise.create({
    data: {
      workoutId,
      exerciseId,
      order,
    },
  });

  return res.json({ id: workoutExercise.id });
}
