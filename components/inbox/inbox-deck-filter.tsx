import { FilterLink } from "@/components/inbox/filter-link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Inbox } from "@/lib/inbox/queries";
import { type InboxView, inboxHref } from "@/lib/inbox/views";
import type { LanguageCode } from "@/lib/languages";

type Props = {
  code: LanguageCode;
  view: InboxView;
  decks: Inbox["decks"];
  activeDeck: Inbox["activeDeck"];
};

/** Narrows the current list to one deck. Only shown when the list spans several decks. */
export const InboxDeckFilter = ({ code, view, decks, activeDeck }: Props) => {
  const t = getDictionary(code).inbox.decks;

  if (decks.length < 2) {
    return null;
  }

  return (
    <nav aria-label={t.label} className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <ul className="flex gap-2">
        <li>
          <FilterLink href={inboxHref(code, { view })} active={!activeDeck}>
            {t.all}
          </FilterLink>
        </li>
        {decks.map((deck) => (
          <li key={deck.slug}>
            <FilterLink
              href={inboxHref(code, { view, deck: deck.slug })}
              active={deck.slug === activeDeck}
            >
              {deck.name}
              <span className="tabular-nums opacity-80">{deck.count}</span>
            </FilterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
