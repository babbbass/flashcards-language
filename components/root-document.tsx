import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
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

export const siteMetadata: Metadata = {
  title: "Flashcards",
  description: "Learn languages with spaced-repetition flashcards",
};

type Props = {
  /** Language of the whole page (WCAG 3.1.1): "en" outside a language, the studied one inside. */
  lang: string;
  children: ReactNode;
};

/**
 * `<html>` + `<body>` shared by every root layout. The app has several root layouts
 * (`app/(global)` and `app/[lang]`) precisely so each can declare its own page language.
 */
export const RootDocument = ({ lang, children }: Props) => (
  <html
    lang={lang}
    className={`${spaceGrotesk.variable} ${archivoBlack.variable} h-full antialiased`}
  >
    <body className="flex min-h-full flex-col">
      <ClerkProvider appearance={clerkAppearance} signInUrl={SIGN_IN_URL} signUpUrl={SIGN_UP_URL}>
        {children}
      </ClerkProvider>
    </body>
  </html>
);
