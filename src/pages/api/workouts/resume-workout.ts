import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateIdBody } from "fitness/lib/api/validators/workout";
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

  const validation = validateIdBody(req.body);
  if (!validation.valid || !validation.data) {
    return res.status(400).send({ errors: validation.errors });
  }

  const result = await prisma.workout.updateMany({
    where: { id: validation.data.id, userId, status: "DRAFT" },
    data: { status: "IN_PROGRESS", startedAt: new Date() },
  });
  if (!result.count) {
    return res.status(409).send({ error: "Workout cannot be resumed" });
  }
  return res.status(200).send({ success: true });
}
