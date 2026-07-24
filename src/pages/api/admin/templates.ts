import { randomBytes } from "crypto";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import {
  getWorkoutTemplateCatalogTag,
  workoutTemplateCatalog,
  WORKOUT_TEMPLATE_CATALOG_TAG_PREFIX,
} from "fitness/utils/workoutTemplateCatalog";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const updateSchema = z.object({
  id: z.string().uuid(),
  isArchived: z.boolean(),
});
const createCatalogSchema = z.object({
  catalogSlug: z.string().trim().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  if (req.method === "GET") {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const visibility =
      typeof req.query.visibility === "string" &&
      ["PRIVATE", "UNLISTED", "PUBLIC"].includes(req.query.visibility)
        ? (req.query.visibility as "PRIVATE" | "UNLISTED" | "PUBLIC")
        : undefined;
    const archived =
      req.query.archived === "true"
        ? true
        : req.query.archived === "false"
          ? false
          : undefined;
    const catalogOnly = req.query.catalogOnly === "true";
    const templates = await prisma.workoutTemplate.findMany({
      where: {
        ...(visibility ? { visibility } : {}),
        ...(archived !== undefined ? { isArchived: archived } : {}),
        ...(catalogOnly
          ? {
              tags: {
                hasSome: workoutTemplateCatalog.map((template) =>
                  getWorkoutTemplateCatalogTag(template.slug),
                ),
              },
            }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { owner: { email: { contains: search, mode: "insensitive" } } },
                { owner: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        _count: { select: { exercises: true, workouts: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    return res.json(
      templates.map((template) => ({
        id: template.id,
        title: template.title,
        description: template.description,
        visibility: template.visibility,
        difficulty: template.difficulty,
        isArchived: template.isArchived,
        copyCount: template.copyCount,
        useCount: template.useCount,
        exerciseCount: template._count.exercises,
        workoutCount: template._count.workouts,
        catalogSlug:
          template.tags
            .find((tag) => tag.startsWith(WORKOUT_TEMPLATE_CATALOG_TAG_PREFIX))
            ?.slice(WORKOUT_TEMPLATE_CATALOG_TAG_PREFIX.length) ?? null,
        owner: template.owner,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      })),
    );
  }

  if (req.method === "POST") {
    const parsed = createCatalogSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: "Valid catalog template required" });
    const catalogTemplate = workoutTemplateCatalog.find(
      (template) => template.slug === parsed.data.catalogSlug,
    );
    if (!catalogTemplate)
      return res.status(404).json({ error: "Catalog template not found" });

    const exerciseRecords = await prisma.exercise.findMany({
      where: {
        OR: catalogTemplate.exercises.map((exercise) => ({
          name: exercise.name,
          equipment: exercise.equipment,
        })),
      },
      select: { id: true, name: true, equipment: true },
    });
    const exercisesByKey = new Map(
      exerciseRecords.map((exercise) => [
        `${exercise.name}:${exercise.equipment}`,
        exercise,
      ]),
    );
    const missingExercises = catalogTemplate.exercises.filter(
      (exercise) =>
        !exercisesByKey.has(`${exercise.name}:${exercise.equipment}`),
    );
    if (missingExercises.length > 0) {
      return res.status(409).json({
        error: "Add the required exercises before creating this template",
        missingExercises: missingExercises.map((exercise) => exercise.name),
      });
    }

    const catalogTag = getWorkoutTemplateCatalogTag(catalogTemplate.slug);
    const existing = await prisma.workoutTemplate.findFirst({
      where: { tags: { has: catalogTag } },
    });
    const tags = [...new Set([...catalogTemplate.tags, catalogTag])];
    const exercises = catalogTemplate.exercises.map((exercise, index) => ({
      exerciseId: exercisesByKey.get(`${exercise.name}:${exercise.equipment}`)!.id,
      order: index + 1,
      targetSets: exercise.targetSets,
      minReps: exercise.minReps,
      maxReps: exercise.maxReps,
      targetRpe: exercise.targetRpe,
      restSeconds: exercise.restSeconds,
      notes: exercise.notes ?? null,
    }));
    const template = await prisma.$transaction(async (tx) => {
      if (existing) {
        await tx.templateExercise.deleteMany({
          where: { templateId: existing.id },
        });
        return tx.workoutTemplate.update({
          where: { id: existing.id },
          data: {
            title: catalogTemplate.title,
            description: catalogTemplate.description,
            goal: catalogTemplate.goal,
            difficulty: catalogTemplate.difficulty,
            estimatedDurationM: catalogTemplate.estimatedDurationM,
            visibility: "PUBLIC",
            tags,
            shareToken:
              existing.shareToken ?? randomBytes(24).toString("base64url"),
            isArchived: false,
            exercises: { create: exercises },
          },
        });
      }
      return tx.workoutTemplate.create({
        data: {
          ownerId: adminId,
          title: catalogTemplate.title,
          description: catalogTemplate.description,
          goal: catalogTemplate.goal,
          difficulty: catalogTemplate.difficulty,
          estimatedDurationM: catalogTemplate.estimatedDurationM,
          visibility: "PUBLIC",
          tags,
          shareToken: randomBytes(24).toString("base64url"),
          exercises: { create: exercises },
        },
      });
    });
    await prisma.adminAuditLog.create({
      data: {
        actorId: adminId,
        action: "UPSERT_CATALOG_TEMPLATE",
        targetId: template.id,
        metadata: { catalogSlug: catalogTemplate.slug, title: template.title },
      },
    });
    return res.status(existing ? 200 : 201).json({
      template: { id: template.id, title: template.title },
      created: !existing,
    });
  }

  if (req.method === "PATCH") {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid template update" });
    const existing = await prisma.workoutTemplate.findUnique({
      where: { id: parsed.data.id },
    });
    if (!existing) return res.status(404).json({ error: "Template not found" });
    const updated = await prisma.$transaction(async (tx) => {
      const template = await tx.workoutTemplate.update({
        where: { id: parsed.data.id },
        data: { isArchived: parsed.data.isArchived },
      });
      await tx.adminAuditLog.create({
        data: {
          actorId: adminId,
          action: parsed.data.isArchived
            ? "ARCHIVE_TEMPLATE"
            : "RESTORE_TEMPLATE",
          targetId: template.id,
          metadata: { title: template.title },
        },
      });
      return template;
    });
    return res.json({ id: updated.id, isArchived: updated.isArchived });
  }

  if (req.method === "DELETE") {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!z.string().uuid().safeParse(id).success)
      return res.status(400).json({ error: "Valid template ID required" });
    const existing = await prisma.workoutTemplate.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Template not found" });
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: {
          actorId: adminId,
          action: "DELETE_TEMPLATE",
          targetId: id,
          metadata: { title: existing.title, ownerId: existing.ownerId },
        },
      });
      await tx.workoutTemplate.delete({ where: { id } });
    });
    return res.json({ success: true });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
