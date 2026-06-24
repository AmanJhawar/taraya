import { searchInventory } from '@/lib/services/inventory.service'
import { getCollections } from '@/lib/services/collections.service'
import { toCard } from '@/data/collections'
import { CollectionClient } from '@/components/collection-client'
import { FadeInUp, StaggerContainer } from '@/components/motion-transitions'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Results | Taraya',
  description: 'Search results for Taraya collections.',
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : ''
  
  const rawItems = query ? await searchInventory(query) : []
  const collections = await getCollections()

  const items = rawItems.map(p => {
    const config = collections.find(c => c.slug === p.collection)
    return toCard(p, config)
  })

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24">
        <StaggerContainer>
          <FadeInUp className="font-garamond text-xs tracking-[0.1em] text-muted mb-6" style={{ fontVariant: 'small-caps' }}>
            Search Results
          </FadeInUp>
          <FadeInUp className="font-serif text-4xl md:text-6xl text-ink font-medium tracking-wide mb-8">
            {query ? `"${query}"` : 'Search'}
          </FadeInUp>
          <FadeInUp className="font-garamond text-lg md:text-xl text-ink/80 leading-relaxed max-w-2xl mx-auto">
            {items.length === 0 
              ? (query ? 'No matching pieces found in our collection.' : 'Enter a search term to find pieces.') 
              : `${items.length} ${items.length === 1 ? 'result' : 'results'} found`}
          </FadeInUp>
        </StaggerContainer>
      </div>

      {items.length > 0 && (
        <CollectionClient items={items} config={{ gridType: 'utilitarian' } as any} />
      )}
    </div>
  )
}
