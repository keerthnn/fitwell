import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import { calculateWeeklyGoal } from "fitness/lib/workouts/weeklyGoal";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const [user, profile, completed, activeWorkout, plans, frequentExercises] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userProfile.findUnique({
        where: { userId },
        select: {
          firstName: true,
          timezone: true,
          weeklyWorkoutTarget: true,
          workoutDayTargetHistory: {
            orderBy: { effectiveAt: "asc" },
            select: { daysPerWeek: true, effectiveAt: true },
          },
        },
      }),
      prisma.workout.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { workoutDate: "desc" },
        include: {
          _count: { select: { exercises: true } },
          exercises: {
            orderBy: { order: "asc" },
            take: 1,
            select: {
              exercise: {
                select: {
                  name: true,
                  imagePath: true,
                  equipmentImagePath: true,
                  equipment: true,
                  primaryMuscle: true,
                  category: true,
                  movement: true,
                },
              },
            },
          },
          sourceWorkoutPlan: {
            select: { coverImagePath: true, category: true },
          },
        },
      }),
      prisma.workout.findFirst({
        where: { userId, status: "IN_PROGRESS" },
        orderBy: { updatedAt: "desc" },
        include: {
          _count: { select: { exercises: true } },
          exercises: {
            orderBy: { order: "asc" },
            take: 1,
            select: {
              exercise: {
                select: {
                  name: true,
                  imagePath: true,
                  equipmentImagePath: true,
                  equipment: true,
                  primaryMuscle: true,
                  category: true,
                  movement: true,
                },
              },
            },
          },
          sourceWorkoutPlan: {
            select: { coverImagePath: true, category: true },
          },
        },
      }),
      prisma.workoutPlan.findMany({
        where: { userId, isArchived: false, isActive: true },
        take: 4,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, coverImagePath: true },
      }),
      prisma.workoutExercise.groupBy({
        by: ["exerciseId"],
        where: { workout: { userId, status: "COMPLETED" } },
        _count: { exerciseId: true },
        orderBy: { _count: { exerciseId: "desc" } },
        take: 4,
      }),
    ]);
  const exerciseRows = frequentExercises.length
    ? await prisma.exercise.findMany({
        where: { id: { in: frequentExercises.map((item) => item.exerciseId) } },
        select: {
          id: true,
          name: true,
          imagePath: true,
          equipmentImagePath: true,
          equipment: true,
          primaryMuscle: true,
          category: true,
          movement: true,
        },
      })
    : [];
  const exerciseById = new Map(
    exerciseRows.map((exercise) => [exercise.id, exercise]),
  );
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
          representativeExercise: workout.exercises[0]?.exercise ?? null,
          sourcePlanCoverImagePath:
            workout.sourceWorkoutPlan?.coverImagePath ?? null,
          sourcePlanCategory: workout.sourceWorkoutPlan?.category ?? null,
        }
      : null;
  const weeklyGoal = calculateWeeklyGoal({
    now: new Date(),
    timezone: profile?.timezone,
    currentTarget: profile?.weeklyWorkoutTarget,
    targetHistory: profile?.workoutDayTargetHistory ?? [],
    workoutDates: completed.map((workout) => workout.workoutDate),
  });
  return res.status(200).send({
    greetingName: profile?.firstName ?? user?.displayName ?? "there",
    ...weeklyGoal,
    completedWorkouts: completed.length,
    totalDurationMinutes: completed.reduce(
      (sum, workout) => sum + (workout.durationMinutes ?? 0),
      0,
    ),
    recentWorkouts: completed.slice(0, 5).map((workout) => mapWorkout(workout)),
    activeWorkout: mapWorkout(activeWorkout),
    savedPlans: plans,
    frequentExercises: frequentExercises.flatMap((item) => {
      const exercise = exerciseById.get(item.exerciseId);
      return exercise ? [{ exercise, count: item._count.exerciseId }] : [];
    }),
  });
}
