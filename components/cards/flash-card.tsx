import type { ReactNode } from "react";

type Props = {
  /** Small label above the content ("New card"). */
  eyebrow?: string;
  children: ReactNode;
};

/** The big card of the study screens (discovery, review). */
export const FlashCard = ({ eyebrow, children }: Props) => (
  <article className="border-ink bg-card shadow-brutal-lg flex min-h-72 flex-col items-center justify-center gap-5 rounded-3xl border-3 p-6 text-center sm:p-10">
    {eyebrow && (
      <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">{eyebrow}</p>
    )}
    {children}
  </article>
);
