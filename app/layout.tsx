import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { clerkAppearance } from "@/lib/auth/appearance";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ClerkProvider appearance={clerkAppearance} signInUrl="/sign-in" signUpUrl="/sign-up">
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
