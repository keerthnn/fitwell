import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid workout ID" });
  }

  const workout = await prisma.workout.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!workout || workout.userId !== userId) {
    return res.status(404).json({ error: "Workout not found" });
  }

  await prisma.workout.delete({ where: { id } });

  return res.json({ success: true });
}
