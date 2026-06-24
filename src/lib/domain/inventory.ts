import { VariantDetail, Product } from '@/lib/types'
import {
  usesStones,
  usesWeights,
  usesPurity,
} from '@/lib/collections'




export const getSizeMatrix = (item: Partial<Product>) => {
  if (usesStones(item.collection)) return [...(item.standardStones || []), ...(item.customStones || [])]
  if (usesWeights(item.collection)) return [...(item.standardWeights || []), ...(item.customWeights || [])]
  return [...(item.standardSizes || []), ...(item.customSizes || [])]
}

export const getStandardSizeMatrix = (item: Partial<Product>) => {
  if (usesStones(item.collection)) return item.standardStones || []
  if (usesWeights(item.collection)) return item.standardWeights || []
  return item.standardSizes || []
}

export const getCustomSizeMatrix = (item: Partial<Product>) => {
  if (usesStones(item.collection)) return item.customStones || []
  if (usesWeights(item.collection)) return item.customWeights || []
  return item.customSizes || []
}

export type VariantCombo = { key: string; label: string; attrs: VariantDetail }

export const buildVariantCombos = (item: Partial<Product>): VariantCombo[] => {
  if (usesStones(item.collection)) {
    const all = [...(item.standardStones || []), ...(item.customStones || [])]
    return all.map((s) => ({ key: `stone:${s}`, label: s, attrs: { stone: s } }))
  }

  if (usesWeights(item.collection)) {
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

export const buildSearchTerms = (item: Partial<Product>): string[] => {
  const terms = new Set<string>()

  const addPrefixes = (str?: string) => {
    if (!str) return
    const s = str.toLowerCase().trim()
    if (!s) return

    const generateForWordList = (wordList: string[], separator: string) => {
      for (let i = 0; i < wordList.length; i++) {
        const remainingString = wordList.slice(i).join(separator)
        const maxLen = Math.min(remainingString.length, 30)
        for (let len = 2; len <= maxLen; len++) {
          terms.add(remainingString.substring(0, len))
        }
      }
    }

    generateForWordList(s.split(/\s+/), ' ')
    generateForWordList(s.split(/[^a-z0-9]+/).filter(Boolean), ' ')
  }

  addPrefixes(item.name)
  addPrefixes(item.sku)
  addPrefixes(item.id)
  addPrefixes(item.collection)
  addPrefixes(item.material)

  const matrices = [
    ...(item.standardSizes || []), ...(item.customSizes || []),
    ...(item.standardPurities || []), ...(item.customPurities || []),
    ...(item.standardWeights || []), ...(item.customWeights || []),
    ...(item.standardStones || []), ...(item.customStones || []),
  ]
  matrices.forEach((m) => addPrefixes(m))

  if (item.variantSkus) {
    Object.keys(item.variantSkus).forEach((sku) => addPrefixes(sku))
  }

  return Array.from(terms).slice(0, 500)
}
