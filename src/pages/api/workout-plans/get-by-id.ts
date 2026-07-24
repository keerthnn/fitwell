import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import { findVisibleWorkoutPlan, workoutPlanInclude } from "fitness/lib/workoutPlans/access";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!isIdentifier(id)) return res.status(400).json({ error: "Invalid id" });
  const includeArchived = req.query.includeArchived === "true";
  const isAdmin = includeArchived
    ? Boolean(await prisma.adminAccess.findUnique({ where: { userId } }))
    : false;
  const plan = isAdmin
    ? await prisma.workoutPlan.findFirst({
        where: { id, userId: null, isBuiltIn: true },
        include: workoutPlanInclude,
      })
    : await findVisibleWorkoutPlan(id, userId);
  if (!plan) return res.status(404).json({ error: "Workout Plan not found" });
  return res.status(200).json(plan);
}
