import type { ReactNode } from "react";
import type { Feedback } from "@/hooks/use-action-feedback";
import { cn } from "@/lib/utils";

type Props = {
  feedback: Feedback | null;
  children: ReactNode;
};

/** Sticky bar of actions on a list, with a status line announcing their outcome. */
export const ActionBar = ({ feedback, children }: Props) => (
  // Above the fixed tab bar on mobile, at the bottom of the window on desktop
  <div className="border-ink bg-card shadow-brutal sticky bottom-[calc(6.5rem+env(safe-area-inset-bottom))] flex flex-wrap items-center gap-3 rounded-2xl border-3 p-3 md:bottom-6">
    {children}
    <p
      role="status"
      className={cn(
        "w-full text-sm font-bold empty:hidden",
        feedback?.kind === "error" && "text-destructive",
      )}
    >
      {feedback?.text}
    </p>
  </div>
);
