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
  inbox: {
    title: "Inbox",
    views: {
      label: "Lists",
      new: "New",
      skipped: "Skipped",
    },
    intro: {
      new: "Tick the cards you want to learn now. The others stay here for another day.",
      skipped:
        "Skipped cards never come back on their own. Learn them after all, or put them back.",
    },
    decks: {
      label: "Filter by deck",
      all: "All decks",
    },
    pagination: {
      label: "Pages",
      previous: "Previous",
      next: "Next",
      page: (page: number, pageCount: number) => `Page ${page} of ${pageCount}`,
    },
    empty: {
      new: "No new card: everything has been sorted.",
      skipped: "No skipped card.",
    },
    list: {
      label: "Cards",
      selectAll: "Select all",
      selected: "selected",
      decisions: {
        learn: "Learn the list",
        skip: "Skip",
        restore: "Back to inbox",
      },
      // Shown after a decision, after the number of cards (forms picked on the client)
      done: {
        learn: {
          one: "card added to your learning list",
          other: "cards added to your learning list",
        },
        skip: { one: "card skipped", other: "cards skipped" },
        restore: { one: "card back in the inbox", other: "cards back in the inbox" },
      },
      error: "Something went wrong. Please try again.",
    },
  },
  review: {
    title: "Review",
    empty: {
      title: "Nothing to review",
      text: "No card is due right now. Pick new cards in the Inbox, or come back later.",
      inbox: "Go to the Inbox",
    },
    // Plain data (no functions): sent to the review session in the browser
    session: {
      progress: "Progress",
      discover: { eyebrow: "New card", cta: "Got it" },
      reveal: "Show answer",
      rate: "How well did you remember it?",
      grades: { AGAIN: "Again", HARD: "Hard", GOOD: "Good", EASY: "Easy" },
      example: "Example",
      note: "Note",
      spaceKey: "Space",
      saveError: "An answer could not be saved. Reload the page to continue.",
      done: {
        title: "Session complete",
        studied: { one: "card studied", other: "cards studied" },
        more: "Keep going",
        home: "Back home",
      },
    },
  },
};

export type Dictionary = typeof en;
