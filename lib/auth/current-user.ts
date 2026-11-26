import "server-only";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const isUniqueConstraintError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

/** Creates the row on first visit. Two parallel first requests may race: the loser re-reads. */
const createUser = async (id: string) => {
  try {
    return await prisma.user.create({ data: { id } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return prisma.user.findUniqueOrThrow({ where: { id } });
    }
    throw error;
  }
};

/**
 * Returns the signed-in user's row, creating it on first visit.
 * Redirects to the sign-in page when there is no session (resource-based auth check).
 *
 * Clerk owns identity; our `User` table only keeps app data (timezone, last language…)
 * keyed by the Clerk user id. Syncing lazily here avoids a Clerk webhook, which would
 * need a public URL in development. A read on every call, a write only the first time
 * (a write per page view would be a network round trip on Turso).
 * `cache` dedupes the call within one request.
 */
export const requireUser = cache(async () => {
  const { userId } = await auth.protect();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ?? createUser(userId);
});
