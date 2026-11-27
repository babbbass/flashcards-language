import type { Prisma } from "@/generated/prisma/client";
import type { LanguageCode } from "@/lib/languages";

/**
 * Cards of a language the user may see: the shared catalog plus their own private cards.
 * Single source of the rule for the counters, the Inbox list and the Inbox actions.
 */
export const visibleCards = (userId: string, code: LanguageCode) =>
  ({
    deck: { languageCode: code },
    OR: [{ ownerId: null }, { ownerId: userId }],
  }) satisfies Prisma.CardWhereInput;

/** Visible cards still in the Inbox: the user has made no decision about them yet. */
export const inboxCards = (userId: string, code: LanguageCode) =>
  ({
    ...visibleCards(userId, code),
    userCards: { none: { userId } },
  }) satisfies Prisma.CardWhereInput;

/** Visible cards the user skipped (hidden from the Inbox, recoverable). */
export const skippedCards = (userId: string, code: LanguageCode) =>
  ({
    ...visibleCards(userId, code),
    userCards: { some: { userId, status: "SKIPPED" } },
  }) satisfies Prisma.CardWhereInput;
