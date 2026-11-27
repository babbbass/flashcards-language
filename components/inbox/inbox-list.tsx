"use client";

import { ActionBar } from "@/components/action-bar";
import { InboxCardRow } from "@/components/inbox/inbox-card-row";
import { InboxDecisions } from "@/components/inbox/inbox-decisions";
import { SelectAll } from "@/components/selection/select-all";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { useSelection } from "@/hooks/use-selection";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { pluralize } from "@/lib/i18n/plural";
import { sortInboxCards } from "@/lib/inbox/actions";
import type { InboxCard } from "@/lib/inbox/queries";
import type { InboxMove, InboxView } from "@/lib/inbox/views";
import type { LanguageCode } from "@/lib/languages";

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

/**
 * Cards of one Inbox list, unticked by default: the user ticks what to learn now,
 * and the rest simply stays. The decision buttons act on the ticked cards only.
 */
export const InboxList = ({ code, view, cards, showDeck, nativeLanguage, strings }: Props) => {
  const selection = useSelection(cards.map(({ id }) => id));
  const { pending, feedback, run } = useActionFeedback(strings.error);
  const plural = pluralize(code);

  const decide = (move: InboxMove) =>
    run(async () => {
      const result = await sortInboxCards({ code, cardIds: selection.selected, move });
      if (!result.ok) {
        return null;
      }
      selection.clear();
      return `${result.count} ${plural(result.count, strings.done[move.decision])}`;
    });

  return (
    <div className="flex flex-col gap-4">
      <SelectAll
        label={strings.selectAll}
        selectedLabel={strings.selected}
        count={selection.selected.length}
        total={cards.length}
        all={selection.all}
        some={selection.some}
        onCheckedChange={selection.toggleAll}
      />

      <ul aria-label={strings.label} className="flex flex-col gap-2">
        {cards.map((card) => (
          <li key={card.id}>
            <InboxCardRow
              card={card}
              code={code}
              nativeLanguage={nativeLanguage}
              showDeck={showDeck}
              checked={selection.isSelected(card.id)}
              onCheckedChange={(checked) => selection.toggle(card.id, checked)}
            />
          </li>
        ))}
      </ul>

      <ActionBar feedback={feedback}>
        <InboxDecisions
          view={view}
          count={selection.selected.length}
          pending={pending}
          labels={strings.decisions}
          onDecide={decide}
        />
      </ActionBar>
    </div>
  );
};
