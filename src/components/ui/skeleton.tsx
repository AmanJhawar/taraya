import { cn } from './cn'

export interface SkeletonProps {
  className?: string
}

/**
 * A single placeholder block. Size it with the className (h-*, w-*, aspect-*).
 * Decorative, so it is hidden from assistive tech; the loading announcement
 * belongs on the container (see ProductGridSkeleton).
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('bg-line/70 motion-safe:animate-pulse', className)} />
}

/** Placeholder shaped like a collection product card. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="mt-6 flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-44" />
      </div>
    </div>
  )
}

export interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

/** Drop-in loading state for the collection grid, with an accessible status. */
export function ProductGridSkeleton({ count = 6, className }: ProductGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn('grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-32', className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading collection</span>
    </div>
  )
}
