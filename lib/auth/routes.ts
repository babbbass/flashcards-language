/**
 * Auth page URLs, shared by the proxy (server-side redirects from `auth.protect()`)
 * and `<ClerkProvider>` (client components). Both must point to our own pages,
 * otherwise Clerk falls back to its hosted Account Portal.
 */
export const SIGN_IN_URL = "/sign-in";
export const SIGN_UP_URL = "/sign-up";
