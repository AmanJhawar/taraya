import { notFound } from 'next/navigation'
import { getCollectionItems } from '@/data/collections'
import { getCollectionBySlug, getCollections } from '@/lib/services/collections.service'
import { CollectionClient } from '@/components/collection-client'
import { FadeInUp, StaggerContainer } from '@/components/motion-transitions'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const collections = await getCollections()
  return collections.map((c) => ({
    collection: c.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const collectionParam = (await params).collection
  const config = await getCollectionBySlug(collectionParam)
  if (!config) return { title: 'Collection Not Found' }
  return { title: `${config.title} | Taraya` }
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const collectionParam = (await params).collection
  const config = await getCollectionBySlug(collectionParam)
  
  if (!config) {
    notFound()
  }

  const items = await getCollectionItems(collectionParam)

  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24">
        <StaggerContainer>
          <FadeInUp className="font-garamond text-xs tracking-[0.1em] text-muted mb-6" style={{ fontVariant: 'small-caps' }}>
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
