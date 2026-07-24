import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import { requireAdmin } from "fitness/lib/auth/requireAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkIfGetOrSetError(req, res)) return;

  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  return res.status(200).json({ isAdmin: true });
}
