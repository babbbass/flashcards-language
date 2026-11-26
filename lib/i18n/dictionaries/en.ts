import { pluralize } from "@/lib/i18n/plural";

const plural = pluralize("en");

/**
 * UI strings of the English universe (`/en`). Source of the `Dictionary` type:
 * every other language must provide exactly the same keys (checked by the compiler).
 */
export const en = {
  nav: {
    label: "Main",
    comingSoon: "coming soon",
    items: (count: number) => plural(count, { one: "item", other: "items" }),
    tabs: {
      home: "Home",
      inbox: "Inbox",
      review: "Review",
      decks: "Decks",
      profile: "Profile",
    },
  },
  language: {
    change: (name: string) => `${name}: change language`,
  },
  home: {
    title: (name: string) => `${name} home`,
    streak: {
      days: (count: number) => plural(count, { one: "day", other: "days" }),
      label: "streak",
      today: "today",
      reviewed: "reviewed",
      upcoming: "upcoming",
      missed: "no review",
    },
    hero: {
      review: {
        eyebrow: "Review",
        title: (count: number) =>
          `${count} ${plural(count, { one: "card", other: "cards" })} to review today`,
        cta: "Start reviewing",
      },
      inbox: {
        eyebrow: "Inbox",
        title: (count: number) =>
          `${count} new ${plural(count, { one: "card", other: "cards" })} waiting`,
        cta: "Pick cards to learn",
      },
      soon: "soon",
      caughtUp: {
        title: "All caught up",
        text: "No review due and no new card. Come back tomorrow!",
      },
    },
    decks: {
      title: "Decks",
      empty: "No deck in this language yet.",
      cards: (count: number) => `${count} ${plural(count, { one: "card", other: "cards" })}`,
    },
  },
};

export type Dictionary = typeof en;
