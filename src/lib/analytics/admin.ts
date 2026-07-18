import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type {
  AdminAchievementsAnalytics,
  AdminHealthAnalytics,
  AdminNutritionAnalytics,
  AdminSummaryAnalytics,
  AdminTemplatesAnalytics,
  AdminUsersAnalytics,
  AdminWeightAnalytics,
  AdminWorkoutsAnalytics,
  AnalyticsPoint,
  RankedAnalyticsItem,
} from "fitness/utils/types";
import {
  analyticsBucketKey,
  emptySeries,
  incrementSeries,
  resolveAdminAnalyticsRange,
  type ResolvedAdminAnalyticsRange,
} from "./range";

export async function adminAnalyticsContext(req: NextApiRequest, res: NextApiResponse) {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return null;
  const profile = await prisma.userProfile.findUnique({
    where: { userId: adminId }, select: { timezone: true },
  });
  const timezone = profile?.timezone ?? "UTC";
  const resolved = resolveAdminAnalyticsRange(req.query, timezone);
  if (!resolved.value) {
    res.status(400).json(resolved.error);
    return null;
  }
  return resolved.value;
}

const period = (range: ResolvedAdminAnalyticsRange) => ({
  gte: range.start,
  lt: range.endExclusive,
});

function groupUniqueUsers(
  points: AnalyticsPoint[],
  rows: Array<{ userId: string; date: Date }>,
  field: string,
  range: ResolvedAdminAnalyticsRange,
) {
  const grouped = new Map<string, Set<string>>();
  for (const row of rows) {
    const key = analyticsBucketKey(row.date, range.metadata.grouping, range.metadata.timezone);
    if (!grouped.has(key)) grouped.set(key, new Set());
    grouped.get(key)?.add(row.userId);
  }
  for (const point of points) point[field] = grouped.get(point.bucket)?.size ?? 0;
}

function ranked(map: Map<string, number>, direction: "asc" | "desc", limit = 5): RankedAnalyticsItem[] {
  return [...map].map(([name, value]) => ({ name, value }))
    .sort((a, b) => direction === "desc" ? b.value - a.value : a.value - b.value)
    .slice(0, limit);
}

export async function usersAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminUsersAnalytics> {
  const activityStart = new Date(`${range.startKey}T00:00:00.000Z`);
  const activityEnd = new Date(`${range.endKey}T00:00:00.000Z`);
  activityEnd.setUTCDate(activityEnd.getUTCDate() + 1);
  const [total, newUsers, activities, baseline] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({ where: { createdAt: period(range) }, select: { createdAt: true } }),
    prisma.userActivityDay.findMany({
      where: { activityDate: { gte: activityStart, lt: activityEnd } },
      select: { userId: true, activityDate: true },
    }),
    prisma.user.count({ where: { createdAt: { lt: range.start } } }),
  ]);
  const activeIds = new Set(activities.map((item) => item.userId));
  const series = emptySeries(range, ["newUsers", "activeUsers", "totalUsers"]);
  for (const item of newUsers)
    incrementSeries(series, item.createdAt, "newUsers", range.metadata.grouping, range.metadata.timezone);
  groupUniqueUsers(series, activities.map((item) => ({ userId: item.userId, date: item.activityDate })), "activeUsers", range);
  let cumulative = baseline;
  for (const point of series) {
    cumulative += Number(point.newUsers);
    point.totalUsers = cumulative;
  }
  return {
    metadata: range.metadata,
    totals: { total, active: activeIds.size, inactive: Math.max(0, total - activeIds.size), newInPeriod: newUsers.length },
    series,
    historyApproximateBefore: "2026-07-18T19:00:00.000Z",
  };
}

