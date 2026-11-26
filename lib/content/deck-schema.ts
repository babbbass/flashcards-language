import { z } from "zod";
import { PartOfSpeech } from "@/generated/prisma/enums";

/**
 * Format of a deck file: `content/<lang>/<deck-slug>.json`.
 * The language and the deck slug come from the file path, not from the file content,
 * so a file cannot claim to belong somewhere else.
 */

const optionalText = z.string().trim().min(1).optional();

export const cardFileSchema = z.object({
  /** Stable id inside the deck. Defaults to a slug of `term`; set it to rename a term safely. */
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case")
    .optional(),
  term: z.string().trim().min(1),
  translation: z.string().trim().min(1),
  example: optionalText,
  exampleTranslation: optionalText,
  phonetic: optionalText,
  partOfSpeech: z.enum(PartOfSpeech).optional(),
  note: optionalText,
});

export const deckFileSchema = z.object({
  name: z.string().trim().min(1),
  description: optionalText,
  cards: z.array(cardFileSchema).min(1),
});

export type CardFile = z.infer<typeof cardFileSchema>;
export type DeckFile = z.infer<typeof deckFileSchema>;

/** "How are you?" → "how-are-you". Accents are stripped so "¿Qué tal?" → "que-tal". */
export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Importer key stored in `Card.key`, e.g. "en/greetings/how-are-you". */
export const cardKey = (languageCode: string, deckSlug: string, card: CardFile) =>
  `${languageCode}/${deckSlug}/${card.id ?? slugify(card.term)}`;
