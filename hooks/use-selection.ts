import { useState } from "react";

/**
 * Ticked items of a list, unticked by default. Ids that leave the list (sorted in another tab,
 * refreshed) drop out of the selection on their own: `selected` is always a subset of `ids`.
 */
export const useSelection = (ids: readonly string[]) => {
  const [ticked, setTicked] = useState<ReadonlySet<string>>(new Set());

  const selected = ids.filter((id) => ticked.has(id));

  const toggle = (id: string, checked: boolean) =>
    setTicked((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });

  return {
    selected,
    isSelected: (id: string) => ticked.has(id),
    toggle,
    toggleAll: (checked: boolean) => setTicked(checked ? new Set(ids) : new Set()),
    clear: () => setTicked(new Set()),
    all: ids.length > 0 && selected.length === ids.length,
    some: selected.length > 0 && selected.length < ids.length,
  };
};
