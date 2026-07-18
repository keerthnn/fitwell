import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { workoutVolume } from "fitness/lib/fitness/calculations";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const start = new Date(String(req.query.start));
  const end = new Date(String(req.query.end));
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  )
    return res.status(400).json({ error: "Valid date range required" });
  const [workouts, nutrition, weights] = await Promise.all([
    prisma.workout.findMany({
      where: { userId, status: "COMPLETED", date: { gte: start, lt: end } },
      include: { exercises: { include: { exercise: true, sets: true } } },
    }),
    prisma.nutritionEntry.aggregate({
      where: { userId, consumedAt: { gte: start, lt: end } },
      _sum: { calories: true },
    }),
    prisma.weightCheckIn.findMany({
      where: { userId, recordedAt: { gte: start, lt: end } },
      orderBy: { recordedAt: "asc" },
    }),
  ]);
  const muscle = new Map<string, number>();
  const weekday = new Map<string, number>();
  let sets = 0;
  let volumeKg = 0;
  for (const workout of workouts) {
    const day = workout.date.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    });
    weekday.set(day, (weekday.get(day) ?? 0) + 1);
    for (const item of workout.exercises) {
      muscle.set(
        item.exercise.category,
        (muscle.get(item.exercise.category) ?? 0) + 1,
      );
      sets += item.sets.filter((set) => set.isCompleted).length;
      volumeKg += workoutVolume(item.sets);
    }
  }
  const caloriesBurned = workouts.reduce(
    (sum, workout) => sum + (workout.caloriesBurned ?? 0),
    0,
  );
  const caloriesConsumed = nutrition._sum.calories ?? 0;
  return res.json({
    totals: {
      workouts: workouts.length,
      durationM: workouts.reduce(
        (sum, workout) => sum + (workout.durationM ?? 0),
        0,
      ),
      sets,
      volumeKg,
      caloriesBurned,
      caloriesConsumed,
      netCalories: caloriesConsumed - caloriesBurned,
    },
    muscleDistribution: [...muscle].map(([name, value]) => ({ name, value })),
    weekdayFrequency: [...weekday].map(([name, value]) => ({ name, value })),
    weightTrend: weights.map((weight) => ({
      date: weight.recordedAt.toISOString(),
      weightKg: weight.weightKg,
    })),
  });
}
