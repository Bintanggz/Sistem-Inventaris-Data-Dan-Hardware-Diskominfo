export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      </div>
      <div className="skeleton h-3 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-4 flex-1" style={{ maxWidth: j === 0 ? '80px' : undefined }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatCards({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="skeleton w-12 h-5 rounded-full" />
          </div>
          <div className="skeleton h-7 w-16" />
          <div className="skeleton h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
