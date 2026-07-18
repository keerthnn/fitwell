import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { evaluateAchievements } from "fitness/lib/fitness/achievements";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const source = await prisma.workoutTemplate.findFirst({
    where: {
      id: req.body.id,
      isArchived: false,
      OR: [
        { ownerId: userId },
        { visibility: "PUBLIC" },
        { visibility: "UNLISTED", shareToken: req.body.token },
      ],
    },
    include: { exercises: true },
  });
  if (!source) return res.status(404).json({ error: "Template not found" });
  const copied = await prisma.$transaction(async (tx) => {
    const result = await tx.workoutTemplate.create({
      data: {
        ownerId: userId,
        title: `${source.title} (copy)`,
        description: source.description,
        goal: source.goal,
        difficulty: source.difficulty,
        estimatedDurationM: source.estimatedDurationM,
        visibility: "PRIVATE",
        tags: source.tags,
        exercises: {
          create: source.exercises.map(
            ({
              exerciseId,
              order,
              targetSets,
              minReps,
              maxReps,
              suggestedWeightKg,
              targetRpe,
              restSeconds,
              notes,
            }) => ({
              exerciseId,
              order,
              targetSets,
              minReps,
              maxReps,
              suggestedWeightKg,
              targetRpe,
              restSeconds,
              notes,
            }),
          ),
        },
      },
    });
    await tx.templateCopy.create({
      data: {
        sourceTemplateId: source.id,
        recipientId: userId,
        copiedTemplateId: result.id,
      },
    });
    await tx.workoutTemplate.update({
      where: { id: source.id },
      data: { copyCount: { increment: 1 } },
    });
    return result;
  });
  await evaluateAchievements(source.ownerId);
  return res.status(201).json({ id: copied.id });
}
