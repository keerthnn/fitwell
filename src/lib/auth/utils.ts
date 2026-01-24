import { getCookie } from "cookies-next";
import { adminAuth } from "fitness/lib/firebaseAdmin";
import { ID_TOKEN_COOKIE_NAME } from "fitness/utils/cookieToken";
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
  const decodedToken = await adminAuth.verifyIdToken(idToken as string);
  if (!decodedToken) res.status(403).send("Could not get decoded token");
  return decodedToken;
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
  return token.uid;
}
