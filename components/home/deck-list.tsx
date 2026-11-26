import { getDecks } from "@/lib/decks/queries";
import type { LanguageCode } from "@/lib/languages";

type Props = {
  code: LanguageCode;
};

/** Decks of the language with their size. Not clickable yet: the Decks screen comes later. */
export const DeckList = async ({ code }: Props) => {
  const decks = await getDecks(code);

  return (
    <section aria-labelledby="decks-title" className="flex flex-col gap-3">
      <h2 id="decks-title" className="text-xl">
        Decks
      </h2>
      {decks.length === 0 ? (
        <p className="text-muted-foreground">No deck in this language yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {decks.map((deck) => (
            <li
              key={deck.id}
              className="border-ink bg-card shadow-brutal-sm flex flex-col gap-1 rounded-xl border-2 p-4"
            >
              <span className="font-heading text-lg">{deck.name}</span>
              {deck.description && (
                <span className="text-muted-foreground text-sm">{deck.description}</span>
              )}
              <span className="text-xs font-bold">
                {deck._count.cards} {deck._count.cards === 1 ? "card" : "cards"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
