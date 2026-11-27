import type { ComponentProps } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Checkbox>;

/** The project's list checkbox: bigger, with the neo-brutalist ink border. */
export const SelectionCheckbox = ({ className, ...props }: Props) => (
  <Checkbox className={cn("border-ink size-5 border-2", className)} {...props} />
);
