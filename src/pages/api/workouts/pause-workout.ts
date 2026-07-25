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
  const result = validateIdBody(req.body);
  if (!result.valid)
    return res
      .status(400)
      .send({ error: "Invalid request", details: result.errors });
  const workout = await prisma.workout.findFirst({
    where: { id: result.data.id, userId, status: "IN_PROGRESS" },
  });
  if (!workout)
    return res.status(404).send({ error: "Active workout not found" });
  return res.send(
    await prisma.workout.update({
      where: { id: workout.id },
      data: { status: "DRAFT" },
    }),
  );
}
