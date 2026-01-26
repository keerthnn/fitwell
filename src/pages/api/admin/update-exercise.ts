import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "fitness/lib/prisma";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const { id, ...data } = req.body;
  if (!id) return res.status(400).send("Exercise id required");

  const updated = await prisma.exercise.update({
    where: { id },
    data,
  });

  res.json(updated);
}
