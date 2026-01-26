import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).send("Exercise id required");
  }

  await prisma.exercise.delete({
    where: { id },
  });

  res.json({ success: true });
}
