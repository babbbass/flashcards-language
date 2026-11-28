import { DeckList } from "@/components/home/deck-list";
import { HeroCard } from "@/components/home/hero-card";
import { StreakWeek } from "@/components/home/streak-week";
import type { Language } from "@/lib/languages";
import { getLanguageStats } from "@/lib/stats/language-stats";

type Props = {
  language: Language;
};

/** Data part of the language home: streak of the week, the next thing to do, the decks. */
export const HomeContent = async ({ language }: Props) => {
  const stats = await getLanguageStats(language.code);

  return (
    <>
      <StreakWeek language={language} streak={stats.streak} week={stats.week} />
      <HeroCard code={language.code} inbox={stats.inbox} toReview={stats.toReview} />
      <DeckList code={language.code} />
    </>
  );
};
