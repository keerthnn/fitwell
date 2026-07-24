import prisma from "fitness/lib/prisma";
import { calculateStreaks, localDateKey, workoutVolume } from "./calculations";

const DEFINITIONS = [
  [
    "FIRST_WORKOUT",
    "First Step",
    "Complete your first workout",
    "WORKOUT",
    "🏁",
    { workouts: 1 },
  ],
  [
    "THREE_DAY_STREAK",
    "Consistent Starter",
    "Reach a 3-day workout streak",
    "STREAK",
    "🔥",
    { streak: 3 },
  ],
  [
    "WEEKLY_WARRIOR",
    "Weekly Warrior",
    "Complete 5 workouts in one week",
    "WORKOUT",
    "⚡",
    { weekly: 5 },
  ],
  [
    "MONTH_IN_MOTION",
    "Month in Motion",
    "Complete 12 workouts in one month",
    "WORKOUT",
    "📅",
    { monthly: 12 },
  ],
  [
    "CENTURY_CLUB",
    "Century Club",
    "Complete 100 workouts",
    "WORKOUT",
    "💯",
    { workouts: 100 },
  ],
  [
    "VOLUME_BUILDER",
    "Volume Builder",
    "Lift 10,000 kg in total volume",
    "VOLUME",
    "🏋️",
    { volume: 10000 },
  ],
  [
    "NUTRITION_TRACKER",
    "Nutrition Tracker",
    "Log nutrition for 7 consecutive days",
    "NUTRITION",
    "🥗",
    { nutritionDays: 7 },
  ],
  [
    "BALANCED_WEEK",
    "Balanced Week",
    "Stay within 10% of your calorie target on 5 days in a week",
    "NUTRITION",
    "⚖️",
    { balancedDays: 5 },
  ],
  [
    "TEMPLATE_CREATOR",
    "Template Creator",
    "Publish your first template",
    "COMMUNITY",
    "🧩",
    { publicTemplates: 1 },
  ],
  [
    "COMMUNITY_COACH",
    "Community Coach",
    "Have templates copied 10 times",
    "COMMUNITY",
    "🤝",
    { copies: 10 },
  ],
  [
    "COMEBACK",
    "Comeback",
    "Complete a workout after a 14-day break",
    "WORKOUT",
    "🌅",
    { gapDays: 14 },
  ],
] as const;

export async function ensureAchievementDefinitions() {
  await Promise.all(
    DEFINITIONS.map(
      ([key, name, description, category, icon, criteria], index) =>
        prisma.achievement.upsert({
          where: { key },
          update: {
            name,
            description,
            category,
            icon,
            criteria,
            displayOrder: index,
          },
          create: {
            key,
            name,
            description,
            category,
            icon,
            criteria,
            displayOrder: index,
          },
        }),
    ),
  );
}

export async function evaluateAchievements(userId: string) {
  await ensureAchievementDefinitions();
  const [profile, workouts, nutrition, templates] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.workout.findMany({
      where: { userId, status: "COMPLETED" },
      include: { exercises: { include: { sets: true } } },
      orderBy: { date: "asc" },
    }),
    prisma.nutritionEntry.findMany({
      where: { userId },
      select: { consumedAt: true, calories: true },
    }),
    prisma.workoutTemplate.findMany({
      where: { ownerId: userId },
      select: { visibility: true, copyCount: true },
    }),
  ]);
  const timezone = profile?.timezone ?? "UTC";
  const streak = calculateStreaks(
    workouts.map((w) => w.date),
    timezone,
  ).best;
  const volume = workouts.reduce(
    (sum, workout) =>
      sum +
      workout.exercises.reduce(
        (exerciseSum, exercise) => exerciseSum + workoutVolume(exercise.sets),
        0,
      ),
    0,
  );
  const weeks = new Map<string, number>();
  const months = new Map<string, number>();
  for (const workout of workouts) {
    const key = localDateKey(workout.date, timezone);
    const date = new Date(`${key}T12:00:00Z`);
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    const week = monday.toISOString().slice(0, 10);
    weeks.set(week, (weeks.get(week) ?? 0) + 1);
    months.set(key.slice(0, 7), (months.get(key.slice(0, 7)) ?? 0) + 1);
  }
  const nutritionDays = calculateStreaks(
    nutrition.map((n) => n.consumedAt),
    timezone,
  ).best;
  const earned = new Set<string>();
  if (workouts.length >= 1) earned.add("FIRST_WORKOUT");
  if (streak >= 3) earned.add("THREE_DAY_STREAK");
  if ([...weeks.values()].some((count) => count >= 5))
    earned.add("WEEKLY_WARRIOR");
  if ([...months.values()].some((count) => count >= 12))
    earned.add("MONTH_IN_MOTION");
  if (workouts.length >= 100) earned.add("CENTURY_CLUB");
  if (volume >= 10000) earned.add("VOLUME_BUILDER");
  if (nutritionDays >= 7) earned.add("NUTRITION_TRACKER");
  const dayCalories = new Map<string, number>();
  for (const entry of nutrition) {
    const key = localDateKey(entry.consumedAt, timezone);
    dayCalories.set(key, (dayCalories.get(key) ?? 0) + entry.calories);
  }
  const balancedWeeks = new Map<string, number>();
  const target = profile?.dailyCalorieTarget ?? 2000;
  for (const [key, calories] of dayCalories) {
    if (Math.abs(calories - target) / target > 0.1) continue;
    const date = new Date(`${key}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    const week = date.toISOString().slice(0, 10);
    balancedWeeks.set(week, (balancedWeeks.get(week) ?? 0) + 1);
  }
  if ([...balancedWeeks.values()].some((count) => count >= 5))
    earned.add("BALANCED_WEEK");
  if (templates.some((t) => t.visibility === "PUBLIC"))
    earned.add("TEMPLATE_CREATOR");
  if (templates.reduce((sum, t) => sum + t.copyCount, 0) >= 10)
    earned.add("COMMUNITY_COACH");
  if (
    workouts.some(
      (workout, index) =>
        index > 0 &&
        workout.date.getTime() - workouts[index - 1].date.getTime() >=
          14 * 86400000,
    )
  )
    earned.add("COMEBACK");

  const definitions = await prisma.achievement.findMany({
    where: { key: { in: [...earned] } },
  });
  const existing = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const existingIds = new Set(existing.map((item) => item.achievementId));
  const newlyEarned = definitions.filter(
    (definition) => !existingIds.has(definition.id),
  );
  if (newlyEarned.length) {
    await prisma.userAchievement.createMany({
      data: newlyEarned.map((definition) => ({
        userId,
        achievementId: definition.id,
      })),
      skipDuplicates: true,
    });
  }
  return newlyEarned.map(({ key, name, description, icon }) => ({
    key,
    name,
    description,
    icon,
  }));
}
