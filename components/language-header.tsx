import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LanguageFlag } from "@/components/language-flag";
import { LANGUAGE_PICKER_HREF } from "@/lib/language-route";
import type { Language } from "@/lib/languages";

type Props = {
  language: Language;
};

/** Top bar inside a language: the flag goes back to the picker, the avatar opens the account menu. */
export const LanguageHeader = ({ language }: Props) => (
  <header className="flex items-center justify-between p-4 sm:px-6">
    <Link
      href={LANGUAGE_PICKER_HREF}
      aria-label={`${language.name}: change language`}
      className="focus-visible:ring-ring/50 rounded-full transition-transform outline-none hover:scale-105 focus-visible:ring-4 motion-reduce:transition-none"
    >
      <LanguageFlag code={language.code} className="size-10" />
    </Link>
    <UserButton />
  </header>
);
