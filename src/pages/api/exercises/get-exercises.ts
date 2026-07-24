import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { validateExerciseQuery } from "fitness/lib/api/validators/exercise";
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

  const validation = validateExerciseQuery(req.query);
  if (!validation.valid || !validation.data) {
    return res.status(400).json({ errors: validation.errors });
  }
  const { search, equipment, category, movement, limit, cursor } =
    validation.data;
  const includeInactive = req.query.includeInactive === "true";
  const isAdmin = includeInactive
    ? Boolean(await prisma.adminAccess.findUnique({ where: { userId } }))
    : false;

  const exercises = await prisma.exercise.findMany({
    where: {
      ...(isAdmin ? {} : { isActive: true }),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
      ...(equipment ? { equipment } : {}),
      ...(category ? { category } : {}),
      ...(movement ? { movement } : {}),
    },
    orderBy: { name: "asc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = exercises.length > limit;
  const items = hasMore ? exercises.slice(0, limit) : exercises;
  return res.json({
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
  });
}
