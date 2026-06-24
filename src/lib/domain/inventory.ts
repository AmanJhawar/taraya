import { VariantDetail, Product } from '@/lib/domain/types'
import {
  usesStones,
  usesWeights,
  usesPurity,
} from '@/lib/services/collections.service'
import type { CollectionConfig } from '@/lib/domain/collections'




export const getSizeMatrix = (item: Partial<Product>, config?: CollectionConfig) => {
  if (usesStones(config)) return [...(item.standardStones || []), ...(item.customStones || [])]
  if (usesWeights(config)) return [...(item.standardWeights || []), ...(item.customWeights || [])]
  return [...(item.standardSizes || []), ...(item.customSizes || [])]
}

export const getStandardSizeMatrix = (item: Partial<Product>, config?: CollectionConfig) => {
  if (usesStones(config)) return item.standardStones || []
  if (usesWeights(config)) return item.standardWeights || []
  return item.standardSizes || []
}

export const getCustomSizeMatrix = (item: Partial<Product>, config?: CollectionConfig) => {
  if (usesStones(config)) return item.customStones || []
  if (usesWeights(config)) return item.customWeights || []
  return item.customSizes || []
}

export type VariantCombo = { key: string; label: string; attrs: VariantDetail }

export const buildVariantCombos = (item: Partial<Product>, config?: CollectionConfig): VariantCombo[] => {
  if (usesStones(config)) {
    const all = [...(item.standardStones || []), ...(item.customStones || [])]
    return all.map((s) => ({ key: `stone:${s}`, label: s, attrs: { stone: s } }))
  }

  if (usesWeights(config)) {
    const all = [...(item.standardWeights || []), ...(item.customWeights || [])]
    return all.map((w) => ({ key: `weight:${w}`, label: w, attrs: { weight: w } }))
  }

  const sizes = [...(item.standardSizes || []), ...(item.customSizes || [])]
  const purities = [...(item.standardPurities || []), ...(item.customPurities || [])]
  if (sizes.length === 0 || purities.length === 0) return []

  const combos: VariantCombo[] = []
  sizes.forEach((s) =>
    purities.forEach((p) =>
      combos.push({ key: `size:${s}|purity:${p}`, label: `${s} | ${p}`, attrs: { size: s, purity: p } })
    )
  )
  return combos
}

