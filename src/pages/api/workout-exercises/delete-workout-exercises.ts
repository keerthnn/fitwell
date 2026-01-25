import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfDeleteOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { workoutExerciseId } = req.query;
  if (typeof workoutExerciseId !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const we = await prisma.workoutExercise.findUnique({
    where: { id: workoutExerciseId },
    include: { workout: { select: { userId: true } } },
  });

  if (!we || we.workout.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await prisma.workoutExercise.delete({
    where: { id: workoutExerciseId },
  });

  return res.json({ success: true });
}
