import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateIdBody } from "fitness/lib/api/validators/workout";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import { findVisibleWorkoutPlan } from "fitness/lib/workoutPlans/access";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const validation = validateIdBody(req.body);
  if (!validation.valid)
    return res.status(400).send({ errors: validation.errors });
  const plan = await findVisibleWorkoutPlan(validation.data.id, userId);
  if (!plan) return res.status(404).send({ error: "Workout Plan not found" });
  const workout = await prisma.workout.create({
    data: {
      userId,
      name: plan.name,
      workoutDate: new Date(),
      status: "IN_PROGRESS",
      entryMode: "PLAN",
      startedAt: new Date(),
      sourceWorkoutPlanId: plan.id,
      exercises: {
        create: plan.exercises.map((item) => ({
          exerciseId: item.exerciseId,
          order: item.order,
          notes: item.notes,
          sets: {
            create: Array.from({ length: item.sets }, (_, index) => ({
              setNumber: index + 1,
              restSeconds: item.restSeconds,
            })),
          },
        })),
      },
    },
  });
  return res.status(201).send({ id: workout.id });
}
