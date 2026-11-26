import type { ClerkProvider } from "@clerk/nextjs";
import type { ComponentProps } from "react";

type Appearance = NonNullable<ComponentProps<typeof ClerkProvider>["appearance"]>;

/**
 * Neo-brutalist skin for Clerk's prebuilt components (sign-in, sign-up, user button).
 * Colors are the app's CSS variables, so Clerk follows light/dark and the language palette.
 * Clerk styles live in the `clerk` CSS layer (declared in globals.css) so Tailwind utilities win.
 */
export const clerkAppearance = {
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "var(--primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorBackground: "var(--card)",
    colorForeground: "var(--foreground)",
    colorMutedForeground: "var(--muted-foreground)",
    colorInput: "var(--card)",
    colorInputForeground: "var(--foreground)",
    colorBorder: "var(--ink)",
    colorRing: "var(--ink)",
    colorDanger: "var(--destructive)",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-space-grotesk)",
  },
  elements: {
    cardBox: "border-3 border-ink shadow-brutal rounded-xl",
    headerTitle: "font-heading text-2xl",
    socialButtonsBlockButton:
      "border-2 border-ink shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    formFieldInput: "border-2 border-ink",
    formButtonPrimary:
      "border-2 border-ink shadow-brutal-sm font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
  },
} satisfies Appearance;
