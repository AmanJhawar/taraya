import { getFirestore, doc, getDoc } from 'firebase/firestore/lite'
import { app } from '@/lib/firebase/config'
import type { CollectionConfig, VariantModel, Material } from '@/lib/collections'

const db = getFirestore(app)
const COLLECTIONS_DOC = doc(db, 'settings', 'collections')

export async function getCollections(): Promise<CollectionConfig[]> {
  try {
    const snap = await getDoc(COLLECTIONS_DOC)
    if (snap.exists() && Array.isArray(snap.data().list)) {
      return snap.data().list as CollectionConfig[]
    }
    return []
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export async function getCollectionBySlug(slug: string): Promise<CollectionConfig | undefined> {
  const collections = await getCollections()
  return collections.find(c => c.slug === slug)
}

// Helpers
export function variantModelOf(collectionConfig?: CollectionConfig): VariantModel | undefined {
  return collectionConfig?.variantModel
}

export function usesStones(collectionConfig?: CollectionConfig): boolean {
  return variantModelOf(collectionConfig) === 'stones'
}

export function usesWeights(collectionConfig?: CollectionConfig): boolean {
  return variantModelOf(collectionConfig) === 'weights'
}

export function usesPurity(collectionConfig?: CollectionConfig): boolean {
  return variantModelOf(collectionConfig) === 'sizes-purity'
}

export function materialOf(collectionConfig?: CollectionConfig): Material | undefined {
  return collectionConfig?.material
}
