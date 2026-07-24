import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateProfile } from "fitness/lib/api/validators/profile";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const result = validateProfile(req.body);
  if (!result.valid)
    return res
      .status(400)
      .json({ error: "Invalid profile", details: result.errors });
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  await prisma.userProfile.update({
    where: { userId },
    data: {
      ...result.data,
      dateOfBirth: result.data.dateOfBirth
        ? new Date(result.data.dateOfBirth)
        : null,
    },
  });
  return res.json({ success: true });
}
