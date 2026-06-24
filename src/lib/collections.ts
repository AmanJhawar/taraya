// Single source of truth for the storefront collections.
// Nav, variant model and ground all derive from here, so nothing is inferred
// from a free-text string any more.

export type Collection = 'idols' | 'auspicious-animals' | 'coins-and-bars' | 'frames'
export type VariantModel = 'sizes-purity' | 'stones' | 'weights'
export type Material = 'silver' | 'stone-set' | 'bullion'

export interface CollectionConfig {
  slug: Collection
  eyebrow: string
  title: string
  standfirst: string
  image: string
  gridType: 'sparse' | 'utilitarian'
  variantModel: VariantModel
  darkGround: boolean
  material: Material
}

export const COLLECTIONS: Record<Collection, CollectionConfig> = {
  'idols': {
    slug: 'idols',
    eyebrow: 'Divine Idols',
    title: 'Forms of the Divine',
    standfirst: 'Silver idols, crafted with reverence and made to be handed down through generations.',
    image: '/assets/silver-ganesha.png',
    gridType: 'sparse',
    variantModel: 'sizes-purity',
    darkGround: true,
    material: 'silver',
  },
  'auspicious-animals': {
    slug: 'auspicious-animals',
    eyebrow: 'Auspicious Animals',
    title: 'Symbols of Prosperity',
    standfirst: 'Elephants, peacocks and the sacred cow, rendered in solid silver for the home.',
    image: '/assets/silver-elephant.png',
    gridType: 'sparse',
    variantModel: 'sizes-purity',
    darkGround: true,
    material: 'silver',
  },
  'coins-and-bars': {
    slug: 'coins-and-bars',
    eyebrow: 'Coins & Bars',
    title: 'Coins & Bars',
    standfirst: 'Silver bullion struck to a high assay standard, set aside for the hands that come after.',
    image: '/assets/logo.png',
    gridType: 'utilitarian',
    variantModel: 'weights',
    darkGround: true,
    material: 'bullion',
  },
  'frames': {
    slug: 'frames',
    eyebrow: 'Stone-Set Frames',
    title: 'Stone & Silver',
    standfirst: 'Frames cut from stone, each chosen for the way it holds the light.',
    image: '/assets/marble-photoframe.png',
    gridType: 'sparse',
    variantModel: 'stones',
    darkGround: false,
    material: 'stone-set',
  },
}

export const COLLECTION_LIST: CollectionConfig[] = Object.values(COLLECTIONS)
export const COLLECTION_SLUGS = Object.keys(COLLECTIONS) as Collection[]

export function isCollection(value: unknown): value is Collection {
  return typeof value === 'string' && value in COLLECTIONS
}

export function variantModelOf(collection?: Collection): VariantModel | undefined {
  return collection ? COLLECTIONS[collection]?.variantModel : undefined
}

export function usesStones(collection?: Collection): boolean {
  return variantModelOf(collection) === 'stones'
}

export function usesWeights(collection?: Collection): boolean {
  return variantModelOf(collection) === 'weights'
}

export function usesPurity(collection?: Collection): boolean {
  return variantModelOf(collection) === 'sizes-purity'
}

export function materialOf(collection?: Collection): Material | undefined {
  return collection ? COLLECTIONS[collection]?.material : undefined
}
