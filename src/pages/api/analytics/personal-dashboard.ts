import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import {
  emptySeries,
  incrementSeries,
  resolveAdminAnalyticsRange,
} from "fitness/lib/analytics/range";
import prisma from "fitness/lib/prisma";
import type { PersonalAnalyticsDashboard, RankedAnalyticsItem } from "fitness/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

const ranked = (values: Map<string, number>, direction: "asc" | "desc") =>
  [...values]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (direction === "asc" ? a.value - b.value : b.value - a.value))
    .slice(0, 5) as RankedAnalyticsItem[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { timezone: true },
  });
  const resolved = resolveAdminAnalyticsRange(req.query, profile?.timezone ?? "UTC");
  if (!resolved.value) return res.status(400).json(resolved.error);

  const range = resolved.value;
  const period = { gte: range.start, lt: range.endExclusive };

  try {
    const [allWorkouts, createdWorkouts, completedWorkouts, templates, createdTemplates, templateUses, templateCopies, nutritionTotal, nutritionRows, injuries, addedInjuries, weightTotal, weightRows, allAwards, awarded, definitions] = await Promise.all([
      prisma.workout.findMany({ where: { userId }, select: { status: true } }),
      prisma.workout.findMany({ where: { userId, createdAt: period }, select: { createdAt: true, date: true, durationM: true, caloriesBurned: true } }),
      prisma.workout.findMany({ where: { userId, completedAt: period }, select: { completedAt: true } }),
      prisma.workoutTemplate.findMany({ where: { ownerId: userId }, select: { visibility: true, isArchived: true } }),
      prisma.workoutTemplate.findMany({ where: { ownerId: userId, createdAt: period }, select: { createdAt: true } }),
      prisma.templateUseEvent.findMany({ where: { createdAt: period, template: { is: { ownerId: userId } } }, select: { createdAt: true, templateTitleSnapshot: true } }),
      prisma.templateCopy.findMany({ where: { recipientId: userId, createdAt: period }, select: { createdAt: true, sourceTemplate: { select: { title: true } } } }),
      prisma.nutritionEntry.count({ where: { userId } }),
      prisma.nutritionEntry.findMany({ where: { userId, createdAt: period }, select: { createdAt: true } }),
      prisma.injury.findMany({ where: { userId }, select: { status: true } }),
      prisma.injury.findMany({ where: { userId, createdAt: period }, select: { createdAt: true } }),
      prisma.weightCheckIn.count({ where: { userId } }),
      prisma.weightCheckIn.findMany({ where: { userId, createdAt: period }, select: { createdAt: true } }),
      prisma.userAchievement.findMany({ where: { userId }, select: { achievement: { select: { name: true } } } }),
      prisma.userAchievement.findMany({ where: { userId, awardedAt: period }, select: { awardedAt: true, achievement: { select: { name: true } } } }),
      prisma.achievement.findMany({ where: { isActive: true }, select: { name: true } }),
    ]);

    const workoutSeries = emptySeries(range, ["created", "completed"]);
    const weekday = new Map<string, number>();
    for (const workout of createdWorkouts) {
      incrementSeries(workoutSeries, workout.createdAt, "created", range.metadata.grouping, range.metadata.timezone);
      const day = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: range.metadata.timezone }).format(workout.date);
      weekday.set(day, (weekday.get(day) ?? 0) + 1);
    }
    for (const workout of completedWorkouts) {
      if (workout.completedAt)
        incrementSeries(workoutSeries, workout.completedAt, "completed", range.metadata.grouping, range.metadata.timezone);
    }

    const templateSeries = emptySeries(range, ["created", "uses", "copies"]);
    const useRanks = new Map<string, number>();
    const copyRanks = new Map<string, number>();
    for (const template of createdTemplates)
      incrementSeries(templateSeries, template.createdAt, "created", range.metadata.grouping, range.metadata.timezone);
    for (const use of templateUses) {
      incrementSeries(templateSeries, use.createdAt, "uses", range.metadata.grouping, range.metadata.timezone);
      useRanks.set(use.templateTitleSnapshot, (useRanks.get(use.templateTitleSnapshot) ?? 0) + 1);
    }
    for (const copy of templateCopies) {
      incrementSeries(templateSeries, copy.createdAt, "copies", range.metadata.grouping, range.metadata.timezone);
      copyRanks.set(copy.sourceTemplate.title, (copyRanks.get(copy.sourceTemplate.title) ?? 0) + 1);
    }

    const nutritionSeries = emptySeries(range, ["entries"]);
    for (const entry of nutritionRows)
      incrementSeries(nutritionSeries, entry.createdAt, "entries", range.metadata.grouping, range.metadata.timezone);
    const healthSeries = emptySeries(range, ["injuriesAdded"]);
    for (const injury of addedInjuries)
      incrementSeries(healthSeries, injury.createdAt, "injuriesAdded", range.metadata.grouping, range.metadata.timezone);
    const weightSeries = emptySeries(range, ["checkIns"]);
    for (const entry of weightRows)
      incrementSeries(weightSeries, entry.createdAt, "checkIns", range.metadata.grouping, range.metadata.timezone);
    const achievementsSeries = emptySeries(range, ["awards"]);
    const awardRanks = new Map(definitions.map((item) => [item.name, 0]));
    for (const item of awarded) {
      incrementSeries(achievementsSeries, item.awardedAt, "awards", range.metadata.grouping, range.metadata.timezone);
      awardRanks.set(item.achievement.name, (awardRanks.get(item.achievement.name) ?? 0) + 1);
    }

    const completed = allWorkouts.filter((workout) => workout.status === "COMPLETED").length;
    const publicTemplates = templates.filter((template) => template.visibility === "PUBLIC").length;
    const privateTemplates = templates.filter((template) => template.visibility === "PRIVATE").length;
    const unlistedTemplates = templates.filter((template) => template.visibility === "UNLISTED").length;
    const archivedTemplates = templates.filter((template) => template.isArchived).length;
    const activeInjuries = injuries.filter((injury) => injury.status !== "RESOLVED").length;

    const data: PersonalAnalyticsDashboard = {
      metadata: range.metadata,
      workouts: {
        total: allWorkouts.length,
        completed,
        incomplete: allWorkouts.length - completed,
        createdInPeriod: createdWorkouts.length,
        durationM: createdWorkouts.reduce((sum, workout) => sum + (workout.durationM ?? 0), 0),
        caloriesBurned: createdWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned ?? 0), 0),
        series: workoutSeries,
        statusDistribution: [
          { name: "Completed", value: completed },
          { name: "Draft", value: allWorkouts.filter((workout) => workout.status === "DRAFT").length },
          { name: "In progress", value: allWorkouts.filter((workout) => workout.status === "IN_PROGRESS").length },
        ],
        weekdayFrequency: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => ({ name, value: weekday.get(name) ?? 0 })),
      },
      templates: {
        total: templates.length,
        public: publicTemplates,
        private: privateTemplates,
        unlisted: unlistedTemplates,
        archived: archivedTemplates,
        active: templates.length - archivedTemplates,
        createdInPeriod: createdTemplates.length,
        usesInPeriod: templateUses.length,
        copiesInPeriod: templateCopies.length,
        series: templateSeries,
        visibilityDistribution: [
          { name: "Public", value: publicTemplates },
          { name: "Private", value: privateTemplates },
          { name: "Unlisted", value: unlistedTemplates },
        ],
        mostUsed: ranked(useRanks, "desc"),
        mostCopied: ranked(copyRanks, "desc"),
      },
      nutrition: { total: nutritionTotal, entriesInPeriod: nutritionRows.length, series: nutritionSeries },
      health: {
        totalInjuries: injuries.length,
        active: activeInjuries,
        recovered: injuries.length - activeInjuries,
        addedInPeriod: addedInjuries.length,
        series: healthSeries,
      },
      weight: { total: weightTotal, entriesInPeriod: weightRows.length, series: weightSeries },
      achievements: {
        totalAwarded: allAwards.length,
        awardedInPeriod: awarded.length,
        series: achievementsSeries,
        mostEarned: ranked(awardRanks, "desc"),
        leastEarned: ranked(awardRanks, "asc"),
      },
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error("Personal analytics request failed", error);
    return res.status(500).json({ error: "Unable to load personal analytics" });
  }
}
