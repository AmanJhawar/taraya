import { z } from 'zod'

// A single configured variant, identified by its own SKU.
// The attributes describe which selection this SKU corresponds to.
export const VariantDetailSchema = z.object({
  size: z.string().optional(),
  purity: z.string().optional(),
  stone: z.string().optional(),
  weight: z.string().optional(),
})
export type VariantDetail = z.infer<typeof VariantDetailSchema>

export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  collection: z.string(),
  description: z.string(),
  standardSizes: z.array(z.string()).optional(),
  customSizes: z.array(z.string()).optional(),
  standardPurities: z.array(z.string()).optional(),
  customPurities: z.array(z.string()).optional(),
  standardWeights: z.array(z.string()).optional(),
  customWeights: z.array(z.string()).optional(),
  standardStones: z.array(z.string()).optional(),
  customStones: z.array(z.string()).optional(),
  hasVariants: z.boolean().optional(),
  variantSkus: z.record(z.string(), VariantDetailSchema).optional(),
  variantImages: z.record(z.string(), z.array(z.string())).optional(),
  weight: z.string(),
  material: z.string().optional(),
  imageFile: z.string(),
  additionalImages: z.array(z.string()).optional(),
  orderIndex: z.number().optional(),
})
export type Product = z.infer<typeof ProductSchema>

export const InquirySchema = z.object({
  id: z.string(),
  name: z.string().optional(), // Legacy
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  countryCode: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  company: z.string().optional(),
  gstinPan: z.string().optional(),
  message: z.string(),
  inquiryType: z.string(),
  status: z.enum(['unread', 'read', 'handled']).optional(),
  createdAt: z.any().optional(),
})
export type Inquiry = z.infer<typeof InquirySchema>
