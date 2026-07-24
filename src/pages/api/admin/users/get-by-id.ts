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
    return res.status(400).json({ error: "Invalid user id" });
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      adminAccess: true,
      workouts: { orderBy: { workoutDate: "desc" }, take: 20 },
    },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.status(200).json(user);
}
