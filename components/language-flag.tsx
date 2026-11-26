import Image, { type StaticImageData } from "next/image";
import esFlag from "@/assets/svg/flags/es.svg";
import gbFlag from "@/assets/svg/flags/gb.svg";
import type { LanguageCode } from "@/lib/languages";
import { cn } from "@/lib/utils";

/*
 * Language → flag. Flag files are named by ISO 3166-1 country code (gb, es),
 * not by language code, since a language can map to several countries.
 * Typed as a Record over LanguageCode: adding a language without its flag fails the typecheck.
 */
const FLAGS: Record<LanguageCode, StaticImageData> = {
  en: gbFlag,
  es: esFlag,
};

type Props = {
  code: LanguageCode;
  className?: string;
};

/** Circular flag icon. Decorative (empty alt): always pair it with the language name. */
export const LanguageFlag = ({ code, className }: Props) => (
  <span
    className={cn(
      "border-ink inline-flex size-5 shrink-0 overflow-hidden rounded-full border-2",
      className,
    )}
  >
    <Image src={FLAGS[code]} alt="" className="size-full object-cover" />
  </span>
);
