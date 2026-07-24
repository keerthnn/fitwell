import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfDeleteOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  const owned = await prisma.workoutExercise.findFirst({ where: { id, workout: { userId } } });
  if (!owned) return res.status(404).json({ error: "Workout exercise not found" });
  await prisma.workoutExercise.delete({ where: { id } });
  return res.json({ success: true });
}
