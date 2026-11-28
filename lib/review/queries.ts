import "server-only";
import { connection } from "next/server";
import { requireUser } from "@/lib/auth/current-user";
import { cardsInReview, cardsToDiscover } from "@/lib/cards/visibility";
import type { LanguageCode } from "@/lib/languages";
import { prisma } from "@/lib/prisma";
import type { Schedule } from "@/lib/review/scheduler";
import { SESSION_SIZE } from "@/lib/review/session";

const cardFields = {
  id: true,
  term: true,
  translation: true,
  phonetic: true,
  example: true,
  exampleTranslation: true,
  note: true,
} as const;

/**
 * The next review session of a language: due reviews first (most overdue first), then the
 * discoveries in the order the cards were picked in the Inbox, at most `SESSION_SIZE` in all.
 * Plain data (dates included) handed to the client session, which runs without round trips.
 */
export const getReviewSession = async (code: LanguageCode) => {
  const user = await requireUser();
  // "Now" belongs to the request, not to a prerender (Cache Components)
  await connection();
  const now = new Date();

  const [reviews, discoveries] = await Promise.all([
    prisma.reviewState.findMany({
      where: { due: { lte: now }, userCard: cardsInReview(user.id, code) },
      orderBy: [{ due: "asc" }, { id: "asc" }],
      take: SESSION_SIZE,
      select: {
        due: true,
        stability: true,
        difficulty: true,
        scheduledDays: true,
        learningSteps: true,
        reps: true,
        lapses: true,
        state: true,
        lastReview: true,
        userCard: { select: { id: true, card: { select: cardFields } } },
      },
    }),
    prisma.userCard.findMany({
      where: cardsToDiscover(user.id, code),
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: SESSION_SIZE,
      select: { id: true, card: { select: cardFields } },
    }),
  ]);

  const items: SessionItem[] = [
    ...reviews.map(({ userCard, ...schedule }) => ({
      kind: "review" as const,
      userCardId: userCard.id,
      card: userCard.card,
      schedule,
    })),
    ...discoveries.map(({ id, card }) => ({ kind: "discover" as const, userCardId: id, card })),
  ].slice(0, SESSION_SIZE);

  return { items, direction: user.reviewDirection, nativeLanguage: user.nativeLanguage };
};

export type SessionCard = {
  id: string;
  term: string;
  translation: string;
  phonetic: string | null;
  example: string | null;
  exampleTranslation: string | null;
  note: string | null;
};

/** A card to show once in full, or to answer (with its current schedule). */
export type SessionItem =
  | { kind: "discover"; userCardId: string; card: SessionCard }
  | { kind: "review"; userCardId: string; card: SessionCard; schedule: Schedule };

export type ReviewSession = Awaited<ReturnType<typeof getReviewSession>>;
