import { Suspense } from "react";
import { InboxContent } from "@/components/inbox/inbox-content";
import { InboxSkeleton } from "@/components/inbox/inbox-skeleton";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { languageFromParam } from "@/lib/language-route";

type Props = PageProps<"/[lang]/inbox">;

/**
 * Inbox: every new card lands here before it is learned. The language is checked BEFORE
 * the Suspense boundary (real 404 status); the filters (search params) and the cards
 * are read inside it, so the tab opens instantly and the list streams in.
 */
const InboxPage = async ({ params, searchParams }: Props) => {
  const language = languageFromParam((await params).lang);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-4xl">{getDictionary(language.code).inbox.title}</h1>
      <Suspense fallback={<InboxSkeleton />}>
        <InboxContent language={language} searchParams={searchParams} />
      </Suspense>
    </main>
  );
};

export default InboxPage;
