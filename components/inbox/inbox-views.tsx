import { FilterLink } from "@/components/inbox/filter-link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Inbox } from "@/lib/inbox/queries";
import { INBOX_VIEWS, type InboxView, inboxHref } from "@/lib/inbox/views";
import type { LanguageCode } from "@/lib/languages";

type Props = {
  code: LanguageCode;
  view: InboxView;
  counts: Inbox["counts"];
};

/** Switch between the new cards and the skipped ones, with the size of each list. */
export const InboxViews = ({ code, view, counts }: Props) => {
  const t = getDictionary(code).inbox.views;

  return (
    <nav aria-label={t.label}>
      <ul className="flex gap-2">
        {INBOX_VIEWS.map((item) => (
          <li key={item}>
            <FilterLink href={inboxHref(code, { view: item })} active={item === view}>
              {t[item]}
              <span className="tabular-nums opacity-80">{counts[item]}</span>
            </FilterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
