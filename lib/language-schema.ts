import { z } from "zod";
import { isLanguageCode, type LanguageCode } from "@/lib/languages";

/** A language code sent by the browser to a server action. */
export const languageCodeSchema = z.custom<LanguageCode>(
  (value) => typeof value === "string" && isLanguageCode(value),
);
