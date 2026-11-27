import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  active: boolean;
  children: ReactNode;
};

/** A chip-shaped link of the Inbox filters (list switch, decks). The current one is filled. */
export const FilterLink = ({ href, active, children }: Props) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    // Filters keep the scroll position: the list is right below them
    scroll={false}
    className={cn(
      "border-ink focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-sm font-bold whitespace-nowrap outline-none focus-visible:ring-4",
      active ? "bg-primary text-primary-foreground shadow-brutal-sm" : "bg-card hover:bg-muted",
    )}
  >
    {children}
  </Link>
);
