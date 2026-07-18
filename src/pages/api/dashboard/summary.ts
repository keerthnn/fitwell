import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import {
  calculateStreaks,
  localDateKey,
} from "fitness/lib/fitness/calculations";
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
  const [
    profile,
    workouts,
    nutrition,
    achievements,
    injuryCount,
    conditionCount,
  ] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.workout.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { date: "desc" },
      include: { _count: { select: { exercises: true } } },
    }),
    prisma.nutritionEntry.findMany({
      where: {
        userId,
        consumedAt: { gte: new Date(Date.now() - 48 * 3600000) },
      },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { awardedAt: "desc" },
      take: 5,
      include: { achievement: true },
    }),
    prisma.injury.count({
      where: { userId, status: { in: ["ACTIVE", "RECOVERING"] } },
    }),
    prisma.medicalCondition.count({
      where: { userId, status: { in: ["ACTIVE", "MANAGED"] } },
    }),
  ]);
  const timezone = profile?.timezone ?? "UTC";
  const now = new Date();
  const today = localDateKey(now, timezone);
  const todayDate = new Date(`${today}T12:00:00Z`);
  const monday = new Date(todayDate);
  monday.setUTCDate(todayDate.getUTCDate() - ((todayDate.getUTCDay() + 6) % 7));
  const weekKey = monday.toISOString().slice(0, 10);
  const monthKey = today.slice(0, 7);
  const thisWeek = workouts.filter(
    (w) => localDateKey(w.date, timezone) >= weekKey,
  ).length;
  const thisMonth = workouts.filter((w) =>
    localDateKey(w.date, timezone).startsWith(monthKey),
  ).length;
  const consumed = nutrition
    .filter((entry) => localDateKey(entry.consumedAt, timezone) === today)
    .reduce((sum, entry) => sum + entry.calories, 0);
  const burned = workouts
    .filter((w) => localDateKey(w.date, timezone) === today)
    .reduce((sum, workout) => sum + (workout.caloriesBurned ?? 0), 0);
  const target = profile?.dailyCalorieTarget ?? 2000;
  const activity = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(todayDate);
    date.setUTCDate(todayDate.getUTCDate() - 6 + offset);
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      count: workouts.filter((w) => localDateKey(w.date, timezone) === key)
        .length,
    };
  });
  return res.json({
    streak: calculateStreaks(
      workouts.map((w) => w.date),
      timezone,
    ),
    calories: {
      consumed,
      burned,
      net: consumed - burned,
      remaining: target - consumed,
      target,
    },
    workouts: {
      thisWeek,
      thisMonth,
      total: workouts.length,
      weeklyTarget: profile?.weeklyWorkoutTarget ?? 3,
    },
    recentWorkouts: workouts
      .slice(0, 5)
      .map((w) => ({
        id: w.id,
        title: w.title,
        date: w.date.toISOString(),
        durationM: w.durationM,
        exerciseCount: w._count.exercises,
        status: w.status,
        caloriesBurned: w.caloriesBurned,
      })),
    activity,
    latestAchievements: achievements.map((item) => ({
      key: item.achievement.key,
      name: item.achievement.name,
      description: item.achievement.description,
      icon: item.achievement.icon,
      awardedAt: item.awardedAt.toISOString(),
    })),
    activeHealthCount: injuryCount + conditionCount,
  });
}
