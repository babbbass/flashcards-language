/** Shared frame for the sign-in and sign-up pages: centred card on the paper background. */
const AuthLayout = ({ children }: LayoutProps<"/">) => (
  <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
    {/* Not a heading: Clerk's card already renders the page <h1> */}
    <p className="font-heading text-4xl">Flashcards</p>
    {children}
  </main>
);

export default AuthLayout;
