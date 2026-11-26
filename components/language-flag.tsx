import type { ReactNode } from "react";
import type { LanguageCode } from "@/lib/languages";
import { cn } from "@/lib/utils";

/*
 * Flags drawn on a 30×30 square, then cropped to a circle by the wrapper.
 * Colors come from the `--flag-*` theme tokens (app/globals.css).
 * Typed as a Record over LanguageCode: adding a language without its flag fails the typecheck.
 */
const FLAGS = {
  // Union Jack, centre crop of the 60×30 flag
  en: (
    <svg viewBox="15 0 30 30" aria-hidden="true">
      <rect x="0" y="0" width="60" height="30" className="fill-flag-uk-blue" />
      <path d="M0,0 L60,30 M60,0 L0,30" className="stroke-white" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" className="stroke-flag-uk-red" strokeWidth="2" />
      <path d="M30,0 v30 M0,15 h60" className="stroke-white" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" className="stroke-flag-uk-red" strokeWidth="6" />
    </svg>
  ),
  // Spain: red / yellow (double height) / red
  es: (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <rect x="0" y="0" width="30" height="30" className="fill-flag-es-red" />
      <rect x="0" y="7.5" width="30" height="15" className="fill-flag-es-yellow" />
    </svg>
  ),
} satisfies Record<LanguageCode, ReactNode>;

type LanguageFlagProps = {
  code: LanguageCode;
  className?: string;
};

/** Circular flag icon. Decorative: always pair it with the language name. */
export const LanguageFlag = ({ code, className }: LanguageFlagProps) => (
  <span
    aria-hidden="true"
    className={cn(
      "border-ink inline-flex size-5 shrink-0 overflow-hidden rounded-full border-2 [&>svg]:size-full",
      className,
    )}
  >
    {FLAGS[code]}
  </span>
);
