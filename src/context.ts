import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { decodeAuthHeader } from "./utils/auth";

export const prismaClient = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: number;
}

export const context = ({ req }: { req: Request }): Context => {
  const authHeader = req.headers?.authorization;
  const token = authHeader ? decodeAuthHeader(authHeader) : null;
  return {
    prisma: prismaClient,
    userId: token?.userId,
  };
};
