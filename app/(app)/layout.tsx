import { Suspense } from "react";
import { UserGate } from "@/components/auth/user-gate";

type Props = LayoutProps<"/">;

/**
 * Every page of the app lives in this `(app)` route group and is signed-in only.
 * The prerendered shell is just the fallback: page content streams after the auth check.
 */
const AppLayout = ({ children }: Props) => (
  <Suspense fallback={<div aria-busy="true" className="flex-1" />}>
    <UserGate>{children}</UserGate>
  </Suspense>
);

export default AppLayout;
