import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Keyboard shortcut hint, only where there is a fine pointer (a desktop, a keyboard is likely).
 * Hidden from screen readers: the control itself carries `aria-keyshortcuts`.
 */
export const Kbd = ({ children }: Props) => (
  <span aria-hidden="true" className="hidden pointer-fine:inline">
    <kbd className="rounded border border-current/40 px-1 font-sans text-xs leading-4 opacity-80">
      {children}
    </kbd>
  </span>
);
