"use client";

import { Kbd } from "@/components/kbd";
import { Button } from "@/components/ui/button";
import { formatInterval } from "@/lib/review/interval";
import type { Grade } from "@/lib/review/scheduler";

type Props = {
  /** Instant the intervals were computed at. */
  now: Date;
  /** Next due date for each answer, in button order. */
  intervals: { grade: Grade; due: Date }[];
  labels: Record<Grade, string>;
  question: string;
  /** Locale of the interval units ("10 min", "3 días"). */
  locale: string;
  onAnswer: (grade: Grade) => void;
};

/**
 * "Again" stands out as the failure, "Good" as the usual answer. Not the accent color: it is
 * red in some flag palettes and would look like "Again". The labels carry the meaning anyway.
 */
const VARIANTS = {
  AGAIN: "destructive",
  HARD: "outline",
  GOOD: "default",
  EASY: "outline",
} as const satisfies Record<Grade, string>;

/** The four FSRS answers, each with the delay before the card comes back (keys 1 to 4). */
export const RatingButtons = ({ now, intervals, labels, question, locale, onAnswer }: Props) => {
  return (
    <fieldset className="flex w-full flex-col gap-3">
      <legend className="mb-3 w-full text-center text-sm font-bold">{question}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {intervals.map(({ grade, due }, index) => (
          <Button
            key={grade}
            variant={VARIANTS[grade]}
            aria-keyshortcuts={String(index + 1)}
            className="h-auto flex-col gap-0.5 py-2.5 text-base"
            onClick={() => onAnswer(grade)}
          >
            <span>{labels[grade]}</span>
            <span className="flex items-center gap-1.5 text-xs font-normal opacity-90">
              {formatInterval(now, due, locale)}
              <Kbd>{index + 1}</Kbd>
            </span>
          </Button>
        ))}
      </div>
    </fieldset>
  );
};
