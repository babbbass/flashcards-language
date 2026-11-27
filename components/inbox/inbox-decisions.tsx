import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { type InboxMove, type InboxView, movesOf } from "@/lib/inbox/views";
import { cn } from "@/lib/utils";

type Props = {
  view: InboxView;
  /** Number of ticked cards, shown on each button. */
  count: number;
  pending: boolean;
  labels: Dictionary["inbox"]["list"]["decisions"];
  onDecide: (move: InboxMove) => void;
};

/** The moves allowed from the current list; the first one is the main action. */
export const InboxDecisions = ({ view, count, pending, labels, onDecide }: Props) =>
  movesOf(view).map((move, index) => (
    <Button
      key={move.decision}
      size="lg"
      variant={index === 0 ? "default" : "outline"}
      className={cn(index === 0 && "flex-1")}
      disabled={pending || count === 0}
      onClick={() => onDecide(move)}
    >
      {labels[move.decision]} ({count})
    </Button>
  ));
