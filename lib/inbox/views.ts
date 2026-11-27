import type { LanguageCode } from "@/lib/languages";
import { tabHref } from "@/lib/navigation/tabs";

/**
 * The two lists of the Inbox screen, and what can be done with the cards of each.
 * Shared by the page (URL parsing), the client list (buttons) and the server action (validation).
 *
 * - new: cards not decided on yet → learn them, or skip them for good
 * - skipped: cards hidden earlier → learn them after all, or put them back in the Inbox
 */
export const INBOX_MOVES = {
  new: ["learn", "skip"],
  skipped: ["learn", "restore"],
} as const;

export type InboxView = keyof typeof INBOX_MOVES;
export type InboxDecision = (typeof INBOX_MOVES)[InboxView][number];

/** A decision together with the list it applies to: only valid pairs can be written. */
export type InboxMove = {
  [View in InboxView]: { view: View; decision: (typeof INBOX_MOVES)[View][number] };
}[InboxView];

/** The moves offered on a list, main one first. */
export const movesOf = (view: InboxView): InboxMove[] =>
  view === "new"
    ? INBOX_MOVES.new.map((decision) => ({ view, decision }))
    : INBOX_MOVES.skipped.map((decision) => ({ view, decision }));

export const INBOX_VIEWS = ["new", "skipped"] as const satisfies readonly InboxView[];

/**
 * At most this many cards are sorted at once, and an Inbox page shows exactly that many:
 * "Select all" ticks one page, so a selection never exceeds what the server accepts.
 */
export const INBOX_PAGE_SIZE = 50;

/** Query string of the Inbox URL: `?view=skipped&deck=greetings&page=2`. */
export const INBOX_PARAMS = { view: "view", deck: "deck", page: "page" } as const;

export const isInboxView = (value: unknown): value is InboxView =>
  INBOX_VIEWS.some((view) => view === value);

/** Page number from the URL: anything but a whole number ≥ 1 means the first page. */
export const parsePage = (value: string | undefined) => {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
};

/**
 * URL of an Inbox list; the defaults (new cards, all decks, first page) stay out of the
 * query string. Changing the list or the deck leaves out `page`: a new list starts at page 1.
 */
export const inboxHref = (
  code: LanguageCode,
  { view, deck, page = 1 }: { view: InboxView; deck?: string | undefined; page?: number },
) => {
  const params = new URLSearchParams();
  if (view !== "new") {
    params.set(INBOX_PARAMS.view, view);
  }
  if (deck) {
    params.set(INBOX_PARAMS.deck, deck);
  }
  if (page > 1) {
    params.set(INBOX_PARAMS.page, String(page));
  }
  const query = params.toString();
  const base = tabHref(code, { segment: "inbox" });
  return query ? `${base}?${query}` : base;
};
