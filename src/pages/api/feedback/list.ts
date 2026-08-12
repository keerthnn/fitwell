import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { validateFeedbackQuery } from "fitness/lib/api/validators/feedback";
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

  const validation = validateFeedbackQuery(req.query);
  if (!validation.valid)
    return res
      .status(400)
      .send({ error: "Invalid filters", details: validation.errors });

  const { search, category, status, cursor, limit } = validation.data;
  const rows = await prisma.feedback.findMany({
    where: {
      userId,
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { subject: { contains: search, mode: "insensitive" } },
              {
                messages: {
                  some: { content: { contains: search, mode: "insensitive" } },
                },
              },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      category: true,
      subject: true,
      status: true,
      lastMessageAt: true,
      createdAt: true,
      _count: {
        select: {
          messages: { where: { authorRole: "ADMIN" } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true },
      },
    },
    orderBy: [{ lastMessageAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  const nextCursor = rows.length > limit ? rows[limit - 1].id : null;

  return res.status(200).send({
    items: rows.slice(0, limit).map(({ messages, _count, ...feedback }) => ({
      ...feedback,
      lastMessagePreview: messages[0]?.content ?? "",
      canDelete: _count.messages === 0,
    })),
    nextCursor,
  });
}
