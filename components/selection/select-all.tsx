"use client";

import { useId } from "react";
import { SelectionCheckbox } from "@/components/selection/selection-checkbox";

type Props = {
  label: string;
  /** Word after the "x / y" count (e.g. "selected"). */
  selectedLabel: string;
  count: number;
  total: number;
  all: boolean;
  some: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/** "Select all" checkbox with a dash when only some items are ticked, and the "x / y" count. */
export const SelectAll = ({
  label,
  selectedLabel,
  count,
  total,
  all,
  some,
  onCheckedChange,
}: Props) => {
  const labelId = useId();

  return (
    <label className="flex w-fit cursor-pointer items-center gap-3 text-sm font-bold">
      {/* Base UI's checkbox is a <span role="checkbox">: the <label> only names its hidden input */}
      <SelectionCheckbox
        aria-labelledby={labelId}
        checked={all}
        indeterminate={some}
        onCheckedChange={onCheckedChange}
      />
      <span id={labelId}>{label}</span>
      <span className="text-muted-foreground font-normal tabular-nums">
        {count} / {total} {selectedLabel}
      </span>
    </label>
  );
};
