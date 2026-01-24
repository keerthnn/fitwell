import { NextApiRequest, NextApiResponse } from "next";

export function checkIfPostOrSetError(req: NextApiRequest, res: NextApiResponse) {
  return checkIfTypeOrSetError(req, res, "POST");
}
export function checkIfGetOrSetError(req: NextApiRequest, res: NextApiResponse) {
  return checkIfTypeOrSetError(req, res, "GET");
}
export function checkIfDeleteOrSetError(req: NextApiRequest, res: NextApiResponse) {
  return checkIfTypeOrSetError(req, res, "DELETE");
}

function checkIfTypeOrSetError(
  req: NextApiRequest,
  res: NextApiResponse,
  type: "POST" | "DELETE" | "GET"
) {
  if (req.method !== type) {
    res.status(405).send({ message: `Only ${type} requests allowed` });
    return false;
  }
  return true;
}
