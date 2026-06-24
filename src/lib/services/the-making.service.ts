import { getDoc, setDoc } from 'firebase/firestore/lite'
import { makingStages as defaultStages, type MakingStage } from '@/lib/domain/the-making'
import { REFS } from '@/lib/firebase/firestore'
import { revalidatePaths } from './revalidate'

export async function getMakingStages(): Promise<MakingStage[]> {
  const snap = await getDoc(REFS.theMaking)
  const list = snap.data()?.list
  return list && list.length > 0 ? list : defaultStages
}

export async function setMakingStages(list: MakingStage[]): Promise<void> {
  await setDoc(REFS.theMaking, { list })
  await revalidatePaths(['/the-making'])
}
