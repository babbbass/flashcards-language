import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { requireUser } from "@/lib/auth/current-user";
import { cardsInReview, cardsToDiscover, inboxCards } from "@/lib/cards/visibility";
import { addDays, toLocalDay, weekOf } from "@/lib/dates";
import type { LanguageCode } from "@/lib/languages";
import { prisma } from "@/lib/prisma";
import { computeStreak } from "@/lib/stats/streak";

/** How far back we look for the streak: longer streaks are capped at this many days. */
const STREAK_LOOKBACK_DAYS = 400;

/**
 * Counters for one language, shared by the tab bar badges and the home page.
 * `cache` runs the queries once per request even though several components ask.
 */
export const getLanguageStats = cache(async (code: LanguageCode) => {
  const user = await requireUser();
  // "Now" belongs to the request, not to a prerender (Cache Components)
  await connection();
  const now = new Date();
  const today = toLocalDay(now, user.timezone);

  const [inbox, discover, due, activeDays] = await Promise.all([
    // Inbox: cards visible to the user (catalog or their own) they have not decided on yet
    prisma.card.count({ where: inboxCards(user.id, code) }),
    // Picked in the Inbox, not shown in full yet
    prisma.userCard.count({ where: cardsToDiscover(user.id, code) }),
    // Discovered cards whose next review date has come (one review per card)
    prisma.reviewState.count({
      where: { due: { lte: now }, userCard: cardsInReview(user.id, code) },
    }),
    // One row per day with answers (written with each answer): a few hundred rows at most
    prisma.dailyActivity.findMany({
      where: {
        userId: user.id,
        languageCode: code,
        day: { gte: addDays(today, -STREAK_LOOKBACK_DAYS) },
      },
      select: { day: true },
    }),
  ]);

  const reviewedDays = new Set(activeDays.map(({ day }) => day));

  return {
    inbox,
    /** Waiting in the Review tab: discoveries plus due reviews. */
    toReview: discover + due,
    streak: computeStreak(reviewedDays, today),
    week: weekOf(today).map((day) => ({
      day,
      reviewed: reviewedDays.has(day),
      isToday: day === today,
      isFuture: day > today,
    })),
  };
});

export type LanguageStats = Awaited<ReturnType<typeof getLanguageStats>>;
