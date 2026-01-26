import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const { name, equipment, movement, category, region, isCompound } = req.body;

  if (!name || !equipment || !movement || !category) {
    return res.status(400).send("Missing required fields");
  }

  const exercise = await prisma.exercise.create({
    data: {
      name,
      equipment,
      movement,
      category,
      region,
      isCompound,
    },
  });

  res.json(exercise);
}
