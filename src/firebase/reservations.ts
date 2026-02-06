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
import type { Reservation } from '../types'

const COLLECTION = 'reservations'

/** 예약 추가 */
export async function addReservation(data: Omit<Reservation, 'id' | 'createdAt'>, userId: string) {
  // undefined 필드 제거 (Firebase는 undefined를 허용하지 않음)
  const cleanData = Object.fromEntries(
    Object.entries({ ...data, userId, createdAt: serverTimestamp() }).filter(([_, v]) => v !== undefined)
  )
  await addDoc(collection(db, COLLECTION), cleanData)
}

/** 예약 수정 */
export async function updateReservation(id: string, data: Partial<Omit<Reservation, 'id' | 'createdAt'>>) {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
  await updateDoc(doc(db, COLLECTION, id), cleanData)
}

/** 예약 삭제 */
export async function deleteReservation(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}

/** 사용자별 예약 구독 (실시간) */
export function subscribeReservations(userId: string, callback: (data: Reservation[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  return onSnapshot(q, (snapshot) => {
    const data: Reservation[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Reservation[]
    callback(data)
  })
}
