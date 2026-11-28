/** Placeholder of the Review tab while the session loads. */
export const ReviewSkeleton = () => (
  <div aria-busy="true" className="flex flex-col gap-6">
    <div className="bg-muted h-4 animate-pulse rounded-full motion-reduce:animate-none" />
    <div className="bg-muted h-72 animate-pulse rounded-3xl motion-reduce:animate-none" />
    <div className="bg-muted h-12 animate-pulse rounded-lg motion-reduce:animate-none" />
  </div>
);
