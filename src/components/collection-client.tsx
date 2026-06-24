'use client'

import { CollectionItem, CollectionConfig } from '@/data/collections'
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
export function CollectionClient({ items, config }: { items: CollectionItem[]; config?: CollectionConfig }) {
  const isUtilitarian = config?.gridType === 'utilitarian'
  
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

      {/* Quiet end-mark */}
      <div className="mt-32 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#a89e93" aria-hidden>
          <path d="M12 1 L13.7 10.3 L23 12 L13.7 13.7 L12 23 L10.3 13.7 L1 12 L10.3 10.3 Z" />
        </svg>
      </div>
    </div>
  )
}
