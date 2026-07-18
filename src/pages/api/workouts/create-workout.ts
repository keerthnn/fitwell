import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { parseOrError } from "fitness/lib/api/validation";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().max(120).optional(),
  date: z.coerce.date(),
  durationM: z.number().int().positive().max(1440).optional(),
  notes: z.string().max(2000).optional(),
  templateId: z.string().uuid().optional(),
  intensity: z.enum(["LIGHT", "MODERATE", "VIGOROUS"]).default("MODERATE"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const parsed = parseOrError(schema, req.body);
  if (parsed.error) return res.status(400).json(parsed.error);
  const { title, date, durationM, notes, templateId, intensity } = parsed.data;
  const template = templateId
    ? await prisma.workoutTemplate.findFirst({
        where: {
          id: templateId,
          OR: [{ ownerId: userId }, { visibility: "PUBLIC" }],
        },
        include: { exercises: { orderBy: { order: "asc" } } },
      })
    : null;
  if (templateId && !template)
    return res.status(404).json({ error: "Template not found" });
  const workout = await prisma.$transaction(async (tx) => {
    const created = await tx.workout.create({
      data: {
        userId,
        title: title ?? template?.title ?? null,
        date,
        durationM: durationM ?? null,
        notes: notes ?? null,
        intensity,
        status: "IN_PROGRESS",
        startedAt: new Date(),
        templateId: template?.id,
        exercises: template
          ? {
              create: template.exercises.map((item) => ({
                exerciseId: item.exerciseId,
                order: item.order,
                notes: item.notes,
                sets: {
                  create: Array.from(
                    { length: item.targetSets },
                    (_, index) => ({
                      setNumber: index + 1,
                      reps: item.minReps,
                      weightKg: item.suggestedWeightKg,
                      rpe: item.targetRpe,
                      restDurationS: item.restSeconds,
                    }),
                  ),
                },
              })),
            }
          : undefined,
      },
    });
    if (template)
      await Promise.all([
        tx.workoutTemplate.update({
          where: { id: template.id },
          data: { useCount: { increment: 1 } },
        }),
        tx.templateUseEvent.create({
          data: {
            templateId: template.id,
            templateTitleSnapshot: template.title,
          },
        }),
      ]);
    return created;
  });

  return res.json({ id: workout.id });
}
