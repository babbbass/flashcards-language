import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { clerkAppearance } from "@/lib/auth/appearance";
import { SIGN_IN_URL, SIGN_UP_URL } from "@/lib/auth/routes";

// Body & UI text
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// Headings & the word on the card (single weight font)
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Learn languages with spaced-repetition flashcards",
};

type Props = LayoutProps<"/">;

const RootLayout = ({ children }: Props) => (
  <html
    lang="en"
    className={`${spaceGrotesk.variable} ${archivoBlack.variable} h-full antialiased`}
  >
    <body className="flex min-h-full flex-col">
      <ClerkProvider appearance={clerkAppearance} signInUrl={SIGN_IN_URL} signUpUrl={SIGN_UP_URL}>
        {children}
      </ClerkProvider>
    </body>
  </html>
);

export default RootLayout;
