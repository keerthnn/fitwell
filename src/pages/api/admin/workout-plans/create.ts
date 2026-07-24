import { auditData } from "fitness/lib/admin/audit";
import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateWorkoutPlan } from "fitness/lib/api/validators/workout-plan";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const result = validateWorkoutPlan(req.body);
  if (!result.valid) return res.status(400).json({ errors: result.errors });
  const { exercises, ...data } = result.data;
  const plan = await prisma.$transaction(async (tx) => {
    const created = await tx.workoutPlan.create({
      data: {
        ...data,
        userId: null,
        isBuiltIn: true,
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
      data: auditData(
        adminId,
        "WORKOUT_PLAN_CREATED",
        "WorkoutPlan",
        created.id,
      ),
    });
    return created;
  });
  return res.status(201).json(plan);
}
