import "server-only";
import { requireUser } from "@/lib/auth/current-user";
import type { LanguageCode } from "@/lib/languages";
import { prisma } from "@/lib/prisma";

/**
 * Stores the language the user is studying, so `/` reopens it next time.
 * Writes only when it changed (visiting pages of the same language costs a read).
 */
export const rememberLanguage = async (code: LanguageCode) => {
  const user = await requireUser();
  if (user.lastLanguageCode === code) {
    return;
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastLanguageCode: code } });
};
