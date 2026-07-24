import prisma from "fitness/lib/prisma";
import { dateKeyInTimezone } from "./time";

const ACTIVITY_THROTTLE_MS = 5 * 60 * 1000;
const recentActivityWrites = new Map<string, number>();

export async function recordUserActivity(userId: string, force = false) {
  const now = new Date();
  const lastWrite = recentActivityWrites.get(userId) ?? 0;
  if (!force && now.getTime() - lastWrite < ACTIVITY_THROTTLE_MS) return;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { timezone: true },
  });
  const timezone = profile?.timezone ?? "UTC";
  const activityDate = new Date(`${dateKeyInTimezone(now, timezone)}T00:00:00.000Z`);

  await prisma.userActivityDay.upsert({
    where: { userId_activityDate: { userId, activityDate } },
    create: {
      userId,
      activityDate,
      firstActiveAt: now,
      lastActiveAt: now,
      requestCount: 1,
    },
    update: { lastActiveAt: now, requestCount: { increment: 1 } },
  });
  recentActivityWrites.set(userId, now.getTime());
}
