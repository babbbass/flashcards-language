import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

// SignUp reads the URL (usePathname): with Cache Components it must render inside Suspense.
const SignUpPage = () => (
  <Suspense>
    <SignUp />
  </Suspense>
);

export default SignUpPage;
