"use client";

export function SkeletonLine({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <div className="skeleton rounded-lg" style={{ width, height }} />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass border-white/5 p-4 rounded-xl space-y-3">
      <SkeletonLine width="40%" height="0.75rem" />
      <SkeletonLine width="100%" height="1rem" />
      <SkeletonLine width="75%" height="1rem" />
      <div className="flex gap-2">
        <SkeletonLine width="30%" height="1.5rem" />
        <SkeletonLine width="30%" height="1.5rem" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
