import { InboxDeckFilter } from "@/components/inbox/inbox-deck-filter";
import { InboxList } from "@/components/inbox/inbox-list";
import { InboxPagination } from "@/components/inbox/inbox-pagination";
import { InboxViews } from "@/components/inbox/inbox-views";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getInbox } from "@/lib/inbox/queries";
import { INBOX_PARAMS, isInboxView, parsePage } from "@/lib/inbox/views";
import type { Language } from "@/lib/languages";

type Props = {
  language: Language;
  searchParams: PageProps<"/[lang]/inbox">["searchParams"];
};

/** Reads a single-valued query param: `?deck=a&deck=b` keeps the first one. */
const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Data part of the Inbox: list switch, deck filter, then one page of cards to sort. */
export const InboxContent = async ({ language, searchParams }: Props) => {
  const params = await searchParams;
  const requestedView = firstValue(params[INBOX_PARAMS.view]);
  const view = isInboxView(requestedView) ? requestedView : "new";
  const deck = firstValue(params[INBOX_PARAMS.deck]);
  const page = parsePage(firstValue(params[INBOX_PARAMS.page]));

  const inbox = await getInbox(language.code, { view, deck, page });
  const t = getDictionary(language.code).inbox;

  return (
    <>
      <div className="flex flex-col gap-4">
        <InboxViews code={language.code} view={view} counts={inbox.counts} />
        <p className="text-muted-foreground">{t.intro[view]}</p>
        <InboxDeckFilter
          code={language.code}
          view={view}
          decks={inbox.decks}
          activeDeck={inbox.activeDeck}
        />
      </div>
      {inbox.cards.length === 0 ? (
        <p className="border-ink bg-card shadow-brutal rounded-2xl border-3 p-6 text-lg font-bold">
          {t.empty[view]}
        </p>
      ) : (
        <>
          <InboxList
            // A new list (other view, deck or page) starts with nothing ticked
            key={`${view}/${inbox.activeDeck ?? ""}/${inbox.pagination.page}`}
            code={language.code}
            view={view}
            cards={inbox.cards}
            showDeck={!inbox.activeDeck && inbox.decks.length > 1}
            nativeLanguage={inbox.nativeLanguage}
            strings={t.list}
          />
          <InboxPagination
            code={language.code}
            view={view}
            deck={inbox.activeDeck}
            pagination={inbox.pagination}
          />
        </>
      )}
    </>
  );
};
