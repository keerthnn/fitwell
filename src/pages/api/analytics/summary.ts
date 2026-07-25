import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

function dateRange(query: NextApiRequest["query"]) {
  const end = query.end ? new Date(String(query.end)) : new Date();
  const start = query.start
    ? new Date(String(query.start))
    : new Date(end.getTime() - 30 * 86_400_000);
  return Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end ||
    end.getTime() - start.getTime() > 366 * 86_400_000
    ? null
    : { start, end };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const range = dateRange(req.query);
  if (!range) return res.status(400).send({ error: "Invalid date range" });

  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      status: "COMPLETED",
      workoutDate: { gte: range.start, lte: range.end },
    },
    include: {
      sourceWorkoutPlan: { select: { name: true } },
      exercises: { include: { exercise: true, sets: true } },
    },
  });
  const muscles = new Map<string, number>();
  const frequency = new Map<string, number>();
  const plans = new Map<string, number>();
  const personalBests = new Map<string, number>();
  let volume = 0;
  let exerciseCount = 0;
  for (const workout of workouts) {
    const day = workout.workoutDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    frequency.set(day, (frequency.get(day) ?? 0) + 1);
    if (workout.sourceWorkoutPlan) {
      const name = workout.sourceWorkoutPlan.name;
      plans.set(name, (plans.get(name) ?? 0) + 1);
    }
    for (const item of workout.exercises) {
      exerciseCount += 1;
      const muscle = item.exercise.primaryMuscle;
      muscles.set(muscle, (muscles.get(muscle) ?? 0) + 1);
      for (const set of item.sets.filter((value) => value.isCompleted)) {
        volume += (set.weightKg ?? 0) * (set.reps ?? 0);
        const best = personalBests.get(item.exercise.name) ?? 0;
        personalBests.set(
          item.exercise.name,
          Math.max(best, set.weightKg ?? 0),
        );
      }
    }
  }
  const points = (map: Map<string, number>) =>
    [...map].map(([name, value]) => ({ name, value }));
  return res.status(200).send({
    completedWorkouts: workouts.length,
    durationMinutes: workouts.reduce(
      (sum, workout) => sum + (workout.durationMinutes ?? 0),
      0,
    ),
    totalVolumeKg: volume,
    exercisesPerformed: exerciseCount,
    currentStreak: 0,
    muscleDistribution: points(muscles),
    workoutFrequency: points(frequency),
    personalBests: [...personalBests]
      .filter(([, weightKg]) => weightKg > 0)
      .map(([exercise, weightKg]) => ({ exercise, weightKg }))
      .sort((a, b) => b.weightKg - a.weightKg)
      .slice(0, 10),
    workoutPlanUsage: points(plans),
  });
}
