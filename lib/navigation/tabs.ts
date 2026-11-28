import { House, Inbox, Layers, LibraryBig, type LucideIcon, UserRound } from "lucide-react";
import { languageHref } from "@/lib/language-route";
import type { LanguageCode } from "@/lib/languages";

export type TabKey = "home" | "inbox" | "review" | "decks" | "profile";

type Tab = {
  key: TabKey;
  icon: LucideIcon;
  /** Path inside the language, "" for the language home. */
  segment: string;
  /** Screens not built yet are shown but not clickable (no dead links). */
  built: boolean;
};

/**
 * Bottom tab bar on mobile, sidebar on desktop: same config, single source of truth.
 * Labels live in the dictionaries (`nav.tabs[key]`), in the language being studied.
 */
export const TABS: readonly Tab[] = [
  { key: "home", icon: House, segment: "", built: true },
  { key: "inbox", icon: Inbox, segment: "inbox", built: true },
  { key: "review", icon: Layers, segment: "review", built: true },
  { key: "decks", icon: LibraryBig, segment: "decks", built: false },
  { key: "profile", icon: UserRound, segment: "profile", built: false },
];

export const tabHref = (code: LanguageCode, tab: Pick<Tab, "segment">) =>
  tab.segment ? `${languageHref(code)}/${tab.segment}` : languageHref(code);
