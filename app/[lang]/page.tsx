import { Suspense } from "react";
import { HomeContent } from "@/components/home/home-content";
import { HomeSkeleton } from "@/components/home/home-skeleton";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { languageFromParam } from "@/lib/language-route";

type Props = PageProps<"/[lang]">;

/**
 * Language home. The language is checked BEFORE the Suspense boundary, so an unknown code
 * still answers with a real 404 status; only the data (counters, decks) streams in.
 * The page's own Suspense also keeps tab-to-tab navigation instant (Cache Components).
 */
const LanguageHomePage = async ({ params }: Props) => {
  const language = languageFromParam((await params).lang);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-4 sm:p-6">
      <h1 className="sr-only">{getDictionary(language.code).home.title(language.nativeName)}</h1>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent language={language} />
      </Suspense>
    </main>
  );
};

export default LanguageHomePage;
