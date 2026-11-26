import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/current-user";
import { LANGUAGE_PICKER_HREF, languageHref } from "@/lib/language-route";
import { isLanguageCode } from "@/lib/languages";

/**
 * App entry (`/`, also the PWA start URL): reopens the language studied last time,
 * or shows the language picker on first visit.
 */
const HomePage = async () => {
  const { lastLanguageCode } = await requireUser();

  redirect(
    lastLanguageCode && isLanguageCode(lastLanguageCode)
      ? languageHref(lastLanguageCode)
      : LANGUAGE_PICKER_HREF,
  );
};

export default HomePage;
