import Image from 'next/image'
import Link from 'next/link'
import { CollectionItem } from '@/lib/services/collections.service'
import { FadeInUp } from './motion-transitions'

export function CollectionProductCard({ item, index }: { item: CollectionItem; index: number }) {
  const isDarkGround = item.darkGround
  const hasSecondImage = item.images.length > 1

  return (
    <FadeInUp className={`group relative flex flex-col ${item.feature ? 'col-span-full mb-12' : ''}`}>
      {/* NOTE: /product/[id] does not exist yet (see review). Price belongs on that page, not here. */}
      <Link
        href={`/product/${item.id}`}
        className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
      >
        <div
          className="relative w-full overflow-hidden aspect-[4/5] flex items-center justify-center rounded-lg"
          style={{ backgroundColor: isDarkGround ? '#2B2723' : 'transparent' }}
        >
          {/* drop-shadow-2xl removed: the contact shadow is baked into the product photo
              (see the compositing pipeline). A CSS drop shadow fought the flush look. */}
          <div
            className={`absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-[1.02] ${
              hasSecondImage ? 'group-hover:opacity-0 transition-opacity' : ''
            }`}
          >
            {Boolean(item.images[0]) && item.images[0].trim() !== '' ? (
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                className="object-contain p-8 md:p-12"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={item.feature || index < 4}
              />
            ) : null}
          </div>

          {hasSecondImage && Boolean(item.images[1]) && item.images[1].trim() !== '' ? (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.02]">
              <Image
                src={item.images[1]}
                alt={`${item.name}, alternate view`}
                fill
                className="object-contain p-8 md:p-12"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : null}
        </div>

        {/* Label and name only. No price on the collection page. */}
        <div className="mt-6 flex flex-col items-center text-center">
          <span
            className="font-garamond text-[13px] tracking-[0.1em] text-muted mb-2"
            style={{ fontVariant: 'small-caps' }}
          >
            {item.material.replace('-', ' ')}
            {item.weightGrams ? ` · ${item.weightGrams}g` : ''}
          </span>

          <h3 className="font-serif text-xl md:text-2xl text-ink font-medium tracking-wide">
            {item.name}
          </h3>
        </div>
      </Link>
    </FadeInUp>
  )
}
