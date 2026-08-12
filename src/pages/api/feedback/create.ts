import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { validateCreateFeedback } from "fitness/lib/api/validators/feedback";
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

  const validation = validateCreateFeedback(req.body);
  if (!validation.valid)
    return res
      .status(400)
      .send({ error: "Invalid feedback", details: validation.errors });

  const now = new Date();
  const feedback = await prisma.$transaction((tx) =>
    tx.feedback.create({
      data: {
        userId,
        category: validation.data.category,
        subject: validation.data.subject,
        lastMessageAt: now,
        messages: {
          create: {
            authorId: userId,
            authorRole: "USER",
            content: validation.data.message,
            createdAt: now,
          },
        },
      },
      select: { id: true },
    }),
  );

  return res.status(201).send(feedback);
}
