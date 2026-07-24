import { getUserIdOrSetError } from "fitness/lib/auth/utils";
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
  const id = String(req.query.id);
  const template = await prisma.workoutTemplate.findFirst({
    where: {
      id,
      isArchived: false,
      OR: [{ ownerId: userId }, { visibility: "PUBLIC" }],
    },
    include: {
      owner: { select: { name: true, avatarUrl: true } },
      exercises: { orderBy: { order: "asc" }, include: { exercise: true } },
    },
  });
  if (!template) return res.status(404).json({ error: "Template not found" });
  return res.json({ ...template, exerciseCount: template.exercises.length });
}
