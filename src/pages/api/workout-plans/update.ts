import { checkIfPatchOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { validateWorkoutPlan } from "fitness/lib/api/validators/workout-plan";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import { workoutPlanInclude } from "fitness/lib/workoutPlans/access";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPatchOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const id = typeof req.body?.id === "string" ? req.body.id : "";
  if (!isIdentifier(id)) return res.status(400).send({ error: "Invalid id" });
  const result = validateWorkoutPlan(req.body);
  if (!result.valid)
    return res
      .status(400)
      .send({ error: "Invalid Workout Plan", details: result.errors });
  const owned = await prisma.workoutPlan.findFirst({
    where: { id, userId, isBuiltIn: false },
  });
  if (!owned) return res.status(404).send({ error: "Workout Plan not found" });
  const { exercises, ...plan } = result.data;
  const updated = await prisma.$transaction(async (tx) => {
    await tx.workoutPlanExercise.deleteMany({ where: { workoutPlanId: id } });
    return tx.workoutPlan.update({
      where: { id },
      data: {
        ...plan,
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
      include: workoutPlanInclude,
    });
  });
  return res.status(200).send(updated);
}
