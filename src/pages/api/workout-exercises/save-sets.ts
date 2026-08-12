import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import {
  validateSets,
  validateSetsForTrackingType,
} from "fitness/lib/api/validators/workout";
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
  const result = validateSets(req.body);
  if (!result.valid)
    return res
      .status(400)
      .send({ error: "Invalid sets", details: result.errors });
  const owned = await prisma.workoutExercise.findFirst({
    where: { id: result.data.workoutExerciseId, workout: { userId } },
    select: {
      id: true,
      exercise: { select: { trackingType: true } },
    },
  });
  if (!owned)
    return res.status(404).send({ error: "Workout exercise not found" });
  const trackingResult = validateSetsForTrackingType(
    result.data.sets,
    owned.exercise.trackingType,
  );
  if (!trackingResult.valid)
    return res
      .status(400)
      .send({ error: "Invalid sets", details: trackingResult.errors });
  await prisma.$transaction(async (tx) => {
    await tx.workoutSet.deleteMany({ where: { workoutExerciseId: owned.id } });
    await tx.workoutSet.createMany({
      data: result.data.sets.map((set) => ({
        workoutExerciseId: owned.id,
        setNumber: set.setNumber,
        reps: set.reps,
        weightKg: set.weightKg,
        durationSeconds: set.durationSeconds,
        distanceMeters: set.distanceMeters,
        restSeconds: set.restSeconds,
        isCompleted: set.isCompleted,
      })),
    });
  });
  return res.send({ success: true });
}
