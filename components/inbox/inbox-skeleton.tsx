const ROWS = 5;

/** Placeholder of the Inbox while its cards stream in. */
export const InboxSkeleton = () => (
  <div aria-busy="true" className="flex flex-col gap-4">
    <div className="bg-muted h-9 w-56 animate-pulse rounded-full motion-reduce:animate-none" />
    <div className="bg-muted h-5 w-full animate-pulse rounded-lg motion-reduce:animate-none" />
    {Array.from({ length: ROWS }, (_, index) => (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders, never reordered
        key={index}
        className="bg-muted h-18 animate-pulse rounded-xl motion-reduce:animate-none"
      />
    ))}
  </div>
);
