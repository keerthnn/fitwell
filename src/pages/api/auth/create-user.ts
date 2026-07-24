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
    const existing = await prisma.user.findUnique({ where: { id: token.uid } });
    if (existing?.deletedAt || existing?.isDisabled)
      return res.status(403).json({ error: "Application account is disabled" });
    const user = await prisma.user.upsert({
      where: { id: token.uid },
      update: {
        email,
        displayName: token.name ?? undefined,
        photoURL: token.picture ?? undefined,
        lastActiveAt: new Date(),
      },
      create: {
        id: token.uid,
        email,
        displayName: token.name ?? "",
        photoURL: token.picture ?? null,
        lastActiveAt: new Date(),
      },
    });
    await recordUserActivity(user.id, true);
    return res.status(200).json({ userName: user.displayName ?? "" });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).send("Internal Server Error");
  }
}
