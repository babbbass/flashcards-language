import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Inbox } from "@/lib/inbox/queries";
import { type InboxView, inboxHref } from "@/lib/inbox/views";
import type { LanguageCode } from "@/lib/languages";

type Props = {
  code: LanguageCode;
  view: InboxView;
  deck: Inbox["activeDeck"];
  pagination: Inbox["pagination"];
};

/**
 * Previous / next page of the current Inbox list. Hidden when everything fits on one page;
 * at either end the button is disabled rather than a link to nowhere (no dead links).
 */
export const InboxPagination = ({ code, view, deck, pagination: { page, pageCount } }: Props) => {
  const t = getDictionary(code).inbox.pagination;

  if (pageCount <= 1) {
    return null;
  }

  const step = (target: number, children: ReactNode) =>
    target >= 1 && target <= pageCount ? (
      <Button
        variant="outline"
        size="lg"
        nativeButton={false}
        render={<Link href={inboxHref(code, { view, deck, page: target })} />}
      >
        {children}
      </Button>
    ) : (
      <Button variant="outline" size="lg" disabled>
        {children}
      </Button>
    );

  return (
    <nav aria-label={t.label} className="flex items-center justify-between gap-3">
      {step(
        page - 1,
        <>
          <ChevronLeft aria-hidden="true" />
          {t.previous}
        </>,
      )}
      <p className="text-sm font-bold tabular-nums">{t.page(page, pageCount)}</p>
      {step(
        page + 1,
        <>
          {t.next}
          <ChevronRight aria-hidden="true" />
        </>,
      )}
    </nav>
  );
};
