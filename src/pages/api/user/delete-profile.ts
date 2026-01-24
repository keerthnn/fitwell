import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "fitness/lib/prisma";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfDeleteOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  await prisma.userProfile.delete({
    where: { userId },
  });

  return res.json({ success: true });
}