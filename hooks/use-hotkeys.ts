import { useEffect, useEffectEvent } from "react";

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Space or Enter on a focused button or link already activates it natively. */
const activatesTarget = (event: KeyboardEvent) =>
  (event.key === " " || event.key === "Enter") &&
  event.target instanceof Element &&
  event.target.closest("button, a, [role=button], [role=checkbox]") !== null;

/**
 * Page-wide keyboard shortcuts, keyed by `KeyboardEvent.key` (" " for Space, "1"…).
 * Ignored while typing, with a modifier held (browser shortcuts stay free), on key repeat,
 * and when the key would already activate the focused control.
 */
export const useHotkeys = (keys: Partial<Record<string, () => void>>) => {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const action = keys[event.key];
    if (
      !action ||
      event.repeat ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      isEditable(event.target) ||
      activatesTarget(event)
    ) {
      return;
    }
    event.preventDefault();
    action();
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
};
