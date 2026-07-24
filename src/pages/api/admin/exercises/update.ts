import { auditData } from "fitness/lib/admin/audit";
import { checkIfPatchOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { validateExercise } from "fitness/lib/api/validators/exercise";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPatchOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const id = req.body?.id;
  if (!isIdentifier(id))
    return res.status(400).json({ error: "Invalid exercise id" });
  const result = validateExercise(req.body);
  if (!result.valid) return res.status(400).json({ errors: result.errors });
  const exercise = await prisma.$transaction(async (tx) => {
    const updated = await tx.exercise.update({
      where: { id },
      data: result.data,
    });
    await tx.adminAuditLog.create({
      data: auditData(adminId, "EXERCISE_UPDATED", "Exercise", id),
    });
    return updated;
  });
  return res.status(200).json(exercise);
}
