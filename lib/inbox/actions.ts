"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/current-user";
import { inboxCards, visibleCards } from "@/lib/cards/visibility";
import { INBOX_MOVES, INBOX_PAGE_SIZE } from "@/lib/inbox/views";
import { isLanguageCode, type LanguageCode } from "@/lib/languages";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  code: z.custom<LanguageCode>((value) => typeof value === "string" && isLanguageCode(value)),
  cardIds: z.array(z.string().min(1)).min(1).max(INBOX_PAGE_SIZE),
  move: z.discriminatedUnion("view", [
    z.object({ view: z.literal("new"), decision: z.enum(INBOX_MOVES.new) }),
    z.object({ view: z.literal("skipped"), decision: z.enum(INBOX_MOVES.skipped) }),
  ]),
});

export type SortInboxInput = z.input<typeof inputSchema>;
type Input = z.output<typeof inputSchema>;

/**
 * New cards: one `UserCard` row records the decision. LEARNING starts with
 * `discoveredAt` null: the card is shown in full once (discovery) before its first review.
 * Only cards the user can see and has not decided on yet are written, whatever ids were sent.
 */
const sortNewCards = async (userId: string, { code, cardIds, move }: Input) => {
  const cards = await prisma.card.findMany({
    where: { id: { in: cardIds }, ...inboxCards(userId, code) },
    select: { id: true },
  });
  const status = move.decision === "learn" ? "LEARNING" : "SKIPPED";
  const { count } = await prisma.userCard.createMany({
    data: cards.map(({ id }) => ({ userId, cardId: id, status })),
  });
  return count;
};

/** Skipped cards: learn them after all, or delete the decision to put them back in the Inbox. */
const sortSkippedCards = async (userId: string, { code, cardIds, move }: Input) => {
  const where = {
    userId,
    status: "SKIPPED",
    cardId: { in: cardIds },
    card: visibleCards(userId, code),
  } satisfies Prisma.UserCardWhereInput;
  const { count } =
    move.decision === "learn"
      ? await prisma.userCard.updateMany({ where, data: { status: "LEARNING" } })
      : await prisma.userCard.deleteMany({ where });
  return count;
};

type SortResult = { ok: true; count: number } | { ok: false };

/**
 * Inbox decisions on a selection of cards (at most one page). Returns how many cards actually
 * moved, then refreshes the page so the lists and badges follow. An invalid request (too many
 * cards, unknown move) is refused with `ok: false`, never reported as "0 cards moved".
 */
export const sortInboxCards = async (input: SortInboxInput): Promise<SortResult> => {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }

  const user = await requireUser();
  const count =
    parsed.data.move.view === "new"
      ? await sortNewCards(user.id, parsed.data)
      : await sortSkippedCards(user.id, parsed.data);

  refresh();
  return { ok: true, count };
};
