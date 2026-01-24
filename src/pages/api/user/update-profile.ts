import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
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

  const { firstName, lastName, gender, age, heightCm, weightKg, goal } =
    req.body;

  const existing = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    return res.status(404).send("Profile does not exist");
  }

  await prisma.userProfile.update({
    where: { userId },
    data: {
      firstName,
      lastName,
      gender,
      age,
      heightCm,
      weightKg,
      goal,
    },
  });

  return res.json({ success: true });
}
