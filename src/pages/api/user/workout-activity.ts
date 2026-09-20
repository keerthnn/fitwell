import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import {
  getCompletedWorkoutDates,
  getWorkoutActivityRange,
} from "fitness/lib/workouts/activityCalendar";
import type { WorkoutActivityCalendarResponse } from "fitness/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;

  try {
    const userId = await getUserIdOrSetError(req, res);
    if (!userId) return;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { timezone: true },
    });
    const range = getWorkoutActivityRange(new Date(), profile?.timezone);
    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        status: "COMPLETED",
        workoutDate: { gte: range.queryStart, lt: range.queryEnd },
      },
      select: { workoutDate: true },
    });
    const response: WorkoutActivityCalendarResponse = {
      timezone: range.timezone,
      startDate: range.startDate,
      endDate: range.endDate,
      todayDate: range.todayDate,
      completedDates: getCompletedWorkoutDates(
        workouts.map((workout) => workout.workoutDate),
        range,
      ),
    };

    return res.status(200).send(response);
  } catch {
    return res
      .status(500)
      .send({ error: "Workout activity could not be loaded" });
  }
}
