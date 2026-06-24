import { z } from 'zod'

// Shared collection definitions.
// The actual collection list is now dynamic and fetched from Firestore via collections.service.ts.

export const VariantModelSchema = z.enum(['sizes-purity', 'stones', 'weights'])
export type VariantModel = z.infer<typeof VariantModelSchema>

export const MaterialSchema = z.enum(['silver', 'stone-set', 'bullion'])
export type Material = z.infer<typeof MaterialSchema>

export const CollectionConfigSchema = z.object({
  slug: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  standfirst: z.string(),
  image: z.string(),
  gridType: z.enum(['sparse', 'utilitarian']),
  variantModel: VariantModelSchema,
  darkGround: z.boolean(),
  material: MaterialSchema,
  displayLimit: z.number().optional(),
})
export type CollectionConfig = z.infer<typeof CollectionConfigSchema>
