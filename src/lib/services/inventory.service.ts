import { getDocs, query, orderBy, limit, startAfter, where, setDoc, deleteDoc, getDoc, documentId } from 'firebase/firestore/lite'
import { Product } from '@/lib/domain/types'
import { withTimeout } from './utils'
import { REFS, docRefs, mapDoc, mapDocs } from '@/lib/firebase/firestore'
import { revalidatePaths } from './revalidate'

export async function getAllInventoryItems(): Promise<Product[]> {
  const querySnapshot = await withTimeout(getDocs(REFS.catalog));
  return mapDocs(querySnapshot);
}

export async function getInventoryPage(pageSize: number, cursorId?: string | null): Promise<{ items: Product[], nextCursor: string | null }> {
  let q = query(REFS.catalog, orderBy('orderIndex', 'asc'), limit(pageSize));
  
  if (cursorId) {
    const cursorDoc = await getDoc(docRefs.catalog(cursorId));
    if (cursorDoc.exists()) {
      q = query(REFS.catalog, orderBy('orderIndex', 'asc'), startAfter(cursorDoc), limit(pageSize));
    }
  }

  const snapshot = await withTimeout(getDocs(q));
  const items = mapDocs(snapshot);

  const nextCursor = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1].id : null;
  return { items, nextCursor };
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) {
    chunks.push(ids.slice(i, i + 10));
  }

  const results: Product[] = [];
  
  for (const chunk of chunks) {
    const q = query(REFS.catalog, where(documentId(), 'in', chunk));
    const snapshot = await withTimeout(getDocs(q));
    results.push(...mapDocs(snapshot));
  }
  
  return results;
}

export async function getProductById(id: string): Promise<Product | null> {
  const docSnap = await withTimeout(getDoc(docRefs.catalog(id)));
  return mapDoc(docSnap);
}

export async function saveInventoryItem(id: string, payload: Partial<Product>): Promise<void> {
  await setDoc(docRefs.catalog(id), payload);
  
  const pathsToRevalidate = ['/collections', `/product/${id}`, '/search'];
  if (payload.collection) {
    pathsToRevalidate.push(`/collections/${payload.collection}`);
  }

  await revalidatePaths(pathsToRevalidate);
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await deleteDoc(docRefs.catalog(id));
  
  // Revalidate all collection pages since we don't know which collection this item belonged to
  // and revalidate the specific product page so it 404s
  await revalidatePaths(['/collections', `/product/${id}`, '/search']);
}

export async function searchInventory(searchQuery: string): Promise<Product[]> {
  const queryText = searchQuery.toLowerCase().trim()
  if (!queryText) return []

  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'catalog'

  if (!appId || !apiKey) {
    console.warn('[search] Algolia keys are missing in environment variables. Returning empty results.')
    return []
  }

  try {
    const response = await fetch(`https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`, {
      method: 'POST',
      headers: {
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queryText,
        hitsPerPage: 100
      })
    })

    if (!response.ok) {
      throw new Error(`Algolia responded with status ${response.status}`)
    }

    const data = await response.json()
    const hits = data.hits as any[]
    
    const ids = hits.map(hit => hit.objectID)
    if (ids.length > 0) {
      return await getProductsByIds(ids)
    }
    
    return []
  } catch (err) {
    console.error('[search] Algolia search failed:', err)
    return []
  }
}

export async function hasProductsInCollection(slug: string): Promise<boolean> {
  const q = query(REFS.catalog, where('collection', '==', slug), limit(1));
  const snap = await getDocs(q);
  return !snap.empty;
}

