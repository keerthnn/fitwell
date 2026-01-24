import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { title, date, durationM, notes } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const workout = await prisma.workout.create({
    data: {
      userId,
      title: title ?? null,
      date: new Date(date),
      durationM: durationM ?? null,
      notes: notes ?? null,
    },
  });

  return res.json({ id: workout.id });
}
