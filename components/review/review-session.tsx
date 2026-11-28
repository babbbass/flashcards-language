"use client";

import { DiscoveryCard } from "@/components/review/discovery-card";
import { ReviewCard } from "@/components/review/review-card";
import { SessionEnd } from "@/components/review/session-end";
import { SessionProgress } from "@/components/review/session-progress";
import type { Direction } from "@/generated/prisma/enums";
import { useReviewSession } from "@/hooks/use-review-session";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { pluralize } from "@/lib/i18n/plural";
import { languageHref } from "@/lib/language-route";
import type { LanguageCode } from "@/lib/languages";
import type { SessionItem } from "@/lib/review/queries";

type Props = {
  code: LanguageCode;
  /** Locale of numbers and units (`language.ttsLocale`). */
  locale: string;
  nativeLanguage: string;
  direction: Direction;
  /**
   * The server's current queue. Read once to start; every answer refreshes the page, so when
   * the session ends it already holds what became due meanwhile ("Keep going").
   */
  items: SessionItem[];
  inboxHref: string;
  /** Plain data from the dictionary (no functions): safe to send to the browser. */
  strings: Dictionary["review"]["session"] & { empty: Dictionary["review"]["empty"] };
};

/** One review session: discoveries and answers one card at a time, then the end screen. */
export const ReviewSession = ({
  code,
  locale,
  nativeLanguage,
  direction,
  items,
  inboxHref,
  strings,
}: Props) => {
  const session = useReviewSession(code, items);
  const { current } = session;
  const plural = pluralize(locale);
  // One instant for the intervals and their labels ("10 min" from the same now)
  const now = new Date();

  // Loading more waits for the last answers to be saved, so the server's queue is up to date
  const more =
    !session.saving && items.length > 0
      ? { count: items.length, label: strings.done.more, onClick: () => session.restart(items) }
      : null;

  return (
    <div className="flex flex-col gap-6">
      {current && <SessionProgress label={strings.progress} {...session.progress} />}

      {current?.kind === "discover" && (
        <DiscoveryCard
          key={`${current.userCardId}:discover`}
          card={current.card}
          code={code}
          nativeLanguage={nativeLanguage}
          strings={strings}
          onDone={session.discover}
        />
      )}

      {current?.kind === "review" && (
        <ReviewCard
          // A card coming back in the session (new `reps`) starts hidden again
          key={`${current.userCardId}:${current.schedule.reps}`}
          card={current.card}
          direction={direction}
          code={code}
          nativeLanguage={nativeLanguage}
          locale={locale}
          now={now}
          intervals={session.preview(current, now)}
          strings={strings}
          onAnswer={session.answer}
        />
      )}

      {!current &&
        (session.studied > 0 ? (
          <SessionEnd
            title={strings.done.title}
            text={`${session.studied} ${plural(session.studied, strings.done.studied)}`}
            link={{ href: languageHref(code), label: strings.done.home }}
            more={more}
            focusTitle
          />
        ) : (
          <SessionEnd
            title={strings.empty.title}
            text={strings.empty.text}
            link={{ href: inboxHref, label: strings.empty.inbox }}
            more={more}
            focusTitle={false}
          />
        ))}

      <p role="status" className="text-destructive font-bold empty:hidden">
        {session.failed ? strings.saveError : ""}
      </p>
    </div>
  );
};
