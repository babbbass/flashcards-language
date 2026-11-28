"use client";

import { useEffect, useRef, useState } from "react";
import { ActionBar } from "@/components/action-bar";
import { CardDetails } from "@/components/cards/card-details";
import { CardTerm } from "@/components/cards/card-term";
import { CardTranslation } from "@/components/cards/card-translation";
import { FlashCard } from "@/components/cards/flash-card";
import { Kbd } from "@/components/kbd";
import { RatingButtons } from "@/components/review/rating-buttons";
import { Button } from "@/components/ui/button";
import type { Direction } from "@/generated/prisma/enums";
import { useHotkeys } from "@/hooks/use-hotkeys";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { LanguageCode } from "@/lib/languages";
import type { SessionCard } from "@/lib/review/queries";
import { GRADES, type Grade } from "@/lib/review/scheduler";

type Props = {
  card: SessionCard;
  direction: Direction;
  code: LanguageCode;
  nativeLanguage: string;
  locale: string;
  /** Instant the intervals were computed at. */
  now: Date;
  intervals: { grade: Grade; due: Date }[];
  strings: Dictionary["review"]["session"];
  onAnswer: (grade: Grade) => void;
};

/**
 * Recall first, then check: one side (by the user's review direction), "Show answer"
 * (Space), then the other side and the four answers (keys 1 to 4).
 */
export const ReviewCard = ({
  card,
  direction,
  code,
  nativeLanguage,
  locale,
  now,
  intervals,
  strings,
  onAnswer,
}: Props) => {
  const [revealed, setRevealed] = useState(false);
  const revealRef = useRef<HTMLButtonElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  // Keyboard on "Show answer" for a new card, then on the answer so screen readers read it
  useEffect(() => {
    (revealed ? answerRef : revealRef).current?.focus();
  }, [revealed]);

  useHotkeys(
    revealed
      ? Object.fromEntries(GRADES.map((grade, index) => [String(index + 1), () => onAnswer(grade)]))
      : { " ": () => setRevealed(true) },
  );

  const term = <CardTerm card={card} code={code} />;
  const translation = (
    <CardTranslation translation={card.translation} nativeLanguage={nativeLanguage} />
  );
  const [prompt, response] = direction === "FORWARD" ? [term, translation] : [translation, term];

  return (
    <>
      <FlashCard>
        {prompt}
        {revealed && (
          <div
            ref={answerRef}
            tabIndex={-1}
            className="flex w-full flex-col items-center gap-5 outline-none"
          >
            <hr className="border-ink w-full border-t-2 border-dashed" />
            {response}
            <CardDetails card={card} code={code} nativeLanguage={nativeLanguage} labels={strings} />
          </div>
        )}
      </FlashCard>
      <ActionBar>
        {revealed ? (
          <RatingButtons
            now={now}
            intervals={intervals}
            labels={strings.grades}
            question={strings.rate}
            locale={locale}
            onAnswer={onAnswer}
          />
        ) : (
          <Button
            ref={revealRef}
            size="lg"
            className="h-12 flex-1 text-base"
            aria-keyshortcuts="Space"
            onClick={() => setRevealed(true)}
          >
            {strings.reveal}
            <Kbd>{strings.spaceKey}</Kbd>
          </Button>
        )}
      </ActionBar>
    </>
  );
};
