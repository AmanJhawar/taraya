import Image from 'next/image'
import Link from 'next/link'
import { CollectionItem, getLiveSilverRate } from '@/data/collections'
import { FadeInUp } from './motion-transitions'

export function CollectionProductCard({ item, index }: { item: CollectionItem; index: number }) {
  const isDarkGround = item.material === 'silver' || item.material === 'bullion'
  
  // Pricing computation
  let priceDisplay = 'Price on request'
  if (item.priceType === 'fixed' && item.price) {
    priceDisplay = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)
  } else if (item.priceType === 'by-weight' && item.weightGrams) {
    const liveRate = getLiveSilverRate()
    const computedPrice = (item.weightGrams * liveRate) + (item.makingPremium || 0)
    priceDisplay = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(computedPrice)
  }

  const hasSecondImage = item.images.length > 1

  return (
    <FadeInUp 
      className={`group relative flex flex-col ${item.feature ? 'col-span-full mb-12' : ''}`}
    >
      <Link href={`/product/${item.id}`} className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-ink">
        {/* Image Container */}
        <div 
          className="relative w-full overflow-hidden aspect-[4/5] flex items-center justify-center transition-transform duration-700 ease-[var(--ease-out)]"
          style={{ backgroundColor: isDarkGround ? '#2B2723' : 'transparent' }}
        >
          {/* Primary Image */}
          <div className={`absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-[1.02] ${hasSecondImage ? 'group-hover:opacity-0 transition-opacity' : ''}`}>
            <Image
              src={item.images[0]}
              alt={item.name}
              fill
              className="object-contain p-8 md:p-12 drop-shadow-2xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={item.feature || index < 4}
            />
          </div>

          {/* Secondary Image (Hover) */}
          {hasSecondImage && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.02]">
              <Image
                src={item.images[1]}
                alt={`${item.name} alternate view`}
                fill
                className="object-contain p-8 md:p-12 drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-6 flex flex-col items-center text-center">
          <span className="font-garamond text-[11px] tracking-[0.1em] text-muted mb-2 transition-opacity duration-500 md:opacity-70 md:group-hover:opacity-100" style={{ fontVariant: 'small-caps' }}>
            {item.material.replace('-', ' ')} {item.weightGrams ? `· ${item.weightGrams}g` : ''}
          </span>
          
          <h3 className="font-serif text-lg md:text-xl text-ink font-medium tracking-wide transition-opacity duration-500 md:opacity-90 md:group-hover:opacity-100">
            {item.name}
          </h3>
          
          <span className="font-garamond text-sm text-muted mt-2 transition-opacity duration-500 md:opacity-70 md:group-hover:opacity-100" style={{ fontVariant: 'small-caps' }}>
            {priceDisplay}
          </span>
        </div>
      </Link>
    </FadeInUp>
  )
}
