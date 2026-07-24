import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const startOfWeek = () => {
  const date = new Date();
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const [user, profile, completed, activeWorkout, plans] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.workout.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { workoutDate: "desc" },
      include: { _count: { select: { exercises: true } } },
    }),
    prisma.workout.findFirst({
      where: { userId, status: "IN_PROGRESS" },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { exercises: true } } },
    }),
    prisma.workoutPlan.findMany({
      where: { userId, isArchived: false, isActive: true },
      take: 4,
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, coverImagePath: true },
    }),
  ]);
  const mapWorkout = (workout: typeof activeWorkout) =>
    workout
      ? {
          id: workout.id,
          name: workout.name,
          workoutDate: workout.workoutDate.toISOString(),
          status: workout.status,
          entryMode: workout.entryMode,
          durationMinutes: workout.durationMinutes,
          exerciseCount: workout._count.exercises,
        }
      : null;
  return res.status(200).json({
    greetingName: profile?.firstName ?? user?.displayName ?? "there",
    workoutsThisWeek: completed.filter(
      (workout) => workout.workoutDate >= startOfWeek(),
    ).length,
    weeklyTarget: profile?.weeklyWorkoutTarget ?? 3,
    currentStreak: 0,
    totalDurationMinutes: completed.reduce(
      (sum, workout) => sum + (workout.durationMinutes ?? 0),
      0,
    ),
    recentWorkouts: completed.slice(0, 5).map((workout) => mapWorkout(workout)),
    activeWorkout: mapWorkout(activeWorkout),
    savedPlans: plans,
  });
}
