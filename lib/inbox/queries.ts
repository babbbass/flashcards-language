import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/current-user";
import { inboxCards, skippedCards } from "@/lib/cards/visibility";
import { INBOX_PAGE_SIZE, type InboxView } from "@/lib/inbox/views";
import type { LanguageCode } from "@/lib/languages";
import { prisma } from "@/lib/prisma";

type Filters = {
  view: InboxView;
  /** Deck slug from the URL; unknown or missing = all decks. */
  deck: string | undefined;
  /** Requested page (1-based); past the last page = the last page. */
  page: number;
};

const VIEW_FILTERS: Record<
  InboxView,
  (userId: string, code: LanguageCode) => Prisma.CardWhereInput
> = { new: inboxCards, skipped: skippedCards };

/**
 * Everything the Inbox screen shows for one language: one page of the current list
 * (optionally one deck), the decks that have cards in that list, and the size of both lists.
 */
export const getInbox = async (code: LanguageCode, { view, deck, page }: Filters) => {
  const user = await requireUser();
  const inView = VIEW_FILTERS[view](user.id, code);

  const [decks, newCount, skippedCount] = await Promise.all([
    prisma.deck.findMany({
      where: { languageCode: code, cards: { some: inView } },
      select: {
        id: true,
        slug: true,
        name: true,
        _count: { select: { cards: { where: inView } } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.card.count({ where: inboxCards(user.id, code) }),
    prisma.card.count({ where: skippedCards(user.id, code) }),
  ]);

  const activeDeck = decks.find(({ slug }) => slug === deck);
  const counts = { new: newCount, skipped: skippedCount };
  const total = activeDeck ? activeDeck._count.cards : counts[view];
  const pageCount = Math.max(1, Math.ceil(total / INBOX_PAGE_SIZE));
  // Sorting the last cards of the last page must not leave the user on an empty page
  const currentPage = Math.min(page, pageCount);

  const cards = await prisma.card.findMany({
    where: { ...inView, ...(activeDeck && { deckId: activeDeck.id }) },
    select: {
      id: true,
      term: true,
      translation: true,
      phonetic: true,
      deck: { select: { name: true } },
    },
    // Deck by deck, in the order the cards were added (= the order of the deck file).
    // Cards imported in the same millisecond tie on createdAt: the id keeps pages stable.
    orderBy: [{ deck: { name: "asc" } }, { createdAt: "asc" }, { id: "asc" }],
    skip: (currentPage - 1) * INBOX_PAGE_SIZE,
    take: INBOX_PAGE_SIZE,
  });

  return {
    cards,
    decks: decks.map(({ slug, name, _count }) => ({ slug, name, count: _count.cards })),
    activeDeck: activeDeck?.slug,
    counts,
    pagination: { page: currentPage, pageCount },
    nativeLanguage: user.nativeLanguage,
  };
};

export type Inbox = Awaited<ReturnType<typeof getInbox>>;
export type InboxCard = Inbox["cards"][number];
