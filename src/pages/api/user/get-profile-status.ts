import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "fitness/lib/prisma";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  return res.json({
    hasProfile: Boolean(profile),
  });
}
