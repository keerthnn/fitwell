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
  const updated = await prisma.$transaction(async (transaction) => {
    const profile = await transaction.userProfile.findUnique({
      where: { userId },
      select: { id: true, weeklyWorkoutTarget: true },
    });
    if (!profile) return false;

    await transaction.userProfile.update({
      where: { userId },
      data: {
        ...result.data,
        dateOfBirth: result.data.dateOfBirth
          ? new Date(result.data.dateOfBirth)
          : null,
      },
    });
    if (profile.weeklyWorkoutTarget !== result.data.weeklyWorkoutTarget) {
      await transaction.workoutDayTargetHistory.create({
        data: {
          userProfileId: profile.id,
          daysPerWeek: result.data.weeklyWorkoutTarget,
        },
      });
    }
    return true;
  });
  if (!updated) return res.status(404).send({ error: "Profile not found" });
  return res.send({ success: true });
}
