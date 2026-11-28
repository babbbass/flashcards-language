import { Suspense } from "react";
import { ReviewContent } from "@/components/review/review-content";
import { ReviewSkeleton } from "@/components/review/review-skeleton";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { languageFromParam } from "@/lib/language-route";

type Props = PageProps<"/[lang]/review">;

/**
 * Review: discover the cards picked in the Inbox, then answer the due ones (FSRS).
 * The language is checked BEFORE the Suspense boundary (real 404 status); the session
 * streams in, so the tab opens instantly.
 */
const ReviewPage = async ({ params }: Props) => {
  const language = languageFromParam((await params).lang);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-4xl">{getDictionary(language.code).review.title}</h1>
      <Suspense fallback={<ReviewSkeleton />}>
        <ReviewContent language={language} />
      </Suspense>
    </main>
  );
};

export default ReviewPage;
