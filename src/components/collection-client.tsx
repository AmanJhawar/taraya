'use client'

import { useState } from 'react'
import { CollectionItem, CollectionConfig } from '@/data/collections'
import { CollectionProductCard } from './collection-product-card'
import { StaggerContainer } from './motion-transitions'

export function CollectionClient({ items, config }: { items: CollectionItem[]; config: CollectionConfig }) {
  const [sortBy, setSortBy] = useState('Newest')
  
  // Minimal client-side sort
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'Price: Low to High') {
      const priceA = a.price || (a.weightGrams ? a.weightGrams * 92.5 + (a.makingPremium||0) : 999999)
      const priceB = b.price || (b.weightGrams ? b.weightGrams * 92.5 + (b.makingPremium||0) : 999999)
      return priceA - priceB
    }
    return 0 // default 'Newest'
  })

  return (
    <div className="pb-32">
      {/* Filter / Sort Row */}
      <div className="max-w-8xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-center md:justify-end border-t border-line pt-6">
          <div className="flex gap-8">
            <button className="font-garamond text-xs text-muted tracking-widest uppercase hover:text-ink transition-colors">
              Filter +
            </button>
            <div className="relative group">
              <button className="font-garamond text-xs text-muted tracking-widest uppercase hover:text-ink transition-colors flex gap-2 items-center">
                Sort: {sortBy}
              </button>
              <div className="absolute right-0 top-full mt-2 bg-field border border-line py-2 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <button onClick={() => setSortBy('Newest')} className="block font-garamond text-xs text-muted tracking-widest uppercase hover:text-ink py-2 whitespace-nowrap">Newest</button>
                <button onClick={() => setSortBy('Price: Low to High')} className="block font-garamond text-xs text-muted tracking-widest uppercase hover:text-ink py-2 whitespace-nowrap">Price: Low to High</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-8xl mx-auto px-6">
        <StaggerContainer 
          className={`grid grid-cols-1 ${config.gridType === 'utilitarian' ? 'md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16' : 'md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-32'}`}
        >
          {sortedItems.map((item, index) => (
            <CollectionProductCard key={item.id} item={item} index={index} />
          ))}
        </StaggerContainer>
      </div>

      {/* View More */}
      <div className="mt-32 flex flex-col items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#a89e93" className="mb-12">
          <path d="M12 1 L13.7 10.3 L23 12 L13.7 13.7 L12 23 L10.3 13.7 L1 12 L10.3 10.3 Z" />
        </svg>
        <button className="font-garamond text-xs tracking-widest text-muted hover:text-ink transition-colors uppercase">
          View More
        </button>
      </div>
    </div>
  )
}
