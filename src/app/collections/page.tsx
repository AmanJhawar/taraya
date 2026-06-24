import { getCollections } from '@/lib/services/collections.service'
import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp, StaggerContainer } from '@/components/motion-transitions'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections | Taraya',
  description: 'Explore our curated collections of silver idols, bullion, and stone-set frames.',
}

export default async function CollectionsIndexPage() {
  const collections = await getCollections()

  return (
    <div className="pt-24 pb-32 min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-24 md:mb-32">
        <StaggerContainer>
          <FadeInUp className="font-garamond text-xs tracking-[0.1em] text-muted mb-6" style={{ fontVariant: 'small-caps' }}>
            The Archives
          </FadeInUp>
          <FadeInUp className="font-serif text-4xl md:text-6xl text-ink font-medium tracking-wide mb-8">
            Collections
          </FadeInUp>
          <FadeInUp className="font-garamond text-lg md:text-xl text-ink/80 leading-relaxed max-w-2xl mx-auto">
            A curated index of our available forms, spanning divine idols to investment bullion.
          </FadeInUp>
        </StaggerContainer>
      </div>

      {/* Collections Grid */}
      <div className="max-w-8xl mx-auto px-6">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-32">
          {collections.map((config, index) => (
            <FadeInUp key={config.slug} className="group relative flex flex-col">
              <Link href={`/collections/${config.slug}`} className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-ink">
                {/* Image Plate */}
                <div 
                  className="relative w-full overflow-hidden aspect-[4/5] flex items-center justify-center transition-transform duration-700 ease-[var(--ease-out)]"
                  style={{ backgroundColor: config.darkGround ? '#2B2723' : 'transparent' }}
                >
                  <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-[1.02]">
                    <Image
                      src={config.image}
                      alt={config.title}
                      fill
                      className="object-contain p-12"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-8 flex flex-col items-center text-center">
                  <span className="font-garamond text-[13px] tracking-[0.1em] text-muted mb-3 transition-opacity duration-500 md:opacity-70 md:group-hover:opacity-100" style={{ fontVariant: 'small-caps' }}>
                    {config.eyebrow}
                  </span>
                  
                  <h3 className="font-serif text-2xl md:text-3xl text-ink font-medium tracking-wide transition-opacity duration-500 md:opacity-90 md:group-hover:opacity-100 mb-4">
                    {config.title}
                  </h3>
                  
                  <p className="font-garamond text-lg text-muted max-w-sm mx-auto transition-opacity duration-500 md:opacity-70 md:group-hover:opacity-100">
                    {config.standfirst}
                  </p>
                </div>
              </Link>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </div>
  )
}
