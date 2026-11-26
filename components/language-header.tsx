import { UserButton } from "@clerk/nextjs";
import { LanguageSwitchLink } from "@/components/language-switch-link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Language } from "@/lib/languages";

type Props = {
  language: Language;
};

/**
 * Top bar inside a language. Mobile: the flag (back to the picker) + the account menu.
 * Desktop: the flag lives in the sidebar, only the account menu stays, floating top-right so
 * the page content starts at the very top, level with the sidebar.
 */
export const LanguageHeader = ({ language }: Props) => (
  <header className="flex items-center justify-between p-4 sm:px-6 md:absolute md:top-6 md:right-6 md:p-0">
    <LanguageSwitchLink
      language={language}
      label={getDictionary(language.code).language.change(language.nativeName)}
      className="md:hidden"
    />
    <div className="ml-auto">
      <UserButton />
    </div>
  </header>
);
