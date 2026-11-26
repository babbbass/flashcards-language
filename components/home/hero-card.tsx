import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LanguageCode } from "@/lib/languages";
import { TABS, type TabKey, tabHref } from "@/lib/navigation/tabs";
import type { LanguageStats } from "@/lib/stats/language-stats";

type Props = {
  code: LanguageCode;
  inbox: LanguageStats["inbox"];
  due: LanguageStats["due"];
};

type NextAction = {
  eyebrow: string;
  title: string;
  cta: string;
  tab: TabKey;
} | null;

/** The single most useful thing to do now: review first, then learn new cards. */
const nextAction = ({ inbox, due }: Pick<Props, "inbox" | "due">): NextAction => {
  if (due > 0) {
    return {
      eyebrow: "Review",
      title: `${due} ${due === 1 ? "card" : "cards"} to review today`,
      cta: "Start reviewing",
      tab: "review",
    };
  }
  if (inbox > 0) {
    return {
      eyebrow: "Inbox",
      title: `${inbox} new ${inbox === 1 ? "card" : "cards"} waiting`,
      cta: "Pick cards to learn",
      tab: "inbox",
    };
  }
  return null;
};

/** Big call-to-action card at the top of the language home. */
export const HeroCard = ({ code, inbox, due }: Props) => {
  const action = nextAction({ inbox, due });

  if (!action) {
    return (
      <section className="border-ink bg-card shadow-brutal flex flex-col gap-2 rounded-2xl border-3 p-6">
        <h2 className="text-2xl">All caught up</h2>
        <p className="text-muted-foreground">No review due and no new card. Come back tomorrow!</p>
      </section>
    );
  }

  const tab = TABS.find(({ key }) => key === action.tab);

  return (
    <section className="border-ink bg-primary text-primary-foreground shadow-brutal flex flex-col gap-5 rounded-2xl border-3 p-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold tracking-widest uppercase opacity-90">{action.eyebrow}</p>
        <h2 className="text-3xl">{action.title}</h2>
      </div>
      {tab?.built ? (
        <Button
          size="lg"
          variant="accent"
          nativeButton={false}
          render={<Link href={tabHref(code, tab)} />}
        >
          {action.cta}
        </Button>
      ) : (
        <Button size="lg" variant="accent" disabled>
          {action.cta} · soon
        </Button>
      )}
    </section>
  );
};
