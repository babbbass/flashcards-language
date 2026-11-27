import type { LanguageCode } from "@/lib/languages";

type Props = {
  card: { term: string; phonetic: string | null; translation: string };
  code: LanguageCode;
  /** Language of the translation (WCAG 3.1.2). */
  nativeLanguage: string;
  termId?: string;
  translationId?: string;
};

/** Term (in the studied language), phonetic and translation of a card, on two lines. */
export const CardSummary = ({ card, code, nativeLanguage, termId, translationId }: Props) => (
  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span id={termId} lang={code} className="font-heading text-lg leading-tight">
        {card.term}
      </span>
      {card.phonetic && <span className="text-muted-foreground text-sm">{card.phonetic}</span>}
    </span>
    <span id={translationId} lang={nativeLanguage} className="text-muted-foreground">
      {card.translation}
    </span>
  </span>
);
