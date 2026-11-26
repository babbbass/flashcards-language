import { Flame } from "lucide-react";
import { weekdayLabel } from "@/lib/dates";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Language } from "@/lib/languages";
import type { LanguageStats } from "@/lib/stats/language-stats";
import { cn } from "@/lib/utils";

type Props = {
  language: Language;
  streak: LanguageStats["streak"];
  week: LanguageStats["week"];
};

/** Current streak and the seven days of this week (filled = at least one review that day). */
export const StreakWeek = ({ language, streak, week }: Props) => {
  const t = getDictionary(language.code).home.streak;

  return (
    <section aria-labelledby="streak-title" className="flex flex-col gap-3">
      <h2 id="streak-title" className="flex items-center gap-2">
        <Flame aria-hidden="true" className="text-accent size-8" />
        <span className="text-4xl">{streak}</span>
        <span className="font-sans text-lg font-bold">
          {t.days(streak)} <span className="text-muted-foreground">{t.label}</span>
        </span>
      </h2>
      <ol className="grid grid-cols-7 gap-2">
        {week.map(({ day, reviewed, isToday, isFuture }) => (
          <li key={day} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "border-ink size-9 rounded-full border-2",
                reviewed && "bg-primary",
                !reviewed && !isFuture && "bg-card",
                isFuture && "border-dashed opacity-50",
                isToday && "shadow-brutal-sm",
              )}
            />
            <span className={cn("text-xs", isToday ? "font-bold" : "text-muted-foreground")}>
              {weekdayLabel(day, language.ttsLocale)}
            </span>
            <span className="sr-only">
              {isToday ? `${t.today}, ` : ""}
              {reviewed ? t.reviewed : isFuture ? t.upcoming : t.missed}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};
