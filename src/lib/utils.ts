import { Product } from './domain/types'
import { usesStones, usesWeights } from '@/lib/services/collections.service'
import type { CollectionConfig } from '@/lib/domain/collections'

/**
 * Resolves the ordered gallery of image URLs for a product given an optional
 * selected variant. Behaviour differs by category:
 *
 * - Collections with stones or weights (like idols or bullion): full gallery override — if variantImages has
 *   an entry for the selected variant, show only those images.
 * - Standard sizes (and anything else): partial override — replace only the
 *   last image in the default gallery with the variant's override image.
 *
 * Falls back to the default gallery ([imageFile, ...additionalImages]) when no
 * variant is selected or no override is defined for the selected variant.
 */
export function resolveGallery(item: Product, selectedVariant?: string, config?: CollectionConfig): string[] {
  const defaultGallery = [item.imageFile, ...(item.additionalImages ?? [])].filter(Boolean)

  if (!selectedVariant || !item.variantImages?.[selectedVariant]?.length) {
    return defaultGallery
  }

  const overrideImages = item.variantImages[selectedVariant]
  const isFullOverride = usesStones(config) || usesWeights(config)

  if (isFullOverride) {
    return overrideImages
  }

  // Silver Articles: swap only the last slide
  const override = overrideImages[0]
  if (!override || defaultGallery.length === 0) return defaultGallery
  return [...defaultGallery.slice(0, -1), override]
}

/**
 * Injects Cloudinary transformations (auto format, auto quality, width constraint)
 * into a secure URL. Also handles fallback pathing for local/legacy images.
 */
export function getOptimizedUrl(url?: string, width = 1600): string {
  if (!url) return ''
  const trimmed = url.trim()
  
  // Apply Cloudinary transformations if it's a raw Cloudinary URL
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/upload/') && !trimmed.includes('/upload/f_')) {
    return trimmed.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
  }
  
  // Return the URL as-is if absolute, otherwise prefix with /assets/
  return trimmed.startsWith('http') ? trimmed : `/assets/${trimmed}`
}
