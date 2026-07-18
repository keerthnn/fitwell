import { checkIfDeleteOrSetError } from "fitness/lib/api/api-utils";
import { getUserIdOrSetError } from "fitness/lib/auth/utils";
import { adminAuth } from "fitness/lib/firebaseAdmin";
import prisma from "fitness/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfDeleteOrSetError(req, res)) return;
  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;
  if (req.query.confirm !== "DELETE") return res.status(400).json({ error: "Confirmation required" });
  await prisma.user.delete({ where: { id: userId } });
  try {
    await adminAuth.deleteUser(userId);
  } catch {
    return res.status(502).json({ error: "FitWell data was deleted, but Firebase account cleanup must be retried" });
  }
  return res.json({ success: true });
}
