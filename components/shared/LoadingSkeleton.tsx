export default function LoadingSkeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card-surface">
      <LoadingSkeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <LoadingSkeleton className="h-3 w-20 rounded" />
        <LoadingSkeleton className="h-5 w-3/4 rounded" />
        <LoadingSkeleton className="h-3 w-full rounded" />
        <LoadingSkeleton className="h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-screen bg-surface animate-pulse flex items-center justify-center">
      <div className="text-center space-y-6">
        <LoadingSkeleton className="h-4 w-40 mx-auto rounded" />
        <LoadingSkeleton className="h-20 w-96 mx-auto rounded" />
        <LoadingSkeleton className="h-4 w-64 mx-auto rounded" />
        <div className="flex gap-4 justify-center">
          <LoadingSkeleton className="h-12 w-36 rounded" />
          <LoadingSkeleton className="h-12 w-36 rounded" />
        </div>
      </div>
    </div>
  );
}
