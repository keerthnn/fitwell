import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const conditionSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.literal("condition"),
  name: z.string().trim().min(1).max(160),
  status: z.enum(["ACTIVE", "MANAGED", "RESOLVED"]).default("ACTIVE"),
  severity: z.string().max(80).nullable().optional(),
  startedAt: z.coerce.date().nullable().optional(),
  resolvedAt: z.coerce.date().nullable().optional(),
  clinicianGuidance: z.string().max(1000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});
const injurySchema = z.object({
  id: z.string().uuid().optional(),
  type: z.literal("injury"),
  bodyRegion: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(160),
  side: z
    .enum(["LEFT", "RIGHT", "BILATERAL", "NOT_APPLICABLE"])
    .default("NOT_APPLICABLE"),
  status: z.enum(["ACTIVE", "RECOVERING", "RESOLVED"]).default("ACTIVE"),
  painLevel: z.number().int().min(1).max(10).nullable().optional(),
  startedAt: z.coerce.date().nullable().optional(),
  resolvedAt: z.coerce.date().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  exercisesToAvoid: z.array(z.string().max(120)).max(50).default([]),
  contraindicationTags: z.array(z.string().max(80)).max(50).default([]),
});
const recordSchema = z.discriminatedUnion("type", [
  conditionSchema,
  injurySchema,
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  if (req.method === "GET") {
    const [conditions, injuries] = await Promise.all([
      prisma.medicalCondition.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.injury.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
    ]);
    return res.json({ conditions, injuries });
  }
  if (req.method === "POST" || req.method === "PATCH") {
    const parsed = recordSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          error: "Invalid health record",
          fieldErrors: z.flattenError(parsed.error).fieldErrors,
        });
    if (parsed.data.type === "condition") {
      const { id } = parsed.data;
      const data = {
        name: parsed.data.name,
        status: parsed.data.status,
        severity: parsed.data.severity,
        startedAt: parsed.data.startedAt,
        resolvedAt: parsed.data.resolvedAt,
        clinicianGuidance: parsed.data.clinicianGuidance,
        notes: parsed.data.notes,
      };
      if (
        id &&
        !(await prisma.medicalCondition.findFirst({ where: { id, userId } }))
      )
        return res.status(404).json({ error: "Condition not found" });
      const record = id
        ? await prisma.medicalCondition.update({ where: { id }, data })
        : await prisma.medicalCondition.create({ data: { userId, ...data } });
      return res.status(id ? 200 : 201).json(record);
    }
    const { id } = parsed.data;
    const data = {
      bodyRegion: parsed.data.bodyRegion,
      name: parsed.data.name,
      side: parsed.data.side,
      status: parsed.data.status,
      painLevel: parsed.data.painLevel,
      startedAt: parsed.data.startedAt,
      resolvedAt: parsed.data.resolvedAt,
      notes: parsed.data.notes,
      exercisesToAvoid: parsed.data.exercisesToAvoid,
      contraindicationTags: parsed.data.contraindicationTags,
    };
    if (id && !(await prisma.injury.findFirst({ where: { id, userId } })))
      return res.status(404).json({ error: "Injury not found" });
    const record = id
      ? await prisma.injury.update({ where: { id }, data })
      : await prisma.injury.create({ data: { userId, ...data } });
    return res.status(id ? 200 : 201).json(record);
  }
  if (req.method === "DELETE") {
    const id = String(req.query.id);
    const type = req.query.type;
    if (type === "condition") {
      const record = await prisma.medicalCondition.findFirst({
        where: { id, userId },
      });
      if (!record)
        return res.status(404).json({ error: "Condition not found" });
      await prisma.medicalCondition.delete({ where: { id } });
    } else {
      const record = await prisma.injury.findFirst({ where: { id, userId } });
      if (!record) return res.status(404).json({ error: "Injury not found" });
      await prisma.injury.delete({ where: { id } });
    }
    return res.json({ success: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
