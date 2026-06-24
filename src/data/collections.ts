// Storefront data layer for collections.
// Re-exports the kernel and provides the Firestore-backed query the collection
// pages consume. No price here: price lives on the product page only.

import { app } from '@/lib/firebase/config'
import { getFirestore, collection as fsCollection, query, where, orderBy, getDocs } from 'firebase/firestore/lite'
import { getOptimizedUrl } from '@/lib/utils'
import type { Product } from '@/lib/types'
import {
  getCollections,
  getCollectionBySlug,
  materialOf,
} from '@/lib/services/collections.service'
import type { CollectionConfig, Material } from '@/lib/collections'

export type { CollectionConfig, Material }

// The view model the storefront cards consume.
export interface CollectionItem {
  id: string
  name: string
  collection: string
  material: Material
  images: string[]
  weightGrams?: number
  feature?: boolean
  darkGround?: boolean
}

const db = getFirestore(app)
const CATALOG = 'catalog'

export function toCard(item: Product, config?: CollectionConfig): CollectionItem {
  const images = [item.imageFile, ...(item.additionalImages || [])]
    .filter(Boolean)
    .map((id) => getOptimizedUrl(id, 1200))

  return {
    id: item.id,
    name: item.name,
    collection: item.collection,
    material: materialOf(config) ?? 'silver',
    darkGround: config?.darkGround ?? false,
    images,
    feature: false,
  }
}

export async function getCollectionItems(slug: string): Promise<CollectionItem[]> {
  const config = await getCollectionBySlug(slug)
  if (!config) return []

  const q = query(
    fsCollection(db, CATALOG),
    where('collection', '==', slug),
    orderBy('orderIndex', 'asc'),
  )

  const snap = await getDocs(q)
  const items: CollectionItem[] = []
  snap.forEach((d) => items.push(toCard({ id: d.id, ...d.data() } as Product, config)))
  return items
}

/**
 * @deprecated Pricing now lives on the product page, against a real spot rate.
 * 92.5 was the sterling fineness, never a price. Kept only so older imports do
 * not break; remove once nothing references it.
 */
export const getLiveSilverRate = (): number => 0
