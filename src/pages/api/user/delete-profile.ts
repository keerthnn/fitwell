import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

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
