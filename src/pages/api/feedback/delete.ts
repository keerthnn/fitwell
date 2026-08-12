import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { isIdentifier } from "fitness/lib/api/validators/common";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfDeleteOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!isIdentifier(id))
    return res.status(400).send({ error: "Invalid feedback ID" });

  const feedback = await prisma.feedback.findFirst({
    where: { id, userId },
    select: {
      id: true,
      _count: {
        select: { messages: { where: { authorRole: "ADMIN" } } },
      },
    },
  });
  if (!feedback)
    return res.status(404).send({ error: "Feedback not found" });
  if (feedback._count.messages > 0)
    return res.status(409).send({
      error: "Feedback cannot be deleted after FitWell Support replies",
    });

  const deleted = await prisma.feedback.deleteMany({
    where: {
      id,
      userId,
      messages: { none: { authorRole: "ADMIN" } },
    },
  });
  if (!deleted.count)
    return res.status(409).send({
      error: "Feedback cannot be deleted after FitWell Support replies",
    });

  return res.status(200).send({ success: true });
}
