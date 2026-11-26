import { type ReactNode, Suspense } from "react";
import { UserGate } from "@/components/auth/user-gate";

type Props = {
  children: ReactNode;
};

/**
 * Signed-in only area: the prerendered shell is just the fallback, the content streams
 * after the auth check (`UserGate` redirects to sign-in otherwise).
 */
export const Protected = ({ children }: Props) => (
  <Suspense fallback={<div aria-busy="true" className="flex-1" />}>
    <UserGate>{children}</UserGate>
  </Suspense>
);
