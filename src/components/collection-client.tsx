'use client'

import { useState, useCallback } from 'react'
import { CollectionItem, getCollectionItems } from '@/lib/services/collections.service'

import { CollectionProductCard } from './collection-product-card'
import { StaggerContainer } from './motion-transitions'

/**
 * Filter / Sort controls were removed deliberately:
 *  - the dropdown opened on hover only, so it was dead on touch and keyboard,
 *  - the "Filter +" and "View More" buttons were no-ops,
 *  - "Sort: Price" both relied on a hardcoded rate and exposed price, which now
 *    belongs only on the product page.
 * Re-add them here once wired to the real catalogue, with non-price sorts and
 * keyboard/touch-accessible controls.
 */
export function CollectionClient({ initialItems, initialCursor, slug, config }: { initialItems: CollectionItem[]; initialCursor: string | null; slug: string; config?: any }) {
  const isUtilitarian = config?.gridType === 'utilitarian'
  
  const [items, setItems] = useState<CollectionItem[]>(initialItems)
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const loadMore = useCallback(async () => {
    if (!nextCursor || isFetchingMore) return
    setIsFetchingMore(true)
    try {
      const pageData = await getCollectionItems(slug, config, 50, nextCursor)
      setItems(prev => {
        const existingIds = new Set(prev.map(i => i.id))
        const newItems = pageData.items.filter(i => !existingIds.has(i.id))
        return [...prev, ...newItems]
      })
      setNextCursor(pageData.nextCursor)
    } catch (err) {
      console.error("Error fetching more collection items", err)
    } finally {
      setIsFetchingMore(false)
    }
  }, [nextCursor, isFetchingMore, slug, config])

  return (
    <div className="pb-32">
      <div className="max-w-8xl mx-auto px-6">
        <StaggerContainer
          className={`grid grid-cols-1 ${
            isUtilitarian
              ? 'md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'
              : 'md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-32'
          }`}
        >
          {items.map((item, index) => (
            <CollectionProductCard key={item.id} item={item} index={index} />
          ))}
        </StaggerContainer>
      </div>

      {nextCursor ? (
        <div className="mt-24 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isFetchingMore}
            className="px-8 py-3 border border-line rounded-lg bg-field text-ink font-medium tracking-wide hover:bg-band transition-[background-color,transform] active:scale-[0.97] disabled:opacity-50 flex items-center justify-center min-w-[160px]"
          >
            {isFetchingMore ? <div className="w-5 h-5 border-2 border-muted border-t-ink rounded-full animate-spin" /> : 'Load More'}
          </button>
        </div>
      ) : (
        <div className="mt-32 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#a89e93" aria-hidden>
            <path d="M12 1 L13.7 10.3 L23 12 L13.7 13.7 L12 23 L10.3 13.7 L1 12 L10.3 10.3 Z" />
          </svg>
        </div>
      )}
    </div>
  )
}
