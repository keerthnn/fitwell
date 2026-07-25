import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateWorkoutPlan } from "fitness/lib/api/validators/workout-plan";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import { workoutPlanInclude } from "fitness/lib/workoutPlans/access";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const result = validateWorkoutPlan(req.body);
  if (!result.valid) {
    return res
      .status(400)
      .send({ error: "Invalid Workout Plan", details: result.errors });
  }
  const { exercises, ...plan } = result.data;
  const created = await prisma.workoutPlan.create({
    data: {
      ...plan,
      userId,
      isBuiltIn: false,
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
  return res.status(201).send(created);
}
