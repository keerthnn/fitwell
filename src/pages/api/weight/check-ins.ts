import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
const schema = z.object({
  recordedAt: z.coerce.date(),
  weightKg: z.number().positive().max(500),
  notes: z.string().max(500).nullable().optional(),
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  if (req.method === "GET")
    return res.json(
      await prisma.weightCheckIn.findMany({
        where: { userId },
        orderBy: { recordedAt: "desc" },
        take: 100,
      }),
    );
  if (req.method === "POST") {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid check-in" });
    return res
      .status(201)
      .json(
        await prisma.weightCheckIn.create({ data: { userId, ...parsed.data } }),
      );
  }
  if (req.method === "DELETE") {
    const id = String(req.query.id);
    const owned = await prisma.weightCheckIn.findFirst({
      where: { id, userId },
    });
    if (!owned) return res.status(404).json({ error: "Check-in not found" });
    await prisma.weightCheckIn.delete({ where: { id } });
    return res.json({ success: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
