/** Shared frame for the sign-in and sign-up pages: centred card on the paper background. */
const AuthLayout = ({ children }: LayoutProps<"/">) => (
  <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
    <h1 className="text-4xl">Flashcards</h1>
    {children}
  </main>
);

export default AuthLayout;
