import type { LanguageCode } from "@/lib/languages";
import { rememberLanguage } from "@/lib/user/remember-language";

type Props = {
  code: LanguageCode;
};

/**
 * Renders nothing: records the language being studied so `/` reopens it next time.
 *
 * This is a write during render, on purpose (direct `/es` visits count too). It is safe only
 * because it runs in the dynamic part of the route, which Partial Prefetching never prefetches.
 * Do NOT enable full prefetching (`prefetch={true}`) on links to `/[lang]`: merely showing
 * those links would then record languages the user never opened.
 */
export const RememberLanguage = async ({ code }: Props) => {
  await rememberLanguage(code);
  return null;
};
