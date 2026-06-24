'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { StaggerContainer, FadeInUp } from '@/components/motion-transitions'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error boundary caught:', error)
  }, [error])

  return (
    <StaggerContainer className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <FadeInUp className="text-8xl font-bold tracking-tight text-line mb-6 select-none">
        500
      </FadeInUp>
      <FadeInUp 
        className="text-2xl md:text-3xl font-bold text-ink mb-4 tracking-tight"
      >
        Something went wrong
      </FadeInUp>
      <FadeInUp 
        className="text-muted max-w-md mx-auto mb-8"
      >
        An unexpected error occurred. We&apos;ve been notified and are looking into it.
      </FadeInUp>
      <FadeInUp 
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button 
          onClick={() => reset()} 
          className="btn-primary"
        >
          Try Again
        </button>
        <Link href="/collections" className="btn-secondary">
          Return to Collections
        </Link>
      </FadeInUp>
    </StaggerContainer>
  )
}
