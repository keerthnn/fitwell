import { checkIfPatchOrSetError } from "fitness/lib/api/api-utils";
import { validateUpdateWorkout } from "fitness/lib/api/validators/workout";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPatchOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const validation = validateUpdateWorkout(req.body);
  if (!validation.valid)
    return res.status(400).json({ errors: validation.errors });
  const { id, name, workoutDate, durationMinutes, notes } = validation.data;
  const existing = await prisma.workout.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ error: "Workout not found" });
  const workout = await prisma.workout.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(workoutDate ? { workoutDate: new Date(workoutDate) } : {}),
      ...(durationMinutes ? { durationMinutes } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });
  return res.json(workout);
}
