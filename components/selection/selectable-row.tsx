"use client";

import { type ReactNode, useId } from "react";
import { SelectionCheckbox } from "@/components/selection/selection-checkbox";
import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Row content; put `ids.label` on the text naming the item, `ids.description` on its details. */
  children: (ids: { label: string; description: string }) => ReactNode;
};

/**
 * A whole row that ticks its checkbox when clicked. Base UI's checkbox is a
 * <span role="checkbox">, so the row hands the content the ids that name and describe it.
 */
export const SelectableRow = ({ checked, onCheckedChange, children }: Props) => {
  const id = useId();
  const ids = { label: `${id}-label`, description: `${id}-description` };

  return (
    <label
      className={cn(
        "border-ink bg-card flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors",
        "has-data-checked:bg-muted has-data-checked:shadow-brutal-sm hover:bg-muted/60",
      )}
    >
      <SelectionCheckbox
        aria-labelledby={ids.label}
        aria-describedby={ids.description}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      {children(ids)}
    </label>
  );
};
