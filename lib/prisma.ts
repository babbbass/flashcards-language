import "server-only";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Single Prisma client for the whole server.
 *
 * The libSQL adapter speaks both to a local SQLite file (`file:./prisma/dev.db`)
 * and to Turso in production (`libsql://…` + auth token): same code, only env changes.
 */
const createPrismaClient = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN, // only needed for Turso
  });

  return new PrismaClient({ adapter });
};

// Reuse the client across hot reloads in dev, otherwise every edit opens a new connection.
// Typed through a global declaration instead of a type assertion.
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
