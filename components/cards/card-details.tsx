import type { LanguageCode } from "@/lib/languages";
import type { SessionCard } from "@/lib/review/queries";

type Props = {
  card: Pick<SessionCard, "example" | "exampleTranslation" | "note">;
  code: LanguageCode;
  nativeLanguage: string;
  labels: { example: string; note: string };
};

/** Example sentence (and its translation) and usage note, when the card has them. */
export const CardDetails = ({ card, code, nativeLanguage, labels }: Props) => {
  if (!card.example && !card.note) {
    return null;
  }

  return (
    <dl className="bg-muted flex w-full flex-col gap-3 rounded-xl p-4 text-left">
      {card.example && (
        <div>
          <dt className="text-muted-foreground text-xs font-bold uppercase">{labels.example}</dt>
          <dd lang={code} className="font-bold">
            {card.example}
          </dd>
          {card.exampleTranslation && (
            <dd lang={nativeLanguage} className="text-muted-foreground">
              {card.exampleTranslation}
            </dd>
          )}
        </div>
      )}
      {card.note && (
        <div>
          <dt className="text-muted-foreground text-xs font-bold uppercase">{labels.note}</dt>
          <dd>{card.note}</dd>
        </div>
      )}
    </dl>
  );
};
