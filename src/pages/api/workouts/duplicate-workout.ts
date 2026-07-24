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
  const source = await prisma.workout.findFirst({
    where: { id: req.body.id, userId },
    include: { exercises: { include: { sets: true } } },
  });
  if (!source) return res.status(404).json({ error: "Workout not found" });
  const workout = await prisma.workout.create({
    data: {
      userId,
      title: `${source.title ?? "Workout"} copy`,
      date: new Date(),
      notes: source.notes,
      intensity: source.intensity,
      status: "DRAFT",
      templateId: source.templateId,
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
              durationS: set.durationS,
              distanceM: set.distanceM,
              rpe: set.rpe,
              restDurationS: set.restDurationS,
            })),
          },
        })),
      },
    },
  });
  return res.status(201).json({ id: workout.id });
}
