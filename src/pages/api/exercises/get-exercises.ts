import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { search } = req.query;

  const exercises = await prisma.exercise.findMany({
    where:
      typeof search === "string" && search.length > 0
        ? { name: { contains: search, mode: "insensitive" } }
        : {},
    orderBy: { name: "asc" },
    take: 100,
  });

  return res.json(exercises);
}
