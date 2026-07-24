import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!isIdentifier(id)) {
    return res.status(400).json({ error: "A valid exercise id is required" });
  }
  const includeInactive = req.query.includeInactive === "true";
  const isAdmin = includeInactive
    ? Boolean(await prisma.adminAccess.findUnique({ where: { userId } }))
    : false;
  const exercise = await prisma.exercise.findFirst({
    where: { id, ...(isAdmin ? {} : { isActive: true }) },
  });
  if (!exercise) return res.status(404).json({ error: "Exercise not found" });
  return res.status(200).json(exercise);
}
