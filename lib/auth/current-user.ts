import "server-only";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Returns the signed-in user's row, creating it on first visit.
 * Redirects to the sign-in page when there is no session: call it in every page,
 * component or Server Function that reads user data (resource-based auth check).
 *
 * Clerk owns identity; our `User` table only keeps app data (timezone, last language…)
 * keyed by the Clerk user id. Syncing lazily here avoids a Clerk webhook, which would
 * need a public URL in development. `cache` dedupes the call within one request.
 */
export const requireUser = cache(async () => {
  const { userId } = await auth.protect();

  return prisma.user.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  });
});
