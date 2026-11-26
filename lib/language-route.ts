import { notFound } from "next/navigation";
import { LANGUAGES, type Language } from "@/lib/languages";

/** `/[lang]` params prerendered at build time (Cache Components needs at least one). */
export const languageStaticParams = () => LANGUAGES.map(({ code }) => ({ lang: code }));

/** The language of a `[lang]` URL segment, if it is one we teach. */
export const findLanguage = (lang: string) => LANGUAGES.find(({ code }) => code === lang);

/** Resolves the `[lang]` URL segment to its language, or renders the 404 page. */
export const languageFromParam = (lang: string): Language => {
  const language = findLanguage(lang);
  if (!language) {
    notFound();
  }
  return language;
};

export const languageHref = (code: Language["code"]) => `/${code}`;
export const LANGUAGE_PICKER_HREF = "/languages";
