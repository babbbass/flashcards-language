import Link from "next/link";
import { LanguageFlag } from "@/components/language-flag";
import { languageHref } from "@/lib/language-route";
import type { Language } from "@/lib/languages";

type Props = {
  language: Language;
};

/** Big pressable card on the language picker, painted with the language's flag palette. */
export const LanguageTile = ({ language }: Props) => (
  <Link
    href={languageHref(language.code)}
    data-lang={language.code}
    className="border-ink bg-primary text-primary-foreground shadow-brutal-lg focus-visible:ring-ring/50 flex items-center gap-5 rounded-2xl border-3 p-6 transition-[translate,box-shadow] outline-none focus-visible:ring-4 active:translate-x-1.5 active:translate-y-1.5 active:shadow-none motion-reduce:transition-none"
  >
    <LanguageFlag code={language.code} className="size-16 border-3" />
    <span className="flex flex-col">
      <span className="font-heading text-3xl">{language.name}</span>
      <span className="text-sm opacity-90">{language.nativeName}</span>
    </span>
  </Link>
);
