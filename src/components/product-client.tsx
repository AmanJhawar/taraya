'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOptimizedUrl, resolveGallery } from '@/lib/utils'
import { usesStones, usesWeights, usesPurity } from '@/lib/services/collections.service'
import type { Product } from '@/lib/domain/types'
import type { CollectionConfig } from '@/lib/domain/collections'
import { ProtectedImage } from '@/components/protected-image'
import { useCart } from '@/components/cart-provider'
import { FadeInUp, EASE_OUT } from '@/components/motion-transitions'

interface ProductClientProps {
  product: Product
  config?: CollectionConfig
}

export function ProductClient({ product, config }: ProductClientProps) {
  const { addToCart, setIsCartOpen } = useCart()

  const isStones = usesStones(config)
  const isWeights = usesWeights(config)
  const isPurityConfig = usesPurity(config)

  // Collect available options
  const availableSizes = useMemo(() => Array.from(new Set([
    ...(product.standardSizes || []),
    ...(product.customSizes || [])
  ])), [product])

  const availableStones = useMemo(() => Array.from(new Set([
    ...(product.standardStones || []),
    ...(product.customStones || [])
  ])), [product])

  const availableWeights = useMemo(() => Array.from(new Set([
    ...(product.standardWeights || []),
    ...(product.customWeights || [])
  ])), [product])

  const availablePurities = useMemo(() => Array.from(new Set([
    ...(product.standardPurities || []),
    ...(product.customPurities || [])
  ])), [product])

  // Selections
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '')
  const [selectedStone, setSelectedStone] = useState<string>(availableStones[0] || '')
  const [selectedWeight, setSelectedWeight] = useState<string>(availableWeights[0] || '')
  const [selectedPurity, setSelectedPurity] = useState<string>(availablePurities[0] || '')

  // Resolve matching SKU
  const resolvedSku = useMemo(() => {
    if (!product.hasVariants || !product.variantSkus) return product.sku
    const skus = Object.entries(product.variantSkus)
    const match = skus.find(([sku, detail]) => {
      let matches = true
      if (isStones && detail.stone !== selectedStone) matches = false
      else if (isWeights && detail.weight !== selectedWeight) matches = false
      else if (!isStones && !isWeights && detail.size !== selectedSize) matches = false
      if (isPurityConfig && detail.purity !== selectedPurity) matches = false
      return matches
    })
    return match ? match[0] : product.sku
  }, [product, isStones, isWeights, isPurityConfig, selectedSize, selectedStone, selectedWeight, selectedPurity])

  // Gallery
  const gallery = useMemo(() => resolveGallery(product, resolvedSku, config), [product, resolvedSku, config])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const activeImage = gallery[activeImageIndex] || gallery[0]

  const handleAddToCart = () => {
    addToCart({
      cartId: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      sku: resolvedSku,
      imageFile: activeImage,
      quantity: 1,
      selectedSize: (!isStones && !isWeights && product.hasVariants) ? selectedSize : undefined,
      selectedPurity: (isPurityConfig && product.hasVariants) ? selectedPurity : undefined,
      selectedStone: (isStones && product.hasVariants) ? selectedStone : undefined,
      selectedWeight: (isWeights && product.hasVariants) ? selectedWeight : undefined,
      weight: product.weight
    })
    setIsCartOpen(true)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
      {/* ── Gallery ── */}
      <div className="flex flex-col gap-4 relative">
        <div className="aspect-[4/5] bg-band rounded-lg overflow-hidden relative border border-line">
          <AnimatePresence mode="wait">
            {activeImage && (
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, transform: "scale(0.97)" }}
                animate={{ opacity: 1, transform: "scale(1)" }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="absolute inset-0 w-full h-full"
              >
                <ProtectedImage
                  src={getOptimizedUrl(activeImage, 1600)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {gallery.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {gallery.map((img, idx) => (
              <button
                key={img}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors duration-200 active:scale-[0.97] ${
                  idx === activeImageIndex ? 'border-ink' : 'border-transparent hover:border-line'
                }`}
              >
                <ProtectedImage
                  src={getOptimizedUrl(img, 400)}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <FadeInUp className="flex flex-col pt-4 md:pt-12 pb-12">
        <div className="flex flex-col mb-8">
          <p className="text-[13px] font-medium small-caps tracking-[0.1em] text-muted mb-4">{config?.eyebrow || config?.title || 'Collection'}</p>
          <h1 className="text-4xl lg:text-5xl font-display font-medium text-ink leading-[1.1] tracking-tight mb-4 uppercase">{product.name}</h1>
          <p className="text-sm font-medium text-muted tracking-wide font-mono uppercase">{resolvedSku}</p>
        </div>

        {product.description && (
          <div className="prose prose-sm md:prose-base prose-zinc text-ink/80 mb-10 leading-relaxed font-body">
            <p>{product.description}</p>
          </div>
        )}

        <div className="h-px w-full bg-line mb-10" />

        {/* ── Variants ── */}
        {product.hasVariants && (
          <div className="flex flex-col gap-8 mb-12">
            {isStones && availableStones.length > 0 && (
              <VariantSelector
                label="Stone"
                options={availableStones}
                selected={selectedStone}
                onSelect={setSelectedStone}
              />
            )}
            
            {isWeights && availableWeights.length > 0 && (
              <VariantSelector
                label="Weight"
                options={availableWeights}
                selected={selectedWeight}
                onSelect={setSelectedWeight}
              />
            )}

            {!isStones && !isWeights && availableSizes.length > 0 && (
              <VariantSelector
                label="Size"
                options={availableSizes}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
            )}

            {isPurityConfig && availablePurities.length > 0 && (
              <VariantSelector
                label="Purity"
                options={availablePurities}
                selected={selectedPurity}
                onSelect={setSelectedPurity}
              />
            )}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full py-4 px-6 bg-ink text-field text-[13px] tracking-[0.1em] font-medium uppercase transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97] rounded-lg flex items-center justify-center gap-3"
        >
          Add to Inquiry
        </button>
        
        {product.weight && (
          <p className="mt-8 text-[13px] font-medium small-caps tracking-[0.1em] text-muted text-center">
            Reference Weight: {product.weight}g
          </p>
        )}
      </FadeInUp>
    </div>
  )
}

function VariantSelector({ 
  label, 
  options, 
  selected, 
  onSelect 
}: { 
  label: string, 
  options: string[], 
  selected: string, 
  onSelect: (v: string) => void 
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium small-caps tracking-[0.1em] text-ink">{label}</label>
      </div>
      <div className="flex flex-wrap gap-3">
        {options.map(opt => {
          const isActive = selected === opt
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`min-w-[3rem] px-4 py-2.5 text-sm font-medium tracking-wide rounded-lg transition-[background-color,color,border-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] ${
                isActive 
                  ? 'bg-ink text-field border border-ink' 
                  : 'bg-transparent text-ink border border-line hover:border-ink/30'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