export async function workoutsAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminWorkoutsAnalytics> {
  const [all, created, completed, activeUsers] = await Promise.all([
    prisma.workout.findMany({ select: { status: true } }),
    prisma.workout.findMany({
      where: { createdAt: period(range) },
      select: { createdAt: true, date: true, status: true, durationM: true, caloriesBurned: true },
    }),
    prisma.workout.findMany({
      where: { completedAt: period(range) }, select: { completedAt: true },
    }),
    prisma.userActivityDay.findMany({
      where: { lastActiveAt: period(range) }, distinct: ["userId"], select: { userId: true },
    }),
  ]);
  const series = emptySeries(range, ["created", "completed"]);
  for (const item of created)
    incrementSeries(series, item.createdAt, "created", range.metadata.grouping, range.metadata.timezone);
  for (const item of completed)
    if (item.completedAt) incrementSeries(series, item.completedAt, "completed", range.metadata.grouping, range.metadata.timezone);
  const weekday = new Map<string, number>();
  for (const item of created) {
    const day = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: range.metadata.timezone }).format(item.date);
    weekday.set(day, (weekday.get(day) ?? 0) + 1);
  }
  const completedTotal = all.filter((item) => item.status === "COMPLETED").length;
  const draftTotal = all.filter((item) => item.status === "DRAFT").length;
  const inProgressTotal = all.filter((item) => item.status === "IN_PROGRESS").length;
  return {
    metadata: range.metadata,
    totals: {
      total: all.length, completed: completedTotal, incomplete: all.length - completedTotal,
      createdInPeriod: created.length,
      averagePerActiveUser: activeUsers.length ? Number((created.length / activeUsers.length).toFixed(2)) : 0,
      durationM: created.reduce((sum, item) => sum + (item.durationM ?? 0), 0),
      caloriesBurned: created.reduce((sum, item) => sum + (item.caloriesBurned ?? 0), 0),
    },
    series,
    statusDistribution: [
      { name: "Completed", value: completedTotal },
      { name: "Draft", value: draftTotal },
      { name: "In progress", value: inProgressTotal },
    ],
    weekdayFrequency: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => ({ name, value: weekday.get(name) ?? 0 })),
  };
}

export async function templatesAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminTemplatesAnalytics> {
  const [all, created, uses, copies] = await Promise.all([
    prisma.workoutTemplate.findMany({ select: { visibility: true, isArchived: true } }),
    prisma.workoutTemplate.findMany({ where: { createdAt: period(range) }, select: { createdAt: true, visibility: true } }),
    prisma.templateUseEvent.findMany({ where: { createdAt: period(range) }, select: { createdAt: true, templateTitleSnapshot: true } }),
    prisma.templateCopy.findMany({ where: { createdAt: period(range) }, select: { createdAt: true, sourceTemplate: { select: { title: true } } } }),
  ]);
  const series = emptySeries(range, ["created", "uses", "copies"]);
  for (const item of created) incrementSeries(series, item.createdAt, "created", range.metadata.grouping, range.metadata.timezone);
  for (const item of uses) incrementSeries(series, item.createdAt, "uses", range.metadata.grouping, range.metadata.timezone);
  for (const item of copies) incrementSeries(series, item.createdAt, "copies", range.metadata.grouping, range.metadata.timezone);
  const useRanks = new Map<string, number>();
  const copyRanks = new Map<string, number>();
  for (const item of uses) useRanks.set(item.templateTitleSnapshot, (useRanks.get(item.templateTitleSnapshot) ?? 0) + 1);
  for (const item of copies) copyRanks.set(item.sourceTemplate.title, (copyRanks.get(item.sourceTemplate.title) ?? 0) + 1);
  const countVisibility = (value: "PUBLIC" | "PRIVATE" | "UNLISTED") => all.filter((item) => item.visibility === value).length;
  const publicCount = countVisibility("PUBLIC");
  const privateCount = countVisibility("PRIVATE");
  const unlistedCount = countVisibility("UNLISTED");
  const archived = all.filter((item) => item.isArchived).length;
  return {
    metadata: range.metadata,
    totals: { total: all.length, public: publicCount, private: privateCount, unlisted: unlistedCount, archived, active: all.length - archived, createdInPeriod: created.length, usesInPeriod: uses.length, copiesInPeriod: copies.length },
    series,
    visibilityDistribution: [
      { name: "Public", value: publicCount }, { name: "Private", value: privateCount }, { name: "Unlisted", value: unlistedCount },
    ],
    mostUsed: ranked(useRanks, "desc"),
    mostCopied: ranked(copyRanks, "desc"),
  };
}

export async function nutritionAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminNutritionAnalytics> {
  const [total, rows] = await Promise.all([
    prisma.nutritionEntry.count(),
    prisma.nutritionEntry.findMany({ where: { createdAt: period(range) }, select: { createdAt: true, userId: true } }),
  ]);
  const users = new Set(rows.map((item) => item.userId));
  const series = emptySeries(range, ["entries"]);
  for (const item of rows) incrementSeries(series, item.createdAt, "entries", range.metadata.grouping, range.metadata.timezone);
  return { metadata: range.metadata, totals: { total, entriesInPeriod: rows.length, participatingUsers: users.size, averagePerParticipant: users.size ? Number((rows.length / users.size).toFixed(2)) : 0 }, series };
}

