import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { ensureAchievementDefinitions } from "fitness/lib/fitness/achievements";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  await ensureAchievementDefinitions();
  const definitions = await prisma.achievement.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: { users: { where: { userId }, select: { awardedAt: true } } },
  });
  return res.json(
    definitions.map(({ users, ...definition }) => ({
      ...definition,
      earned: users.length > 0,
      awardedAt: users[0]?.awardedAt ?? null,
    })),
  );
}
