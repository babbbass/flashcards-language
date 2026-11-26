import { House, Inbox, Layers, LibraryBig, type LucideIcon, UserRound } from "lucide-react";
import { languageHref } from "@/lib/language-route";
import type { LanguageCode } from "@/lib/languages";

export type TabKey = "home" | "inbox" | "review" | "decks" | "profile";

type Tab = {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  /** Path inside the language, "" for the language home. */
  segment: string;
  /** Screens not built yet are shown but not clickable (no dead links). */
  built: boolean;
};

/** Bottom tab bar on mobile, sidebar on desktop: same config, single source of truth. */
export const TABS: readonly Tab[] = [
  { key: "home", label: "Home", icon: House, segment: "", built: true },
  { key: "inbox", label: "Inbox", icon: Inbox, segment: "inbox", built: false },
  { key: "review", label: "Review", icon: Layers, segment: "review", built: false },
  { key: "decks", label: "Decks", icon: LibraryBig, segment: "decks", built: false },
  { key: "profile", label: "Profile", icon: UserRound, segment: "profile", built: false },
];

export const tabHref = (code: LanguageCode, tab: Pick<Tab, "segment">) =>
  tab.segment ? `${languageHref(code)}/${tab.segment}` : languageHref(code);
