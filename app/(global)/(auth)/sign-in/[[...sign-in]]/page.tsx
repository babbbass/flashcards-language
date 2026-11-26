import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

// SignIn reads the URL (usePathname): with Cache Components it must render inside Suspense.
const SignInPage = () => (
  <Suspense>
    <SignIn />
  </Suspense>
);

export default SignInPage;
