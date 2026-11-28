"use client";

import { useEffect, useRef } from "react";
import { ActionBar } from "@/components/action-bar";
import { CardDetails } from "@/components/cards/card-details";
import { CardTerm } from "@/components/cards/card-term";
import { CardTranslation } from "@/components/cards/card-translation";
import { FlashCard } from "@/components/cards/flash-card";
import { Kbd } from "@/components/kbd";
import { Button } from "@/components/ui/button";
import { useHotkeys } from "@/hooks/use-hotkeys";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { LanguageCode } from "@/lib/languages";
import type { SessionCard } from "@/lib/review/queries";

type Props = {
  card: SessionCard;
  code: LanguageCode;
  nativeLanguage: string;
  strings: Dictionary["review"]["session"];
  onDone: () => void;
};

/** A card picked in the Inbox, shown in full once before its first review. */
export const DiscoveryCard = ({ card, code, nativeLanguage, strings, onDone }: Props) => {
  const doneRef = useRef<HTMLButtonElement>(null);
  // Each new card puts the keyboard on its main action
  useEffect(() => doneRef.current?.focus(), []);
  useHotkeys({ " ": onDone, Enter: onDone });

  return (
    <>
      <FlashCard eyebrow={strings.discover.eyebrow}>
        <CardTerm card={card} code={code} />
        <CardTranslation translation={card.translation} nativeLanguage={nativeLanguage} />
        <CardDetails card={card} code={code} nativeLanguage={nativeLanguage} labels={strings} />
      </FlashCard>
      <ActionBar>
        <Button
          ref={doneRef}
          size="lg"
          className="h-12 flex-1 text-base"
          aria-keyshortcuts="Space Enter"
          onClick={onDone}
        >
          {strings.discover.cta}
          <Kbd>{strings.spaceKey}</Kbd>
        </Button>
      </ActionBar>
    </>
  );
};
