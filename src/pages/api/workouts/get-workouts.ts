import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { validateWorkoutQuery } from "fitness/lib/api/validators/workout";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const validation = validateWorkoutQuery(req.query);
  if (!validation.valid)
    return res.status(400).json({ errors: validation.errors });
  const { status, search, limit, cursor, sort } = validation.data;
  const rows = await prisma.workout.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
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
    orderBy: { workoutDate: sort === "oldest" ? "asc" : "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  const nextCursor = rows.length > limit ? rows[limit - 1].id : null;
  return res.json({
    items: rows
      .slice(0, limit)
      .map(({ _count, exercises, sourceWorkoutPlan, ...workout }) => ({
        ...workout,
        exerciseCount: _count.exercises,
        representativeExercise: exercises[0]?.exercise ?? null,
        sourcePlanCoverImagePath: sourceWorkoutPlan?.coverImagePath ?? null,
        sourcePlanCategory: sourceWorkoutPlan?.category ?? null,
      })),
    nextCursor,
  });
}
