import { app } from '@/lib/firebase/config'
import { auth } from '@/lib/firebase/auth'
import { getFirestore, collection, doc, getDoc, getDocs, query, orderBy, limit, startAfter, where, QueryConstraint, setDoc, deleteDoc, updateDoc } from 'firebase/firestore/lite'
import { buildSearchTerms } from '@/lib/domain/inventory'
import { Product } from '@/lib/types'
import { withTimeout } from './utils'

const db = getFirestore(app)
const CATALOG_COLLECTION = 'catalog'


export async function getInventoryItems(): Promise<Product[]> {
  const querySnapshot = await withTimeout(getDocs(collection(db, CATALOG_COLLECTION)));
  const items: Product[] = [];
  querySnapshot.forEach((docSnap) => {
    items.push({ ...docSnap.data(), id: docSnap.id } as Product);
  });
  return items;
}


export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, CATALOG_COLLECTION, id);
  const docSnap = await withTimeout(getDoc(docRef));
  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id } as Product;
  }
  return null;
}



export async function saveInventoryItem(id: string, payload: Partial<Product>): Promise<void> {
  await setDoc(doc(db, CATALOG_COLLECTION, id), payload);
  
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    console.error("No auth token available for revalidation.");
    return;
  }

  const pathsToRevalidate = ['/collections'];
  if (payload.collection) {
    pathsToRevalidate.push(`/collections/${payload.collection}`);
  }

  for (const path of pathsToRevalidate) {
    const res = await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) console.warn(`Failed to revalidate ${path} — continuing.`);
  }
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, CATALOG_COLLECTION, id));
  
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    console.error("No auth token available for revalidation.");
    return;
  }

  // Revalidate all collection pages since we don't know which collection this item belonged to
  const res = await fetch(`/api/revalidate?path=${encodeURIComponent('/collections')}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) console.warn('Failed to revalidate /collections — continuing.');
}

export async function backfillSearchTermsForAllItems(): Promise<number> {
  const querySnapshot = await getDocs(collection(db, CATALOG_COLLECTION));
  const promises: Promise<void>[] = [];
  
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data() as Partial<Product>;
    const searchTerms = buildSearchTerms(data);
    promises.push(updateDoc(doc(db, CATALOG_COLLECTION, docSnap.id), { searchTerms }));
  });
  
  await Promise.all(promises);
  return promises.length;
}
