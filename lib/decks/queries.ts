import "server-only";
import { requireUser } from "@/lib/auth/current-user";
import type { LanguageCode } from "@/lib/languages";
import { prisma } from "@/lib/prisma";

/** Decks of a language visible to the user (catalog + their personal deck), with card counts. */
export const getDecks = async (code: LanguageCode) => {
  const user = await requireUser();
  return prisma.deck.findMany({
    where: { languageCode: code, OR: [{ ownerId: null }, { ownerId: user.id }] },
    select: { id: true, name: true, description: true, _count: { select: { cards: true } } },
    orderBy: { name: "asc" },
  });
};
