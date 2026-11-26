import type { ReactNode } from "react";
import { LanguageHeader } from "@/components/language-header";
import { TabBar } from "@/components/navigation/tab-bar";
import { RememberLanguage } from "@/components/remember-language";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Language } from "@/lib/languages";
import { getLanguageStats } from "@/lib/stats/language-stats";

type Props = {
  language: Language;
  children: ReactNode;
};

/**
 * Frame of every page inside a language. `data-lang` switches the subtree to the
 * language's flag palette (app/globals.css). Tab bar at the bottom on mobile, sidebar on desktop.
 * The tab bar is a client component: it gets ready-made strings, not the dictionary,
 * so the dictionaries never ship to the browser.
 */
export const LanguageShell = async ({ language, children }: Props) => {
  const { inbox, due } = await getLanguageStats(language.code);
  const t = getDictionary(language.code);
  const badge = (count: number) => ({ count, label: t.nav.items(count) });

  return (
    <div data-lang={language.code} className="flex flex-1 flex-col md:flex-row">
      <RememberLanguage code={language.code} />
      <TabBar
        language={language}
        badges={{ inbox: badge(inbox), review: badge(due) }}
        strings={{
          nav: t.nav.label,
          comingSoon: t.nav.comingSoon,
          switchLanguage: t.language.change(language.nativeName),
          tabs: t.nav.tabs,
        }}
      />
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
