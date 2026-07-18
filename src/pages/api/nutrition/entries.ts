import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { evaluateAchievements } from "fitness/lib/fitness/achievements";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const entrySchema = z.object({
  id: z.string().uuid().optional(),
  consumedAt: z.coerce.date(),
  mealType: z.enum([
    "BREAKFAST",
    "LUNCH",
    "DINNER",
    "SNACK",
    "PRE_WORKOUT",
    "POST_WORKOUT",
    "OTHER",
  ]),
  foodName: z.string().trim().min(1).max(160),
  calories: z.number().int().nonnegative().max(20000),
  proteinG: z.number().nonnegative().max(1000).nullable().optional(),
  carbsG: z.number().nonnegative().max(2000).nullable().optional(),
  fatG: z.number().nonnegative().max(1000).nullable().optional(),
  fibreG: z.number().nonnegative().max(500).nullable().optional(),
  servingQuantity: z.number().positive().nullable().optional(),
  servingUnit: z.string().max(40).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  if (req.method === "GET") {
    const start = new Date(String(req.query.start));
    const end = new Date(String(req.query.end));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return res.status(400).json({ error: "Valid range required" });
    const [entries, profile, burned] = await Promise.all([
      prisma.nutritionEntry.findMany({
        where: { userId, consumedAt: { gte: start, lt: end } },
        orderBy: { consumedAt: "asc" },
      }),
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.workout.aggregate({
        where: { userId, status: "COMPLETED", date: { gte: start, lt: end } },
        _sum: { caloriesBurned: true },
      }),
    ]);
    const consumed = entries.reduce((sum, entry) => sum + entry.calories, 0);
    const caloriesBurned = burned._sum.caloriesBurned ?? 0;
    const macros = entries.reduce(
      (sum, entry) => ({
        proteinG: sum.proteinG + (entry.proteinG ?? 0),
        carbsG: sum.carbsG + (entry.carbsG ?? 0),
        fatG: sum.fatG + (entry.fatG ?? 0),
        fibreG: sum.fibreG + (entry.fibreG ?? 0),
      }),
      { proteinG: 0, carbsG: 0, fatG: 0, fibreG: 0 },
    );
    const target = profile?.dailyCalorieTarget ?? 2000;
    return res.json({
      entries,
      consumed,
      burned: caloriesBurned,
      net: consumed - caloriesBurned,
      remaining: target - consumed,
      target,
      macros,
    });
  }
  if (req.method === "POST" || req.method === "PATCH") {
    const parsed = entrySchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          error: "Invalid nutrition entry",
          fieldErrors: z.flattenError(parsed.error).fieldErrors,
        });
    const { id, ...data } = parsed.data;
    let entry;
    if (req.method === "PATCH") {
      if (!id) return res.status(400).json({ error: "Entry ID required" });
      const owned = await prisma.nutritionEntry.findFirst({
        where: { id, userId },
      });
      if (!owned) return res.status(404).json({ error: "Entry not found" });
      entry = await prisma.nutritionEntry.update({ where: { id }, data });
    } else
      entry = await prisma.nutritionEntry.create({ data: { userId, ...data } });
    const newlyEarned = await evaluateAchievements(userId);
    return res
      .status(req.method === "POST" ? 201 : 200)
      .json({ entry, newlyEarned });
  }
  if (req.method === "DELETE") {
    const id = String(req.query.id);
    const owned = await prisma.nutritionEntry.findFirst({
      where: { id, userId },
    });
    if (!owned) return res.status(404).json({ error: "Entry not found" });
    await prisma.nutritionEntry.delete({ where: { id } });
    return res.json({ success: true });
  }
  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
