import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { requireUser } from "@/lib/auth/current-user";
import { toLocalDay, weekOf } from "@/lib/dates";
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
  const inLanguage = { deck: { languageCode: code } };

  const [inbox, due, reviews] = await Promise.all([
    // Inbox: cards visible to the user (catalog or their own) they have not decided on yet
    prisma.card.count({
      where: {
        ...inLanguage,
        OR: [{ ownerId: null }, { ownerId: user.id }],
        userCards: { none: { userId: user.id } },
      },
    }),
    // Due: discovered cards (both directions) whose next review date has come
    prisma.reviewState.count({
      where: {
        due: { lte: now },
        userCard: {
          userId: user.id,
          status: "LEARNING",
          discoveredAt: { not: null },
          card: inLanguage,
        },
      },
    }),
    prisma.reviewLog.findMany({
      where: {
        userId: user.id,
        languageCode: code,
        reviewedAt: { gte: new Date(now.getTime() - STREAK_LOOKBACK_DAYS * 24 * 60 * 60 * 1000) },
      },
      select: { reviewedAt: true },
    }),
  ]);

  const today = toLocalDay(now, user.timezone);
  const reviewedDays = new Set(
    reviews.map(({ reviewedAt }) => toLocalDay(reviewedAt, user.timezone)),
  );

  return {
    inbox,
    due,
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
