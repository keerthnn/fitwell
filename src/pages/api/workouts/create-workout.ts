import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateCreateWorkout } from "fitness/lib/api/validators/workout";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const result = validateCreateWorkout(req.body);
  if (!result.valid) return res.status(400).json({ error: "Invalid workout", details: result.errors });
  const workout = await prisma.workout.create({
    data: {
      ...result.data,
      workoutDate: new Date(result.data.workoutDate),
      userId,
      status: result.data.entryMode === "QUICK_ENTRY" ? "DRAFT" : "IN_PROGRESS",
      startedAt: result.data.entryMode === "LIVE" ? new Date() : null,
    },
  });
  return res.status(201).json({ id: workout.id });
}
