import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateIdBody } from "fitness/lib/api/validators/workout";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import {
  findVisibleWorkoutPlan,
  workoutPlanInclude,
} from "fitness/lib/workoutPlans/access";
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
  const source = await findVisibleWorkoutPlan(validation.data.id, userId);
  if (!source) return res.status(404).send({ error: "Workout Plan not found" });
  const copy = await prisma.workoutPlan.create({
    data: {
      userId,
      name: `${source.name} Copy`,
      description: source.description,
      difficulty: source.difficulty,
      category: source.category,
      daysPerWeek: source.daysPerWeek,
      coverImagePath: source.coverImagePath,
      isBuiltIn: false,
      exercises: {
        create: source.exercises.map((item) => ({
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
  return res.status(201).send(copy);
}
