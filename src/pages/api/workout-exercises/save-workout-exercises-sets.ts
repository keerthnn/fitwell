import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { workoutExerciseId, sets } = req.body;

  if (!Array.isArray(sets)) {
    return res.status(400).json({ error: "Invalid sets" });
  }

  const we = await prisma.workoutExercise.findUnique({
    where: { id: workoutExerciseId },
    include: { workout: { select: { userId: true } } },
  });

  if (!we || we.workout.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await prisma.workoutSet.deleteMany({
    where: { workoutExerciseId },
  });

  await prisma.workoutSet.createMany({
    data: sets.map((s) => ({
      workoutExerciseId,
      setNumber: s.setNumber,
      reps: s.reps ?? null,
      weightKg: s.weightKg ?? null,
      rpe: s.rpe ?? null,
    })),
  });

  return res.json({ success: true });
}
