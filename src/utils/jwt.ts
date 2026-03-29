import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export interface UserPayload {
  id: number;
  role: string;
}

export function generateToken(id: number, role: string): string {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}
