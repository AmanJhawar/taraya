import { getFirestore, doc, collection, type DocumentSnapshot, type QuerySnapshot, type FirestoreDataConverter, type QueryDocumentSnapshot } from 'firebase/firestore/lite'
import { z } from 'zod'
import { app } from './config'
import { ProductSchema, InquirySchema, type Product, type Inquiry } from '@/lib/domain/types'
import { CollectionConfigSchema, type CollectionConfig } from '@/lib/domain/collections'
import { MakingStageSchema, type MakingStage } from '@/lib/domain/the-making'

export const db = getFirestore(app)

export function createConverter<T extends { id: string }>(schema: z.ZodType<T, any, any>): FirestoreDataConverter<T> {
  return {
    toFirestore: (data: T) => {
      const clone = { ...data };
      if ('id' in clone) {
        delete (clone as any).id;
      }
      return clone;
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
      const data = { ...snap.data(), id: snap.id };
      const parsed = schema.safeParse(data);
      if (parsed.success) {
        return parsed.data;
      }
      console.warn(`[firestore] Document ${snap.id} failed validation:`, parsed.error);
      return null as unknown as T;
    }
  }
}

export function createListConverter<T>(schema: z.ZodType<T, any, any>): FirestoreDataConverter<{ list: T[] }> {
  return {
    toFirestore: (data: { list: T[] }) => {
      return data;
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
      const data = snap.data();
      if (data && Array.isArray(data.list)) {
        const validItems: T[] = [];
        for (const item of data.list) {
          const parsed = schema.safeParse(item);
          if (parsed.success) {
            validItems.push(parsed.data);
          } else {
            console.warn(`[firestore] List item in document ${snap.id} failed validation:`, parsed.error);
          }
        }
        return { list: validItems };
      }
      return { list: [] };
    }
  }
}

export const REFS = {
  catalog: collection(db, 'catalog').withConverter(createConverter<Product>(ProductSchema)),
  inquiries: collection(db, 'inquiries').withConverter(createConverter<Inquiry>(InquirySchema)),
  admins: collection(db, 'admins'),
  collections: doc(db, 'settings', 'collections').withConverter(createListConverter<CollectionConfig>(CollectionConfigSchema)),
  theMaking: doc(db, 'settings', 'the-making').withConverter(createListConverter<MakingStage>(MakingStageSchema)),
} as const

export const docRefs = {
  catalog: (id: string) => doc(db, 'catalog', id).withConverter(createConverter<Product>(ProductSchema)),
  inquiry: (id: string) => doc(db, 'inquiries', id).withConverter(createConverter<Inquiry>(InquirySchema)),
} as const

/** Extract a typed document, returning null if missing or invalid. */
export function mapDoc<T>(snap: DocumentSnapshot<T, any>): T | null {
  if (!snap.exists()) return null
  return snap.data() ?? null
}

/** Map a query snapshot to a typed array, filtering invalid documents. */
export function mapDocs<T>(snap: QuerySnapshot<T, any>): T[] {
  return snap.docs.map((d) => d.data()).filter(Boolean)
}
