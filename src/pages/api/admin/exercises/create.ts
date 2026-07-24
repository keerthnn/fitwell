import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateExercise } from "fitness/lib/api/validators/exercise";
import { auditData } from "fitness/lib/admin/audit";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfPostOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const result = validateExercise(req.body);
  if (!result.valid) return res.status(400).json({ errors: result.errors });
  const exercise = await prisma.$transaction(async (tx) => {
    const created = await tx.exercise.create({ data: result.data });
    await tx.adminAuditLog.create({ data: auditData(adminId, "EXERCISE_CREATED", "Exercise", created.id) });
    return created;
  });
  return res.status(201).json(exercise);
}
