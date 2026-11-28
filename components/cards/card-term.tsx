import type { LanguageCode } from "@/lib/languages";
import type { SessionCard } from "@/lib/review/queries";

type Props = {
  card: Pick<SessionCard, "term" | "phonetic">;
  code: LanguageCode;
};

/** The word or expression in the studied language, with its pronunciation. */
export const CardTerm = ({ card, code }: Props) => (
  <div className="flex flex-col items-center gap-1">
    <p lang={code} className="font-heading text-4xl leading-tight break-words sm:text-5xl">
      {card.term}
    </p>
    {card.phonetic && <p className="text-muted-foreground">{card.phonetic}</p>}
  </div>
);
