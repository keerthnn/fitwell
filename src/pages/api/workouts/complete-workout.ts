import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateIdBody } from "fitness/lib/api/validators/workout";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const result = validateIdBody(req.body);
  if (!result.valid) return res.status(400).json({ error: "Invalid workout", details: result.errors });
  const workout = await prisma.workout.findFirst({
    where: { id: result.data.id, userId },
    include: { exercises: { include: { sets: true } } },
  });
  if (!workout) return res.status(404).json({ error: "Workout not found" });
  if (!workout.exercises.some((exercise) => exercise.sets.some((set) => set.isCompleted)))
    return res.status(400).json({ error: "Complete at least one set" });
  const completedAt = new Date();
  const durationMinutes = workout.durationMinutes ?? Math.max(
    1,
    Math.round((completedAt.getTime() - (workout.startedAt ?? workout.createdAt).getTime()) / 60000),
  );
  return res.json(await prisma.workout.update({
    where: { id: workout.id },
    data: { status: "COMPLETED", completedAt, durationMinutes },
  }));
}
