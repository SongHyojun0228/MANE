import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { Stylist } from '../types'

const COLLECTION = 'stylists'

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6366f1']

/** 미용사 추가 */
export async function addStylist(data: Omit<Stylist, 'id' | 'createdAt' | 'color'>, userId: string) {
  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  const cleanData = Object.fromEntries(
    Object.entries({ ...data, color: randomColor, userId, createdAt: serverTimestamp() }).filter(
      ([_, v]) => v !== undefined
    )
  )
  await addDoc(collection(db, COLLECTION), cleanData)
}

/** 미용사 수정 */
export async function updateStylist(id: string, data: Partial<Omit<Stylist, 'id' | 'createdAt'>>) {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
  await updateDoc(doc(db, COLLECTION, id), cleanData)
}

/** 미용사 삭제 */
export async function deleteStylist(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}

/** 사용자별 미용사 구독 */
export function subscribeStylists(userId: string, callback: (data: Stylist[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  return onSnapshot(q, (snapshot) => {
    const data: Stylist[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Stylist[]
    callback(data)
  })
}
