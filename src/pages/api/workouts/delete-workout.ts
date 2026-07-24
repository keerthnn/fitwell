import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfDeleteOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { id } = req.query;
  if (!isIdentifier(id)) {
    return res.status(400).json({ error: "Invalid workout ID" });
  }

  const workout = await prisma.workout.findFirst({ where: { id, userId } });
  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  await prisma.workout.delete({ where: { id } });

  return res.json({ success: true });
}
