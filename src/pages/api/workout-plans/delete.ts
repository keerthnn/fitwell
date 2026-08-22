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
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!isIdentifier(id))
    return res.status(400).send({ error: "Invalid workout plan ID" });

  const deleted = await prisma.workoutPlan.deleteMany({
    where: { id, userId, isBuiltIn: false },
  });
  if (!deleted.count)
    return res.status(404).send({ error: "Workout Plan not found" });

  return res.status(200).send({ success: true });
}
