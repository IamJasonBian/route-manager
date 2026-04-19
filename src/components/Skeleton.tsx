export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[var(--surface-2)] rounded ${className}`}
      aria-hidden
    />
  );
}

export function ProposalCardSkeleton() {
  return (
    <div className="rounded-lg p-5 bg-[var(--surface-1)] border border-[var(--border)] shadow-[var(--shadow-xs)]">
      <div className="flex justify-between gap-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-1/3 mt-3" />
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-3/4 mt-3" />
    </div>
  );
}

export function ProposalGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProposalCardSkeleton key={i} />
      ))}
    </div>
  );
}
