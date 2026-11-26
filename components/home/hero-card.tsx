import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Dictionary, getDictionary } from "@/lib/i18n/get-dictionary";
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
const nextAction = (
  t: Dictionary["home"]["hero"],
  { inbox, due }: Pick<Props, "inbox" | "due">,
): NextAction => {
  if (due > 0) {
    return { ...t.review, title: t.review.title(due), tab: "review" };
  }
  if (inbox > 0) {
    return { ...t.inbox, title: t.inbox.title(inbox), tab: "inbox" };
  }
  return null;
};

/** Big call-to-action card at the top of the language home. */
export const HeroCard = ({ code, inbox, due }: Props) => {
  const t = getDictionary(code).home.hero;
  const action = nextAction(t, { inbox, due });

  if (!action) {
    return (
      <section className="border-ink bg-card shadow-brutal flex flex-col gap-2 rounded-2xl border-3 p-6">
        <h2 className="text-2xl">{t.caughtUp.title}</h2>
        <p className="text-muted-foreground">{t.caughtUp.text}</p>
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
          {action.cta} · {t.soon}
        </Button>
      )}
    </section>
  );
};
