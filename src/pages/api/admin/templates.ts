import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const updateSchema = z.object({
  id: z.string().uuid(),
  isArchived: z.boolean(),
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
    const templates = await prisma.workoutTemplate.findMany({
      where: {
        ...(visibility ? { visibility } : {}),
        ...(archived !== undefined ? { isArchived: archived } : {}),
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
        owner: template.owner,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      })),
    );
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

  res.setHeader("Allow", "GET, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
