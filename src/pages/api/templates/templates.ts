import { randomBytes } from "crypto";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { evaluateAchievements } from "fitness/lib/fitness/achievements";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const exerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  order: z.number().int().min(1),
  targetSets: z.number().int().min(1).max(20).default(3),
  minReps: z.number().int().min(1).max(1000).nullable().optional(),
  maxReps: z.number().int().min(1).max(1000).nullable().optional(),
  suggestedWeightKg: z.number().nonnegative().nullable().optional(),
  targetRpe: z.number().min(1).max(10).nullable().optional(),
  restSeconds: z.number().int().min(0).max(3600).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});
const schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().max(2000).nullable().optional(),
  goal: z.string().max(200).nullable().optional(),
  difficulty: z
    .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .default("BEGINNER"),
  estimatedDurationM: z
    .number()
    .int()
    .positive()
    .max(1440)
    .nullable()
    .optional(),
  visibility: z.enum(["PRIVATE", "UNLISTED", "PUBLIC"]).default("PRIVATE"),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  exercises: z.array(exerciseSchema).max(50).default([]),
});
const include = {
  owner: { select: { name: true, avatarUrl: true } },
  exercises: {
    orderBy: { order: "asc" as const },
    include: { exercise: true },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  if (req.method === "GET") {
    const mode = req.query.mode === "discover" ? "discover" : "mine";
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const templates = await prisma.workoutTemplate.findMany({
      where: {
        isArchived: false,
        ...(mode === "mine" ? { ownerId: userId } : { visibility: "PUBLIC" }),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { tags: { has: search.toLowerCase() } },
              ],
            }
          : {}),
      },
      include,
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return res.json({
      items: templates.map((item) => ({
        ...item,
        exerciseCount: item.exercises.length,
      })),
      nextCursor: null,
    });
  }
  if (req.method === "POST" || req.method === "PATCH") {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          error: "Invalid template",
          fieldErrors: z.flattenError(parsed.error).fieldErrors,
        });
    const { id, exercises, ...data } = parsed.data;
    if (
      id &&
      !(await prisma.workoutTemplate.findFirst({
        where: { id, ownerId: userId },
      }))
    )
      return res.status(404).json({ error: "Template not found" });
    const shareToken =
      data.visibility === "PRIVATE"
        ? null
        : randomBytes(24).toString("base64url");
    const template = await prisma.$transaction(async (tx) => {
      if (id) {
        await tx.templateExercise.deleteMany({ where: { templateId: id } });
        return tx.workoutTemplate.update({
          where: { id },
          data: { ...data, shareToken, exercises: { create: exercises } },
          include,
        });
      }
      return tx.workoutTemplate.create({
        data: {
          ownerId: userId,
          ...data,
          shareToken,
          exercises: { create: exercises },
        },
        include,
      });
    });
    const newlyEarned = await evaluateAchievements(userId);
    return res.status(id ? 200 : 201).json({ template, newlyEarned });
  }
  if (req.method === "DELETE") {
    const id = String(req.query.id);
    const owned = await prisma.workoutTemplate.findFirst({
      where: { id, ownerId: userId },
    });
    if (!owned) return res.status(404).json({ error: "Template not found" });
    await prisma.workoutTemplate.update({
      where: { id },
      data: { isArchived: true },
    });
    return res.json({ success: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
