import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  if (!(await requireAdmin(req, res))) return;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!isIdentifier(id))
    return res.status(400).send({ error: "Invalid workout id" });
  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, displayName: true } },
      exercises: { include: { exercise: true, sets: true } },
    },
  });
  if (!workout) return res.status(404).send({ error: "Workout not found" });
  return res.status(200).send(workout);
}
