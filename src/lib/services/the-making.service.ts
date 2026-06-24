import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { app } from '@/lib/firebase/config'
import { makingStages as defaultStages, type MakingStage } from '@/data/the-making'

const db = getFirestore(app)
const MAKING_DOC = doc(db, 'settings', 'the-making')

export async function getMakingStages(): Promise<MakingStage[]> {
  try {
    const snap = await getDoc(MAKING_DOC)
    if (snap.exists() && Array.isArray(snap.data().list) && snap.data().list.length > 0) {
      return snap.data().list as MakingStage[]
    }
    // Fallback to hardcoded list if firestore doc is missing or empty
    return defaultStages
  } catch (error) {
    console.error('Error fetching making stages:', error)
    return defaultStages
  }
}

export async function setMakingStages(list: MakingStage[]): Promise<void> {
  await setDoc(MAKING_DOC, { list })
}

