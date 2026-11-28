import { DefaultScheduler, type DefaultSchedulerCard, Rating, State } from "ts-fsrs";

/**
 * FSRS scheduling, shared by the server (source of truth, saved on each answer) and the
 * browser (intervals shown on the rating buttons, cards coming back within the session).
 * Both sides run the same pure code with the same settings, so they agree without a round trip.
 *
 * FSRS-6 (the model Anki ships): its card matches `ReviewState` column for column and it honours
 * the short learning steps below. Fuzz is off so the server and the preview give the same dates.
 */

/** The four answers, in button order (Prisma `Rating` values). */
export const GRADES = ["AGAIN", "HARD", "GOOD", "EASY"] as const;
export type Grade = (typeof GRADES)[number];

/** Prisma `FsrsState` values, indexed like ts-fsrs `State` (New = 0 … Relearning = 3). */
const STATES = ["NEW", "LEARNING", "REVIEW", "RELEARNING"] as const;
export type ScheduleState = (typeof STATES)[number];

const FSRS_GRADE = {
  AGAIN: Rating.Again,
  HARD: Rating.Hard,
  GOOD: Rating.Good,
  EASY: Rating.Easy,
} as const;

const FSRS_STATE = {
  NEW: State.New,
  LEARNING: State.Learning,
  REVIEW: State.Review,
  RELEARNING: State.Relearning,
} as const;

/** ts-fsrs keeps a coarser status next to the state: relearning counts as "learning". */
const FSRS_STATUS = {
  NEW: "new",
  LEARNING: "learning",
  REVIEW: "review",
  RELEARNING: "learning",
} as const;

/**
 * A card that comes back within this delay is shown again in the same session (learning
 * steps of 1 and 10 minutes), a little early if nothing else is left, like Anki's "learn ahead".
 */
export const LEARN_AHEAD_MS = 20 * 60 * 1000;

/** The scheduling columns of `ReviewState`. */
export type Schedule = {
  due: Date;
  stability: number;
  difficulty: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: ScheduleState;
  lastReview: Date | null;
};

type FsrsCard = DefaultSchedulerCard<"FSRS-6">;

const toSchedule = (card: FsrsCard): Schedule => ({
  due: card.dueAt,
  stability: card.stability,
  difficulty: card.difficulty,
  scheduledDays: card.scheduledDays,
  learningSteps: card.learningStep,
  reps: card.reps,
  lapses: card.lapses,
  state: STATES[card.state],
  lastReview: card.lastReviewAt,
});

const createScheduler = async () => {
  const fsrs = await DefaultScheduler({
    version: "FSRS-6",
    learningSteps: ["1m", "10m"],
    relearningSteps: ["10m"],
    enableFuzz: false,
  });

  /** `id` only identifies the card inside ts-fsrs (any stable string). */
  const toCard = (id: string, schedule: Schedule): FsrsCard => ({
    cardId: id,
    dueAt: schedule.due,
    stability: schedule.stability,
    difficulty: schedule.difficulty,
    scheduledDays: schedule.scheduledDays,
    learningStep: schedule.learningSteps,
    reps: schedule.reps,
    lapses: schedule.lapses,
    state: FSRS_STATE[schedule.state],
    scheduleStatus: FSRS_STATUS[schedule.state],
    lastReviewAt: schedule.lastReview,
  });

  /** One answer: the next schedule, and the state before it (what `ReviewLog` records). */
  const review = (id: string, schedule: Schedule, grade: Grade, now: Date) => {
    const { card, revlog } = fsrs.review({
      card: toCard(id, schedule),
      grade: FSRS_GRADE[grade],
      now,
    });
    return {
      schedule: toSchedule(card),
      before: {
        state: STATES[revlog.state],
        due: revlog.dueAt,
        stability: revlog.stability,
        difficulty: revlog.difficulty,
        scheduledDays: revlog.scheduledDays,
        learningSteps: revlog.learningStep,
      },
    };
  };

  return {
    /** Schedule of a card just discovered: due now, first answer still to give. */
    newSchedule: (now: Date) => toSchedule(fsrs.newCard({ now })),
    review,
    /** Next due date for each answer, in button order. */
    preview: (id: string, schedule: Schedule, now: Date) =>
      GRADES.map((grade) => ({ grade, due: review(id, schedule, grade, now).schedule.due })),
  };
};

export type ReviewScheduler = Awaited<ReturnType<typeof createScheduler>>;

let scheduler: Promise<ReviewScheduler> | undefined;

/** The scheduler, created once per server process or browser tab (a stable promise for `use`). */
export const loadScheduler = () => {
  scheduler ??= createScheduler();
  return scheduler;
};
