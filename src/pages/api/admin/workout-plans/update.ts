import { auditData } from "fitness/lib/admin/audit";
import { checkIfPatchOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { validateWorkoutPlan } from "fitness/lib/api/validators/workout-plan";
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
    return res.status(400).send({ error: "Invalid Workout Plan id" });
  const result = validateWorkoutPlan(req.body);
  if (!result.valid) return res.status(400).send({ errors: result.errors });
  const existing = await prisma.workoutPlan.findFirst({
    where: { id, userId: null, isBuiltIn: true },
  });
  if (!existing)
    return res.status(404).send({ error: "Built-in Workout Plan not found" });
  const { exercises, ...data } = result.data;
  const plan = await prisma.$transaction(async (tx) => {
    await tx.workoutPlanExercise.deleteMany({ where: { workoutPlanId: id } });
    const updated = await tx.workoutPlan.update({
      where: { id },
      data: {
        ...data,
        exercises: {
          create: exercises.map((item) => ({
            exerciseId: item.exerciseId,
            order: item.order,
            sets: item.sets,
            minimumReps: item.minimumReps,
            maximumReps: item.maximumReps,
            weightGuidance: item.weightGuidance,
            restSeconds: item.restSeconds,
            notes: item.notes,
          })),
        },
      },
      include: { exercises: true },
    });
    await tx.adminAuditLog.create({
      data: auditData(adminId, "WORKOUT_PLAN_UPDATED", "WorkoutPlan", id),
    });
    return updated;
  });
  return res.status(200).send(plan);
}
