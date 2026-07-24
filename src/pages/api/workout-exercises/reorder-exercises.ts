import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateExerciseOrder } from "fitness/lib/api/validators/workout";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const validation = validateExerciseOrder(req.body);
  if (!validation.valid) return res.status(400).json({ errors: validation.errors });
  const { workoutId, ids } = validation.data;
  const workout = await prisma.workout.findFirst({ where: { id: workoutId, userId } });
  if (!workout) return res.status(404).json({ error: "Workout not found" });
  await prisma.$transaction(ids.map((id, index) => prisma.workoutExercise.updateMany({
    where: { id, workoutId }, data: { order: index + 1 },
  })));
  return res.json({ success: true });
}
