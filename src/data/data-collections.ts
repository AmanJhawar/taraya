// Storefront data layer for collections.
// Re-exports the kernel and provides the Firestore-backed query the collection
// pages consume. No price here: price lives on the product page only.

import { app } from '@/lib/firebase/config'
import { getFirestore, collection as fsCollection, query, where, orderBy, getDocs } from 'firebase/firestore/lite'
import { getOptimizedUrl } from '@/lib/utils'
import type { Product } from '@/lib/types'
import {
  COLLECTIONS,
  COLLECTION_LIST,
  COLLECTION_SLUGS,
  isCollection,
  materialOf,
} from '@/lib/collections'
import type { Collection, CollectionConfig, Material } from '@/lib/collections'

export { COLLECTIONS, COLLECTION_LIST, COLLECTION_SLUGS, isCollection }
export type { Collection, CollectionConfig, Material }

// Back-compat alias so existing page imports keep working.
export const COLLECTIONS_CONFIG = COLLECTIONS

// The view model the storefront cards consume.
export interface CollectionItem {
  id: string
  name: string
  collection: Collection
  material: Material
  images: string[]
  weightGrams?: number
  feature?: boolean
}

const db = getFirestore(app)
const CATALOG = 'catalog'

function toCard(item: Product): CollectionItem {
  const images = [item.imageFile, ...(item.additionalImages || [])]
    .filter(Boolean)
    .map((id) => getOptimizedUrl(id, 1200))

  return {
    id: item.id,
    name: item.name,
    collection: item.collection,
    material: materialOf(item.collection) ?? 'silver',
    images,
    feature: false,
  }
}

export async function getCollectionItems(slug: string): Promise<CollectionItem[]> {
  if (!isCollection(slug)) return []

  const q = query(
    fsCollection(db, CATALOG),
    where('collection', '==', slug),
    orderBy('orderIndex', 'asc'),
  )

  const snap = await getDocs(q)
  const items: CollectionItem[] = []
  snap.forEach((d) => items.push(toCard({ id: d.id, ...d.data() } as Product)))
  return items
}

/**
 * @deprecated Pricing now lives on the product page, against a real spot rate.
 * 92.5 was the sterling fineness, never a price. Kept only so older imports do
 * not break; remove once nothing references it.
 */
export const getLiveSilverRate = (): number => 0
