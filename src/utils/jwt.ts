import jwt from "jsonwebtoken";

export function generateJWT(payload: string) {
  if (!process.env.JWT_SECRET) throw new Error("Add JWT_SECRET to .env");
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export function verifyJWT(token: any) {
  if (!process.env.JWT_SECRET) throw new Error("Add JWT_SECRET to .env");
  return jwt.verify(token, process.env.JWT_SECRET);
}
