type Props = {
  label: string;
  done: number;
  total: number;
};

/** Cards finished out of the session's cards, as a bar and as numbers. */
export const SessionProgress = ({ label, done, total }: Props) => (
  <div className="flex items-center gap-3">
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className="border-ink bg-card h-4 flex-1 overflow-hidden rounded-full border-2"
    >
      <div
        className="bg-primary h-full transition-[width] motion-reduce:transition-none"
        style={{ width: `${total === 0 ? 0 : (done / total) * 100}%` }}
      />
    </div>
    <p className="text-sm font-bold tabular-nums">
      {done} / {total}
    </p>
  </div>
);
