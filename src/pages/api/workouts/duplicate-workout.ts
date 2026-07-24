import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateIdBody } from "fitness/lib/api/validators/workout";
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
  const result = validateIdBody(req.body);
  if (!result.valid)
    return res
      .status(400)
      .json({ error: "Invalid request", details: result.errors });
  const source = await prisma.workout.findFirst({
    where: { id: result.data.id, userId },
    include: { exercises: { include: { sets: true } } },
  });
  if (!source) return res.status(404).json({ error: "Workout not found" });
  const workout = await prisma.workout.create({
    data: {
      userId,
      name: `${source.name} copy`,
      workoutDate: new Date(),
      entryMode: "QUICK_ENTRY",
      status: "DRAFT",
      notes: source.notes,
      exercises: {
        create: source.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          order: exercise.order,
          notes: exercise.notes,
          sets: {
            create: exercise.sets.map((set) => ({
              setNumber: set.setNumber,
              reps: set.reps,
              weightKg: set.weightKg,
              durationSeconds: set.durationSeconds,
              distanceMeters: set.distanceMeters,
              restSeconds: set.restSeconds,
              isCompleted: false,
            })),
          },
        })),
      },
    },
  });
  return res.status(201).json({ id: workout.id });
}
