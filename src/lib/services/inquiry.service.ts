import { getDocs, setDoc, deleteDoc, query, orderBy, limit, startAfter, addDoc, serverTimestamp, getDoc } from 'firebase/firestore/lite'
import { type Inquiry } from '@/lib/domain/types'
import { withTimeout } from './utils'
import { REFS, docRefs, mapDocs } from '@/lib/firebase/firestore'

export async function getInquiriesPage(pageSize: number, cursorId?: string | null): Promise<{ items: Inquiry[], nextCursor: string | null }> {
  let q = query(REFS.inquiries, orderBy('createdAt', 'desc'), limit(pageSize));
  
  if (cursorId) {
    const cursorDoc = await getDoc(docRefs.inquiry(cursorId));
    if (cursorDoc.exists()) {
      q = query(REFS.inquiries, orderBy('createdAt', 'desc'), startAfter(cursorDoc), limit(pageSize));
    }
  }

  const snapshot = await getDocs(q);
  const items = mapDocs(snapshot);

  const nextCursor = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1].id : null;

  return { items, nextCursor };
}

export async function deleteInquiry(id: string): Promise<void> {
  await deleteDoc(docRefs.inquiry(id));
}

export async function updateInquiryStatus(id: string, status: 'unread' | 'read' | 'handled'): Promise<void> {
  await setDoc(docRefs.inquiry(id), { status }, { merge: true });
}

export async function submitInquiry(data: {
  firstName: string;
  middleName?: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  email?: string;
  company?: string;
  gstinPan?: string;
  message: string;
  inquiryType: string;
}) {
  const payload = Object.fromEntries(
    Object.entries({ ...data, status: 'unread', createdAt: serverTimestamp() })
      .filter(([, v]) => v !== undefined && v !== '')
  );
  return await withTimeout(addDoc(REFS.inquiries, payload as any));
}
