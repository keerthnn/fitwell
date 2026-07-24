import { NextApiRequest, NextApiResponse } from "next";

export function checkIfPostOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return checkIfTypeOrSetError(req, res, "POST");
}
export function checkIfGetOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return checkIfTypeOrSetError(req, res, "GET");
}
export function checkIfDeleteOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return checkIfTypeOrSetError(req, res, "DELETE");
}
export function checkIfPatchOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return checkIfTypeOrSetError(req, res, "PATCH");
}
export function checkIfPutOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return checkIfTypeOrSetError(req, res, "PUT");
}

function checkIfTypeOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
  type: "POST" | "DELETE" | "GET" | "PATCH" | "PUT",
) {
  if (req.method !== type) {
    res.status(405).send({ message: `Only ${type} requests allowed` });
    return false;
  }
  return true;
}

export function sendApiError(
  res: NextApiResponse,
  status: number,
  error: string,
  fieldErrors?: Record<string, string[]>,
) {
  return res
    .status(status)
    .send({ error, ...(fieldErrors ? { fieldErrors } : {}) });
}
