import { doc, getDoc } from 'firebase/firestore/lite'
import { db } from '@/lib/firebase/config'

export async function checkIsAdmin(uid: string): Promise<boolean> {
  const adminDoc = await getDoc(doc(db, 'admins', uid))
  return adminDoc.exists()
}
