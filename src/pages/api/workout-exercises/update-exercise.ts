import { checkIfPatchOrSetError } from "fitness/lib/api/api-utils";
import { validateWorkoutExerciseUpdate } from "fitness/lib/api/validators/workout";
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
  const validation = validateWorkoutExerciseUpdate(req.body);
  if (!validation.valid)
    return res.status(400).send({ errors: validation.errors });
  const { id, notes } = validation.data;
  const owned = await prisma.workoutExercise.findFirst({
    where: { id, workout: { userId } },
  });
  if (!owned)
    return res.status(404).send({ error: "Workout exercise not found" });
  return res.send(
    await prisma.workoutExercise.update({
      where: { id },
      data: { notes: notes ?? null },
    }),
  );
}
