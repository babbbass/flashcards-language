/**
 * Single source of truth for the languages the app can teach.
 *
 * Used by the card importer (upserts the `Language` rows) and, later, by the UI
 * (language picker, `/[lang]` routes, text-to-speech voice). Adding a language =
 * one entry here + its palette in `app/globals.css` (`[data-lang="xx"]`).
 */
export const LANGUAGES = [
  // ttsLocale: BCP 47 locale, used for the text-to-speech voice and for Intl formatting (weekdays…)
  { code: "en", name: "English", nativeName: "English", ttsLocale: "en-GB" },
  { code: "es", name: "Spanish", nativeName: "Español", ttsLocale: "es-ES" },
] as const satisfies readonly {
  code: string;
  name: string;
  nativeName: string;
  ttsLocale: string;
}[];

export type Language = (typeof LANGUAGES)[number];
export type LanguageCode = Language["code"];

export const LANGUAGE_CODES = LANGUAGES.map((language) => language.code);

export const isLanguageCode = (value: string): value is LanguageCode =>
  LANGUAGES.some((language) => language.code === value);
