import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateAddExercise } from "fitness/lib/api/validators/workout";
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
  const validation = validateAddExercise(req.body);
  if (!validation.valid)
    return res.status(400).json({ errors: validation.errors });
  const { workoutId, exerciseId, order } = validation.data;
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });
  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, isActive: true },
  });
  if (!workout || !exercise)
    return res.status(404).json({ error: "Workout or exercise not found" });
  return res.status(201).json(
    await prisma.workoutExercise.create({
      data: { workoutId, exerciseId, order },
    }),
  );
}
