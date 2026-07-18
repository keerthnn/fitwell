import { checkIfPostOrSetError } from "fitness/lib/api/api-utils";
import { getDecodedTokenOrSetError } from "fitness/lib/auth/utils";
import prisma from "fitness/lib/prisma";
import { recordUserActivity } from "fitness/lib/analytics/activity";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfPostOrSetError(req, res)) return;

  const token = await getDecodedTokenOrSetError(req, res);
  if (!token) return;
  const email = token.email;
  if (!email)
    return res.status(400).json({ error: "Firebase account has no email" });

  try {
    const user = await prisma.user.upsert({
      where: { id: token.uid },
      update: {
        email,
        name: token.name ?? undefined,
        avatarUrl: token.picture ?? undefined,
      },
      create: {
        id: token.uid,
        email,
        name: token.name ?? "",
        avatarUrl: token.picture ?? null,
      },
    });
    await recordUserActivity(user.id, true);
    return res.status(200).json({ userName: user.name ?? "" });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).send("Internal Server Error");
  }
}
