/** Placeholder of the language home while its data (counters, decks) streams in. */
export const HomeSkeleton = () => (
  <div aria-busy="true" className="flex flex-col gap-8">
    <div className="bg-muted h-10 w-48 animate-pulse rounded-xl motion-reduce:animate-none" />
    <div className="bg-muted h-40 animate-pulse rounded-2xl motion-reduce:animate-none" />
  </div>
);
