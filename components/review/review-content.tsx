import { ReviewSession } from "@/components/review/review-session";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { inboxHref } from "@/lib/inbox/views";
import type { Language } from "@/lib/languages";
import { getReviewSession } from "@/lib/review/queries";

type Props = {
  language: Language;
};

/**
 * Data part of the Review tab. Always renders the same `ReviewSession`, even with an empty
 * queue: every answer refreshes this component, and the session must keep its state.
 */
export const ReviewContent = async ({ language }: Props) => {
  const { items, direction, nativeLanguage } = await getReviewSession(language.code);
  const t = getDictionary(language.code).review;

  return (
    <ReviewSession
      code={language.code}
      locale={language.ttsLocale}
      nativeLanguage={nativeLanguage}
      direction={direction}
      items={items}
      inboxHref={inboxHref(language.code, { view: "new" })}
      strings={{ ...t.session, empty: t.empty }}
    />
  );
};
