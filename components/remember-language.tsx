import type { LanguageCode } from "@/lib/languages";
import { rememberLanguage } from "@/lib/user/remember-language";

type Props = {
  code: LanguageCode;
};

/** Renders nothing: records the language being studied so `/` reopens it next time. */
export const RememberLanguage = async ({ code }: Props) => {
  await rememberLanguage(code);
  return null;
};
