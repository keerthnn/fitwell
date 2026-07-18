import { checkIfGetOrSetError } from "fitness/lib/api/api-utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAnalyticsContext } from "./admin";
import type { ResolvedAdminAnalyticsRange } from "./range";

export function adminAnalyticsHandler(
  load: (range: ResolvedAdminAnalyticsRange) => Promise<unknown>,
) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!checkIfGetOrSetError(req, res)) return;
    const range = await adminAnalyticsContext(req, res);
    if (!range) return;
    try {
      return res.status(200).json(await load(range));
    } catch (error) {
      console.error("Admin analytics request failed", {
        route: req.url?.split("?")[0],
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return res.status(500).json({ error: "Unable to load admin analytics" });
    }
  };
}
