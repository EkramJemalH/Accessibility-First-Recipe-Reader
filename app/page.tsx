import { Suspense } from 'react'
import { HomePageClient } from './_components/HomePageClient'

/**
 * Home page — Server Component shell.
 * Wraps the client component in Suspense so useSearchParams() works correctly
 * in the Next.js App Router (required when reading search params in a Client Component).
 */
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageClient />
    </Suspense>
  )
}

function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" aria-busy="true" aria-label="Loading recipes">
      {/* Hero skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-10 w-2/3 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded-md bg-muted" />
      </div>
      {/* Filter bar skeleton */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-36 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
