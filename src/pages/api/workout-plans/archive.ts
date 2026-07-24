import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const id = req.body?.id;
  if (!isIdentifier(id) || typeof req.body?.archived !== "boolean") {
    return res.status(400).json({ error: "Invalid archive request" });
  }
  const result = await prisma.workoutPlan.updateMany({
    where: { id, userId, isBuiltIn: false },
    data: { isArchived: req.body.archived },
  });
  if (!result.count)
    return res.status(404).json({ error: "Workout Plan not found" });
  return res.status(200).json({ id, isArchived: req.body.archived });
}
