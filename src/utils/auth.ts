import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: number;
}

export function decodeAuthHeader(authHeader: string): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "");
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
}
