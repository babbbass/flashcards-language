"use client";

import { CardSummary } from "@/components/cards/card-summary";
import { SelectableRow } from "@/components/selection/selectable-row";
import type { InboxCard } from "@/lib/inbox/queries";
import type { LanguageCode } from "@/lib/languages";

type Props = {
  card: InboxCard;
  code: LanguageCode;
  nativeLanguage: string;
  /** Deck name on the row, when the list mixes several decks. */
  showDeck: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/** One tickable card of an Inbox list: named by its term, described by its translation. */
export const InboxCardRow = ({
  card,
  code,
  nativeLanguage,
  showDeck,
  checked,
  onCheckedChange,
}: Props) => (
  <SelectableRow checked={checked} onCheckedChange={onCheckedChange}>
    {(ids) => (
      <>
        <CardSummary
          card={card}
          code={code}
          nativeLanguage={nativeLanguage}
          termId={ids.label}
          translationId={ids.description}
        />
        {showDeck && (
          <span className="text-muted-foreground hidden shrink-0 text-xs font-bold uppercase sm:block">
            {card.deck.name}
          </span>
        )}
      </>
    )}
  </SelectableRow>
);
