import { notFound } from 'next/navigation'
import { COLLECTIONS_CONFIG, getCollectionItems } from '@/data/collections'
import { CollectionClient } from '@/components/collection-client'
import { FadeInUp, StaggerContainer } from '@/components/motion-transitions'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const collectionParam = (await params).collection
  const config = COLLECTIONS_CONFIG[collectionParam]
  if (!config) return { title: 'Collection Not Found' }
  return { title: `${config.title} | Taraya` }
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const collectionParam = (await params).collection
  const config = COLLECTIONS_CONFIG[collectionParam]
  
  if (!config) {
    notFound()
  }

  const items = await getCollectionItems(collectionParam)

  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24">
        <StaggerContainer>
          <FadeInUp className="font-garamond text-xs tracking-[0.2em] text-muted uppercase mb-6" style={{ fontVariant: 'small-caps' }}>
            {config.eyebrow}
          </FadeInUp>
          <FadeInUp className="font-serif text-4xl md:text-6xl text-ink font-medium tracking-wide mb-8">
            {config.title}
          </FadeInUp>
          <FadeInUp className="font-garamond text-lg md:text-xl text-ink/80 leading-relaxed max-w-2xl mx-auto">
            {config.standfirst}
          </FadeInUp>
        </StaggerContainer>
      </div>

      <CollectionClient items={items} config={config} />
    </div>
  )
}
