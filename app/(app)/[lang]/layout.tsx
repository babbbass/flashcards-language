import { LanguageHeader } from "@/components/language-header";
import { TabBar } from "@/components/navigation/tab-bar";
import { RememberLanguage } from "@/components/remember-language";
import { languageFromParam, languageStaticParams } from "@/lib/language-route";
import { getLanguageStats } from "@/lib/stats/language-stats";

export const generateStaticParams = languageStaticParams;

type Props = LayoutProps<"/[lang]">;

/**
 * Everything under `/en`, `/es`… : `data-lang` switches the whole subtree to the
 * language's flag palette (app/globals.css), so once inside a language you stay in its theme.
 * Tab bar at the bottom on mobile, sidebar on desktop.
 */
const LanguageLayout = async ({ children, params }: Props) => {
  const language = languageFromParam((await params).lang);
  const { inbox, due } = await getLanguageStats(language.code);

  return (
    <div data-lang={language.code} className="flex flex-1 flex-col md:flex-row">
      <RememberLanguage code={language.code} />
      <TabBar language={language} badges={{ inbox, review: due }} />
      {/*
        Mobile: bottom padding keeps content clear of the fixed tab bar.
        Desktop: top padding (56px + the page's own 24px) puts the first line of every page
        level with the first tab (Home), below the flag (24px margin + 40px + 16px list padding).
      */}
      <div className="relative flex flex-1 flex-col pb-28 md:order-last md:pt-14 md:pb-0">
        <LanguageHeader language={language} />
        {children}
      </div>
    </div>
  );
};

export default LanguageLayout;
