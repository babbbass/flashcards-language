import { DeckList } from "@/components/home/deck-list";
import { HeroCard } from "@/components/home/hero-card";
import { StreakWeek } from "@/components/home/streak-week";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { languageFromParam } from "@/lib/language-route";
import { getLanguageStats } from "@/lib/stats/language-stats";

type Props = PageProps<"/[lang]">;

/** Language home: streak of the week, the next thing to do, and the decks. */
const LanguageHomePage = async ({ params }: Props) => {
  const language = languageFromParam((await params).lang);
  const stats = await getLanguageStats(language.code);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-4 sm:p-6">
      <h1 className="sr-only">{getDictionary(language.code).home.title(language.nativeName)}</h1>
      <StreakWeek language={language} streak={stats.streak} week={stats.week} />
      <HeroCard code={language.code} inbox={stats.inbox} due={stats.due} />
      <DeckList code={language.code} />
    </main>
  );
};

export default LanguageHomePage;
