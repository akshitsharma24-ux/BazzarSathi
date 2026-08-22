export function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="h-5 w-40 rounded skeleton-shimmer" />
        <div className="h-4 w-20 rounded skeleton-shimmer" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 rounded skeleton-shimmer" />
            <div className="h-8 w-14 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-ink-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 rounded skeleton-shimmer" />
            <div className="h-4 w-12 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Spinner({ label }) {
  return (
    <div className="flex items-center gap-2 text-ink-400 text-sm">
      <span className="inline-block w-4 h-4 border-2 border-ink-200 border-t-saathi-600 rounded-full animate-spin" />
      {label}
    </div>
  );
}
