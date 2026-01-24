import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { checkIfPostOrSetError } from "../../../lib/api/api-utils";
import { getUserIdOrSetError } from "../../../lib/auth/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;

  const { email, displayName } = req.body;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  try {
    const isUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { id: userId }],
      },
    });

    if (isUser) {
      return res
        .status(400)
        .send("attempt create user, but it already exists");
    }

    await prisma.user.create({
      data: {
        id: userId,
        email,
        name: displayName,
      },
    });

    return res.status(200).json({ userName: displayName });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).send("Internal Server Error");
  }
}
