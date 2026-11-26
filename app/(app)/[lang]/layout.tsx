import { LanguageHeader } from "@/components/language-header";
import { RememberLanguage } from "@/components/remember-language";
import { languageFromParam, languageStaticParams } from "@/lib/language-route";

export const generateStaticParams = languageStaticParams;

type Props = LayoutProps<"/[lang]">;

/**
 * Everything under `/en`, `/es`… : `data-lang` switches the whole subtree to the
 * language's flag palette (app/globals.css), so once inside a language you stay in its theme.
 */
const LanguageLayout = async ({ children, params }: Props) => {
  const language = languageFromParam((await params).lang);

  return (
    <div data-lang={language.code} className="flex flex-1 flex-col">
      <RememberLanguage code={language.code} />
      <LanguageHeader language={language} />
      {children}
    </div>
  );
};

export default LanguageLayout;
