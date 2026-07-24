import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { evaluateAchievements } from "fitness/lib/fitness/achievements";
import { estimateWorkoutCalories } from "fitness/lib/fitness/calculations";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
  caloriesBurned: z.number().int().nonnegative().optional(),
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid workout completion" });
  const workout = await prisma.workout.findFirst({
    where: { id: parsed.data.id, userId },
    include: {
      exercises: { include: { sets: true } },
      user: { include: { profile: true } },
    },
  });
  if (!workout) return res.status(404).json({ error: "Workout not found" });
  if (
    !workout.exercises.some((exercise) =>
      exercise.sets.some((set) => set.isCompleted),
    )
  )
    return res
      .status(400)
      .json({ error: "Complete at least one set before finishing" });
  const completedAt = new Date();
  const durationM =
    workout.durationM ??
    Math.max(
      1,
      Math.round(
        (completedAt.getTime() -
          (workout.startedAt ?? workout.createdAt).getTime()) /
          60000,
      ),
    );
  const estimate = estimateWorkoutCalories(
    workout.user.profile?.weightKg ?? 70,
    durationM,
    workout.intensity,
  );
  const overridden = parsed.data.caloriesBurned !== undefined;
  const updated = await prisma.workout.update({
    where: { id: workout.id },
    data: {
      status: "COMPLETED",
      completedAt,
      durationM,
      estimatedCaloriesBurned: estimate,
      caloriesBurned: parsed.data.caloriesBurned ?? estimate,
      calorieSource: overridden ? "OVERRIDDEN" : "ESTIMATED",
    },
  });
  const newlyEarned = await evaluateAchievements(userId);
  return res.json({ workout: updated, newlyEarned });
}
