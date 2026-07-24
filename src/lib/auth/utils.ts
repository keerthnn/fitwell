import { getCookie } from "cookies-next";
import { adminAuth } from "fitness/lib/firebaseAdmin";
import prisma from "fitness/lib/prisma";
import { ID_TOKEN_COOKIE_NAME } from "fitness/utils/cookieToken";
import { recordUserActivity } from "fitness/lib/analytics/activity";
import { NextApiRequest, NextApiResponse } from "next";

async function getIdTokenCookie(req: NextApiRequest, res: NextApiResponse) {
  return await getCookie(ID_TOKEN_COOKIE_NAME, { req, res });
}

async function getIdTokenCookieOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const idToken = await getIdTokenCookie(req, res);
  if (!idToken) res.status(401).send("Could not get id token");
  return idToken;
}

export async function getDecodedToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const idToken = await getCookie(ID_TOKEN_COOKIE_NAME, { req, res });

  if (!idToken) return undefined;
  const decodedToken = await adminAuth.verifyIdToken(idToken as string);
  return decodedToken;
}
export async function getDecodedTokenOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const idToken = await getIdTokenCookieOrSetError(req, res);
  if (!idToken) return;
  try {
    return await adminAuth.verifyIdToken(idToken as string);
  } catch {
    res.status(401).json({ error: "Invalid or expired authentication" });
    return undefined;
  }
}

export async function getUserId(req: NextApiRequest, res: NextApiResponse) {
  const decodedToken = await getDecodedToken(req, res);
  return decodedToken?.uid;
}

export async function getUserIdOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getDecodedTokenOrSetError(req, res);
  if (!token) return;
  const user = await prisma.user.findUnique({
    where: { id: token.uid },
    select: { isDisabled: true, deletedAt: true },
  });
  if (user?.isDisabled || user?.deletedAt) {
    res.status(403).json({ error: "Application access is disabled" });
    return;
  }
  try {
    await recordUserActivity(token.uid);
  } catch (error) {
    // Analytics must never block an otherwise valid authenticated request.
    console.error("Unable to record authenticated activity", {
      userId: token.uid,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
  return token.uid;
}