export async function healthAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminHealthAnalytics> {
  const [all, added] = await Promise.all([
    prisma.injury.findMany({ select: { status: true, userId: true } }),
    prisma.injury.findMany({ where: { createdAt: period(range) }, select: { createdAt: true } }),
  ]);
  const activeRows = all.filter((item) => item.status !== "RESOLVED");
  const series = emptySeries(range, ["injuriesAdded"]);
  for (const item of added) incrementSeries(series, item.createdAt, "injuriesAdded", range.metadata.grouping, range.metadata.timezone);
  return { metadata: range.metadata, totals: { totalInjuries: all.length, active: activeRows.length, recovered: all.length - activeRows.length, addedInPeriod: added.length, usersWithActiveInjuries: new Set(activeRows.map((item) => item.userId)).size }, series };
}

export async function weightAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminWeightAnalytics> {
  const [total, rows] = await Promise.all([
    prisma.weightCheckIn.count(),
    prisma.weightCheckIn.findMany({ where: { createdAt: period(range) }, select: { createdAt: true, userId: true } }),
  ]);
  const users = new Set(rows.map((item) => item.userId));
  const series = emptySeries(range, ["checkIns"]);
  for (const item of rows) incrementSeries(series, item.createdAt, "checkIns", range.metadata.grouping, range.metadata.timezone);
  return { metadata: range.metadata, totals: { total, entriesInPeriod: rows.length, participatingUsers: users.size, averagePerParticipant: users.size ? Number((rows.length / users.size).toFixed(2)) : 0 }, series };
}

export async function achievementsAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminAchievementsAnalytics> {
  const [total, uniqueUsers, rows, definitions] = await Promise.all([
    prisma.userAchievement.count(),
    prisma.userAchievement.findMany({ distinct: ["userId"], select: { userId: true } }),
    prisma.userAchievement.findMany({ where: { awardedAt: period(range) }, select: { awardedAt: true, achievement: { select: { name: true } } } }),
    prisma.achievement.findMany({ where: { isActive: true }, select: { name: true } }),
  ]);
  const series = emptySeries(range, ["awards"]);
  const counts = new Map(definitions.map((item) => [item.name, 0]));
  for (const item of rows) {
    incrementSeries(series, item.awardedAt, "awards", range.metadata.grouping, range.metadata.timezone);
    counts.set(item.achievement.name, (counts.get(item.achievement.name) ?? 0) + 1);
  }
  return { metadata: range.metadata, totals: { totalAwarded: total, uniqueUsers: uniqueUsers.length, awardedInPeriod: rows.length }, series, mostEarned: ranked(counts, "desc"), leastEarned: ranked(counts, "asc") };
}

export async function summaryAnalytics(range: ResolvedAdminAnalyticsRange): Promise<AdminSummaryAnalytics> {
  const [users, workouts, templates, nutrition, health, weight, achievements, totalExercises] = await Promise.all([
    usersAnalytics(range), workoutsAnalytics(range), templatesAnalytics(range), nutritionAnalytics(range),
    healthAnalytics(range), weightAnalytics(range), achievementsAnalytics(range), prisma.exercise.count(),
  ]);
  return {
    metadata: range.metadata,
    users: users.totals,
    workouts: { total: workouts.totals.total, completed: workouts.totals.completed, incomplete: workouts.totals.incomplete, createdInPeriod: workouts.totals.createdInPeriod },
    templates: { total: templates.totals.total, public: templates.totals.public, private: templates.totals.private, unlisted: templates.totals.unlisted, archived: templates.totals.archived, createdInPeriod: templates.totals.createdInPeriod },
    nutrition: { total: nutrition.totals.total, entriesInPeriod: nutrition.totals.entriesInPeriod, participatingUsers: nutrition.totals.participatingUsers },
    health: { totalInjuries: health.totals.totalInjuries, active: health.totals.active, recovered: health.totals.recovered, addedInPeriod: health.totals.addedInPeriod },
    weight: { total: weight.totals.total, entriesInPeriod: weight.totals.entriesInPeriod, participatingUsers: weight.totals.participatingUsers },
    achievements: achievements.totals,
    totalExercises,
  };
}
