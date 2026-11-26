"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitchLink } from "@/components/language-switch-link";
import type { Language } from "@/lib/languages";
import { TABS, type TabKey, tabHref } from "@/lib/navigation/tabs";
import { cn } from "@/lib/utils";

type Props = {
  language: Language;
  /** Pill on a tab (e.g. new cards in the inbox), with its screen-reader wording. */
  badges: Partial<Record<TabKey, { count: number; label: string }>>;
  /** Ready-made UI strings (from the server): dictionaries never ship to the browser. */
  strings: {
    nav: string;
    comingSoon: string;
    switchLanguage: string;
    tabs: Record<TabKey, string>;
  };
};

const itemClass =
  "relative flex flex-col items-center gap-1 rounded-xl border-2 border-transparent px-1 py-2 text-xs font-bold md:flex-row md:gap-3 md:px-3 md:text-sm";

/**
 * Main navigation of a language. Mobile: fixed bar at the bottom (thumb reach).
 * Desktop (md+): sticky sidebar on the left, topped by the language flag. Same items either way.
 */
export const TabBar = ({ language, badges, strings }: Props) => {
  const pathname = usePathname();
  const { code } = language;

  return (
    <nav
      aria-label={strings.nav}
      className="border-ink bg-card fixed inset-x-0 bottom-0 z-10 border-t-3 pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:h-dvh md:w-56 md:shrink-0 md:border-t-0 md:border-r-3 md:pb-0"
    >
      <LanguageSwitchLink
        language={language}
        label={strings.switchLanguage}
        withName
        className="hidden md:mx-4 md:mt-6 md:flex"
      />
      <ul className="grid grid-cols-5 gap-1 p-2 md:flex md:flex-col md:gap-2 md:p-4">
        {TABS.map((tab) => {
          const href = tabHref(code, tab);
          const Icon = tab.icon;
          const badge = badges[tab.key];
          const content = (
            <>
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <span>{strings.tabs[tab.key]}</span>
              {badge && badge.count > 0 && (
                <span className="border-ink bg-accent text-accent-foreground absolute top-0.5 right-1 min-w-5 rounded-full border-2 px-1 text-center text-xs leading-4 md:static md:ml-auto">
                  {badge.count}
                  <span className="sr-only"> {badge.label}</span>
                </span>
              )}
            </>
          );

          if (!tab.built) {
            return (
              <li key={tab.key}>
                <span aria-disabled="true" className={cn(itemClass, "text-muted-foreground")}>
                  {content}
                  <span className="sr-only"> ({strings.comingSoon})</span>
                </span>
              </li>
            );
          }

          const isActive = pathname === href;
          return (
            <li key={tab.key}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  itemClass,
                  "focus-visible:ring-ring/50 outline-none focus-visible:ring-4",
                  isActive
                    ? "border-ink bg-primary text-primary-foreground shadow-brutal-sm"
                    : "hover:bg-muted",
                )}
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
