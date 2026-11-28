"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/current-user";
import { cardsInReview, cardsToDiscover } from "@/lib/cards/visibility";
import { toLocalDay } from "@/lib/dates";
import { languageCodeSchema } from "@/lib/language-schema";
import { prisma } from "@/lib/prisma";
import { GRADES, loadScheduler } from "@/lib/review/scheduler";

type ActionResult = { ok: boolean };

const discoverSchema = z.object({
  code: languageCodeSchema,
  userCardId: z.string().min(1),
});

/**
 * The card was shown in full once: discovery done, its FSRS schedule starts now (due at once,
 * so it comes back for a first answer). The update only matches a discovery still to do,
 * so a second tab or a double click creates nothing twice.
 */
export const discoverCard = async (
  input: z.input<typeof discoverSchema>,
): Promise<ActionResult> => {
  const parsed = discoverSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }
  const { code, userCardId } = parsed.data;
  const user = await requireUser();
  const scheduler = await loadScheduler();
  const now = new Date();

  const ok = await prisma.$transaction(async (tx) => {
    const { count } = await tx.userCard.updateMany({
      where: { id: userCardId, ...cardsToDiscover(user.id, code) },
      data: { discoveredAt: now },
    });
    if (count === 0) {
      return false;
    }
    await tx.reviewState.create({ data: { userCardId, ...scheduler.newSchedule(now) } });
    return true;
  });

  refresh();
  return { ok };
};

const answerSchema = z.object({
  code: languageCodeSchema,
  userCardId: z.string().min(1),
  grade: z.enum(GRADES),
  /** `reps` of the schedule the user answered: a stale or repeated answer matches nothing. */
  reps: z.number().int().min(0),
});

/**
 * One answer: the server recomputes the schedule from its own copy (the browser's preview is
 * never trusted), then in one transaction saves it, logs the answer and counts it in the day's
 * activity (streak). The browser sends the `reps` it answered: an answer given twice (two tabs,
 * a replayed request) finds the card already moved on and changes nothing.
 */
export const answerCard = async (input: z.input<typeof answerSchema>): Promise<ActionResult> => {
  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }
  const { code, userCardId, grade, reps } = parsed.data;
  const user = await requireUser();
  const scheduler = await loadScheduler();
  const now = new Date();

  const ok = await prisma.$transaction(async (tx) => {
    const current = await tx.reviewState.findFirst({
      where: { userCardId, reps, userCard: cardsInReview(user.id, code) },
    });
    if (!current) {
      return false;
    }
    const { schedule, before } = scheduler.review(userCardId, current, grade, now);

    const { count } = await tx.reviewState.updateMany({
      where: { id: current.id, reps: current.reps },
      data: schedule,
    });
    if (count === 0) {
      return false;
    }
    await tx.reviewLog.create({
      data: {
        reviewStateId: current.id,
        userId: user.id,
        languageCode: code,
        rating: grade,
        direction: user.reviewDirection,
        reviewedAt: now,
        ...before,
      },
    });
    const day = toLocalDay(now, user.timezone);
    await tx.dailyActivity.upsert({
      where: { userId_languageCode_day: { userId: user.id, languageCode: code, day } },
      create: { userId: user.id, languageCode: code, day, reviews: 1 },
      update: { reviews: { increment: 1 } },
    });
    return true;
  });

  refresh();
  return { ok };
};
