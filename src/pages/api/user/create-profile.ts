import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { profileSchema } from "fitness/lib/api/schemas";
import { parseOrError } from "fitness/lib/api/validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const parsed = parseOrError(profileSchema, req.body);
  if (parsed.error) return res.status(400).json(parsed.error);

  const existing = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    return res.status(409).send("Profile already exists");
  }

  await prisma.userProfile.create({
    data: { userId, ...parsed.data },
  });

  return res.json({ success: true });
}
