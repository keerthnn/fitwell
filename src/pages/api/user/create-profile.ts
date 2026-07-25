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
      .send({ error: "Invalid profile", details: result.errors });
  const existing = await prisma.userProfile.findUnique({ where: { userId } });
  if (existing)
    return res.status(409).send({ error: "Profile already exists" });
  await prisma.userProfile.create({
    data: {
      ...result.data,
      dateOfBirth: result.data.dateOfBirth
        ? new Date(result.data.dateOfBirth)
        : null,
      userId,
    },
  });
  return res.status(201).send({ success: true });
}
