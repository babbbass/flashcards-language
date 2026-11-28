"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  text: string;
  /** Main way out (home, Inbox). */
  link: { href: string; label: string };
  /** Cards that became due meanwhile, when they can be loaded now. */
  more: { count: number; label: string; onClick: () => void } | null;
  /** Put the keyboard on the title: only when a session just ended, not on page load. */
  focusTitle: boolean;
};

/** End of the queue: nothing was due, or the session is complete. */
export const SessionEnd = ({ title, text, link, more, focusTitle }: Props) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  // The last card's buttons are gone: keyboard and screen reader land on the outcome
  useEffect(() => {
    if (focusTitle) {
      titleRef.current?.focus();
    }
  }, [focusTitle]);

  return (
    <section className="border-ink bg-card shadow-brutal flex flex-col gap-4 rounded-2xl border-3 p-6">
      <h2 ref={titleRef} tabIndex={-1} className="text-2xl outline-none">
        {title}
      </h2>
      <p className="text-muted-foreground">{text}</p>
      <div className="flex flex-wrap gap-3">
        {more && (
          <Button size="lg" onClick={more.onClick}>
            {more.label} ({more.count})
          </Button>
        )}
        <Button size="lg" variant="outline" nativeButton={false} render={<Link href={link.href} />}>
          {link.label}
        </Button>
      </div>
    </section>
  );
};
