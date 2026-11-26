import Link from "next/link";
import { LanguageFlag } from "@/components/language-flag";
import { LANGUAGE_PICKER_HREF } from "@/lib/language-route";
import type { Language } from "@/lib/languages";
import { cn } from "@/lib/utils";

type Props = {
  language: Language;
  /** Accessible name, in the UI language ("English: change language"). */
  label: string;
  /** Show the language name next to the flag (sidebar); flag only otherwise (mobile header). */
  withName?: boolean;
  className?: string;
};

/** The current language's flag (and native name): goes back to the language picker. */
export const LanguageSwitchLink = ({ language, label, withName = false, className }: Props) => (
  <Link
    href={LANGUAGE_PICKER_HREF}
    aria-label={label}
    className={cn(
      "focus-visible:ring-ring/50 group flex w-fit items-center gap-3 rounded-full outline-none focus-visible:ring-4",
      className,
    )}
  >
    <LanguageFlag
      code={language.code}
      className="size-10 transition-transform group-hover:scale-105 motion-reduce:transition-none"
    />
    {withName && <span className="font-heading text-lg">{language.nativeName}</span>}
  </Link>
);
