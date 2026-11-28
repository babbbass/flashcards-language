import { use, useRef, useState } from "react";
import type { LanguageCode } from "@/lib/languages";
import { answerCard, discoverCard } from "@/lib/review/actions";
import type { SessionItem } from "@/lib/review/queries";
import { type Grade, LEARN_AHEAD_MS, loadScheduler } from "@/lib/review/scheduler";

/**
 * A review session in the browser: the queue moves on at once (optimistic), the same FSRS code
 * as the server decides whether a card comes back in this session, and the answers are saved
 * one after the other in the background (in order: a card's discovery before its first answer).
 */
export const useReviewSession = (code: LanguageCode, initialItems: SessionItem[]) => {
  const scheduler = use(loadScheduler());
  const [queue, setQueue] = useState(initialItems);
  const [studied, setStudied] = useState<ReadonlySet<string>>(new Set());
  const [saving, setSaving] = useState(0);
  const [failed, setFailed] = useState(false);
  const saves = useRef(Promise.resolve());

  const current = queue.at(0);

  const save = (send: () => Promise<{ ok: boolean }>) => {
    setSaving((count) => count + 1);
    saves.current = saves.current.then(async () => {
      try {
        const { ok } = await send();
        if (!ok) {
          setFailed(true);
        }
      } catch {
        // Network or server failure: the session shows the error, nothing is silently lost
        setFailed(true);
      } finally {
        setSaving((count) => count - 1);
      }
    });
  };

  /** Drops the current card, and puts it back at the end of the queue when it returns soon. */
  const moveOn = (item: SessionItem, comesBack: SessionItem | null) => {
    setQueue(([, ...rest]) => (comesBack ? [...rest, comesBack] : rest));
    setStudied((ids) => new Set(ids).add(item.userCardId));
  };

  const discover = () => {
    if (current?.kind !== "discover") {
      return;
    }
    const { userCardId, card } = current;
    // Discovered: due at once, so it comes back after the cards already queued
    moveOn(current, {
      kind: "review",
      userCardId,
      card,
      schedule: scheduler.newSchedule(new Date()),
    });
    save(() => discoverCard({ code, userCardId }));
  };

  const answer = (grade: Grade) => {
    if (current?.kind !== "review") {
      return;
    }
    const now = new Date();
    const { userCardId, schedule: answered } = current;
    const { schedule } = scheduler.review(userCardId, answered, grade, now);
    const soon = schedule.due.getTime() - now.getTime() <= LEARN_AHEAD_MS;
    moveOn(current, soon ? { ...current, schedule } : null);
    save(() => answerCard({ code, userCardId, grade, reps: answered.reps }));
  };

  // Cards finished for this session: studied and no longer queued
  const queued = new Set(queue.map(({ userCardId }) => userCardId));
  const total = new Set([...studied, ...queued]).size;

  return {
    current,
    /** Next due date per answer for the current card, as of `now` (rating buttons). */
    preview: (item: Extract<SessionItem, { kind: "review" }>, now: Date) =>
      scheduler.preview(item.userCardId, item.schedule, now),
    progress: { done: total - queued.size, total },
    studied: studied.size,
    saving: saving > 0,
    failed,
    discover,
    answer,
    /** Starts over with a fresh queue from the server ("Keep going"). */
    restart: (items: SessionItem[]) => {
      setQueue(items);
      setStudied(new Set());
    },
  };
};
