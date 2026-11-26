import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16 Proxy (formerly Middleware): only attaches the Clerk session to requests.
 *
 * Access control is NOT done here (path matching can drift from real routes). Every
 * server code path that reads user data calls `requireUser()` (lib/auth/current-user.ts),
 * which redirects to sign-in when there is no session. This is what both Clerk Core 3
 * and the Next.js 16 docs recommend.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
