export default function StockLoading() {
  return (
    <div className="min-h-screen bg-ink p-4 space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 w-full rounded bg-ink-surface border border-ink-line p-4 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-ink-raised rounded" />
          <div className="h-4 w-48 bg-ink-raised rounded" />
        </div>
        <div className="h-10 w-40 bg-ink-raised rounded" />
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-32 rounded bg-ink-surface border border-ink-line" />
          <div className="h-48 rounded bg-ink-surface border border-ink-line" />
          <div className="h-80 rounded bg-ink-surface border border-ink-line" />
        </div>
        <div className="space-y-4">
          <div className="h-64 rounded bg-ink-surface border border-ink-line" />
          <div className="h-64 rounded bg-ink-surface border border-ink-line" />
        </div>
      </div>
    </div>
  );
}