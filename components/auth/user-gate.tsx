import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/current-user";

type Props = {
  children: ReactNode;
};

/**
 * Renders its children only for a signed-in user (otherwise `requireUser` redirects to
 * sign-in). Used by the `(app)` layout so no app UI is ever sent before the auth check.
 * Must sit inside <Suspense>: it reads the request (Cache Components).
 */
export const UserGate = async ({ children }: Props) => {
  await requireUser();
  return children;
};
