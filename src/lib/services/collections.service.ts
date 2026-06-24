import { getDocs, query, orderBy, limit, where, QueryConstraint, setDoc, getDoc, startAfter } from 'firebase/firestore/lite'
import { type CollectionConfig, VariantModel, Material } from '@/lib/domain/collections'
import { Product } from '@/lib/domain/types'
import { REFS, mapDocs } from '@/lib/firebase/firestore'
import { getOptimizedUrl } from '@/lib/utils'
import { withTimeout } from './utils'
import { revalidatePaths } from './revalidate'

export async function getCollections(): Promise<CollectionConfig[]> {
  const snap = await getDoc(REFS.collections)
  return snap.data()?.list || []
}

export async function setCollections(list: CollectionConfig[]): Promise<void> {
  await setDoc(REFS.collections, { list })
  
  const pathsToRevalidate = ['/collections']
  for (const config of list) {
    pathsToRevalidate.push(`/collections/${config.slug}`)
  }
  
  await revalidatePaths(pathsToRevalidate)
}

export async function getCollectionBySlug(slug: string): Promise<CollectionConfig | undefined> {
  const collections = await getCollections()
  return collections.find(c => c.slug === slug)
}

export interface CollectionItem {
  id: string
  name: string
  collection: string
  material: string
  images: string[]
  weightGrams?: number
  feature?: boolean
  darkGround?: boolean
}

export function toCard(item: Product, config?: CollectionConfig): CollectionItem {
  const images = [item.imageFile, ...(item.additionalImages || [])]
    .filter(Boolean)
    .map((id) => getOptimizedUrl(id, 1200))

  return {
    id: item.id,
    name: item.name,
    collection: item.collection,
    material: config?.material ?? 'silver',
    darkGround: config?.darkGround ?? false,
    images,
    feature: false,
  }
}

export async function getCollectionItems(
  slug: string, 
  config?: CollectionConfig,
  pageSize: number = 50,
  cursorId?: string | null
): Promise<{ items: CollectionItem[], nextCursor: string | null }> {
  let queryConstraints: QueryConstraint[] = [
    where('collection', '==', slug),
    orderBy('orderIndex', 'asc'),
    limit(pageSize)
  ]
  
  if (config?.displayLimit) {
    // If the config itself has a hard limit, respect it by picking the smaller limit
    queryConstraints = [
      where('collection', '==', slug),
      orderBy('orderIndex', 'asc'),
      limit(Math.min(config.displayLimit, pageSize))
    ]
  }

  if (cursorId) {
    const { docRefs } = await import('@/lib/firebase/firestore');
    const cursorDoc = await getDoc(docRefs.catalog(cursorId));
    if (cursorDoc.exists()) {
      queryConstraints.push(startAfter(cursorDoc));
    }
  }
  
  const q = query(REFS.catalog, ...queryConstraints)
  const snapshot = await withTimeout(getDocs(q))
  const products = mapDocs<Product>(snapshot)
  const items = products.map(p => toCard(p, config))
  
  const nextCursor = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1].id : null;
  return { items, nextCursor }
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
