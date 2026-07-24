import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateCreateWorkout } from "fitness/lib/api/validators/workout";
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
  const result = validateCreateWorkout(req.body);
  if (!result.valid)
    return res
      .status(400)
      .send({ error: "Invalid workout", details: result.errors });
  const { exerciseIds = [], ...workoutInput } = result.data;
  const activeExercises = exerciseIds.length
    ? await prisma.exercise.findMany({
        where: { id: { in: exerciseIds }, isActive: true },
        select: { id: true },
      })
    : [];
  if (activeExercises.length !== exerciseIds.length) {
    return res.status(400).send({
      error: "One or more selected exercises are unavailable",
    });
  }
  const workout = await prisma.workout.create({
    data: {
      ...workoutInput,
      workoutDate: new Date(workoutInput.workoutDate),
      userId,
      status:
        workoutInput.entryMode === "QUICK_ENTRY" ? "DRAFT" : "IN_PROGRESS",
      startedAt: workoutInput.entryMode === "LIVE" ? new Date() : null,
      exercises: exerciseIds.length
        ? {
            create: exerciseIds.map((exerciseId, order) => ({
              exerciseId,
              order,
            })),
          }
        : undefined,
    },
  });
  return res.status(201).send({ id: workout.id });
}
