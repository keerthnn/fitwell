import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { _count: { select: { exercises: true } } },
  });

  return res.json(
    workouts.map((w) => ({
      id: w.id,
      title: w.title,
      date: w.date.toISOString(),
      durationM: w.durationM,
      exerciseCount: w._count.exercises,
    }))
  );
}
