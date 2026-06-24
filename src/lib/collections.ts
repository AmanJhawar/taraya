// Shared collection definitions.
// The actual collection list is now dynamic and fetched from Firestore via collections.service.ts.

export type VariantModel = 'sizes-purity' | 'stones' | 'weights'
export type Material = 'silver' | 'stone-set' | 'bullion'

export interface CollectionConfig {
  slug: string
  eyebrow: string
  title: string
  standfirst: string
  image: string
  gridType: 'sparse' | 'utilitarian'
  variantModel: VariantModel
  darkGround: boolean
  material: Material
}
