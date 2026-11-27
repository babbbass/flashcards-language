"use client";

import { useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { pluralize } from "@/lib/i18n/plural";
import { sortInboxCards } from "@/lib/inbox/actions";
import type { InboxCard } from "@/lib/inbox/queries";
import { type InboxMove, type InboxView, movesOf } from "@/lib/inbox/views";
import type { LanguageCode } from "@/lib/languages";
import { cn } from "@/lib/utils";

type Props = {
  code: LanguageCode;
  view: InboxView;
  cards: InboxCard[];
  /** Deck name on each row, when the list mixes several decks. */
  showDeck: boolean;
  /** Language of the translations (WCAG 3.1.2). */
  nativeLanguage: string;
  /** Plain data from the dictionary (no functions): safe to send to the browser. */
  strings: Dictionary["inbox"]["list"];
};

type Feedback = { kind: "done" | "error"; text: string } | null;

/**
 * Cards of one Inbox list, unticked by default: the user ticks what to learn now,
 * and the rest simply stays. The decision buttons act on the ticked cards only.
 */
export const InboxList = ({ code, view, cards, showDeck, nativeLanguage, strings }: Props) => {
  const [ticked, setTicked] = useState<ReadonlySet<string>>(new Set());
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [pending, startTransition] = useTransition();
  // Base UI's checkbox is a <span role="checkbox">: a wrapping <label> only names its hidden
  // input, so each checkbox points at its own text with aria-labelledby
  const idPrefix = useId();
  const textId = (id: string, part: "term" | "translation") => `${idPrefix}-${id}-${part}`;

  // Cards sorted meanwhile (other tab, refresh) drop out of the selection on their own
  const selection = cards.filter(({ id }) => ticked.has(id)).map(({ id }) => id);
  const allTicked = selection.length === cards.length;
  const plural = pluralize(code);

  const toggle = (id: string, checked: boolean) =>
    setTicked((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });

  const decide = (move: InboxMove) =>
    startTransition(async () => {
      try {
        const result = await sortInboxCards({ code, cardIds: selection, move });
        if (!result.ok) {
          setFeedback({ kind: "error", text: strings.error });
          return;
        }
        setTicked(new Set());
        setFeedback({
          kind: "done",
          text: `${result.count} ${plural(result.count, strings.done[move.decision])}`,
        });
      } catch {
        setFeedback({ kind: "error", text: strings.error });
      }
    });

  return (
    <div className="flex flex-col gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-3 text-sm font-bold">
        <Checkbox
          className="border-ink size-5 border-2"
          aria-labelledby={`${idPrefix}-all`}
          checked={allTicked && cards.length > 0}
          indeterminate={selection.length > 0 && !allTicked}
          onCheckedChange={(checked) =>
            setTicked(checked ? new Set(cards.map(({ id }) => id)) : new Set())
          }
        />
        <span id={`${idPrefix}-all`}>{strings.selectAll}</span>
        <span className="text-muted-foreground font-normal tabular-nums">
          {selection.length} / {cards.length} {strings.selected}
        </span>
      </label>

      <ul aria-label={strings.label} className="flex flex-col gap-2">
        {cards.map((card) => (
          <li key={card.id}>
            <label
              className={cn(
                "border-ink bg-card flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors",
                "has-data-checked:bg-muted has-data-checked:shadow-brutal-sm hover:bg-muted/60",
              )}
            >
              <Checkbox
                className="border-ink size-5 border-2"
                aria-labelledby={textId(card.id, "term")}
                aria-describedby={textId(card.id, "translation")}
                checked={ticked.has(card.id)}
                onCheckedChange={(checked) => toggle(card.id, checked)}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    id={textId(card.id, "term")}
                    lang={code}
                    className="font-heading text-lg leading-tight"
                  >
                    {card.term}
                  </span>
                  {card.phonetic && (
                    <span className="text-muted-foreground text-sm">{card.phonetic}</span>
                  )}
                </span>
                <span
                  id={textId(card.id, "translation")}
                  lang={nativeLanguage}
                  className="text-muted-foreground"
                >
                  {card.translation}
                </span>
              </span>
              {showDeck && (
                <span className="text-muted-foreground hidden shrink-0 text-xs font-bold uppercase sm:block">
                  {card.deck.name}
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>

      {/* Above the fixed tab bar on mobile, at the bottom of the window on desktop */}
      <div className="border-ink bg-card shadow-brutal sticky bottom-[calc(6.5rem+env(safe-area-inset-bottom))] flex flex-wrap items-center gap-3 rounded-2xl border-3 p-3 md:bottom-6">
        {movesOf(view).map((move, index) => (
          <Button
            key={move.decision}
            size="lg"
            variant={index === 0 ? "default" : "outline"}
            className={cn(index === 0 && "flex-1")}
            disabled={pending || selection.length === 0}
            onClick={() => decide(move)}
          >
            {strings.decisions[move.decision]} ({selection.length})
          </Button>
        ))}
        <p
          role="status"
          className={cn(
            "w-full text-sm font-bold empty:hidden",
            feedback?.kind === "error" && "text-destructive",
          )}
        >
          {feedback?.text}
        </p>
      </div>
    </div>
  );
};
