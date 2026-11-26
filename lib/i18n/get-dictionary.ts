import { type Dictionary, en } from "@/lib/i18n/dictionaries/en";
import { es } from "@/lib/i18n/dictionaries/es";
import type { LanguageCode } from "@/lib/languages";

/**
 * The interface speaks the language being studied (immersion). Typed as a Record over
 * LanguageCode: adding a language without its dictionary fails the typecheck.
 */
const DICTIONARIES: Record<LanguageCode, Dictionary> = { en, es };

export const getDictionary = (code: LanguageCode) => DICTIONARIES[code];

export type { Dictionary };
