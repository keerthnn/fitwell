import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!isIdentifier(id))
    return res.status(400).send({ error: "Invalid feedback ID" });

  const feedback = await prisma.feedback.findFirst({
    where: { id, userId },
    select: {
      id: true,
      category: true,
      subject: true,
      status: true,
      lastMessageAt: true,
      createdAt: true,
      messages: {
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: {
          id: true,
          authorRole: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });
  if (!feedback)
    return res.status(404).send({ error: "Feedback not found" });

  return res.status(200).send({
    ...feedback,
    lastMessagePreview: feedback.messages.at(-1)?.content ?? "",
    canDelete: !feedback.messages.some(
      (message) => message.authorRole === "ADMIN",
    ),
  });
}
