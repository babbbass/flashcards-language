import { Flame } from "lucide-react";
import { weekdayLabel } from "@/lib/dates";
import type { LanguageStats } from "@/lib/stats/language-stats";
import { cn } from "@/lib/utils";

type Props = {
  streak: LanguageStats["streak"];
  week: LanguageStats["week"];
};

/** Current streak and the seven days of this week (filled = at least one review that day). */
export const StreakWeek = ({ streak, week }: Props) => (
  <section aria-labelledby="streak-title" className="flex flex-col gap-3">
    <h2 id="streak-title" className="flex items-center gap-2">
      <Flame aria-hidden="true" className="text-accent size-8" />
      <span className="text-4xl">{streak}</span>
      <span className="font-sans text-lg font-bold">
        {streak === 1 ? "day" : "days"} <span className="text-muted-foreground">streak</span>
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
            {weekdayLabel(day)}
          </span>
          <span className="sr-only">
            {isToday ? "today, " : ""}
            {reviewed ? "reviewed" : isFuture ? "upcoming" : "no review"}
          </span>
        </li>
      ))}
    </ol>
  </section>
);
