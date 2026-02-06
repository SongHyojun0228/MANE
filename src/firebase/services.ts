import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
  type DocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { ServiceMenu } from '../types'

const COLLECTION = 'menus'

function toMenu(docSnap: DocumentSnapshot): ServiceMenu {
  const data = docSnap.data()!
  return {
    id: docSnap.id,
    name: data.name,
    price: data.price,
    stylistIds: data.stylistIds,
  }
}

/** 메뉴 추가 (사용자별) */
export async function addMenu(data: Omit<ServiceMenu, 'id'>, userId: string) {
  // undefined 필드 제거 (Firebase는 undefined를 허용하지 않음)
  const cleanData = Object.fromEntries(
    Object.entries({ ...data, userId }).filter(([_, v]) => v !== undefined)
  )
  const docRef = await addDoc(collection(db, COLLECTION), cleanData)
  return docRef.id
}

export async function updateMenu(id: string, data: Omit<ServiceMenu, 'id'>) {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
  await updateDoc(doc(db, COLLECTION, id), cleanData)
}

export async function deleteMenu(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}

/** 사용자의 메뉴 목록 실시간 구독 */
export function subscribeMenus(userId: string, callback: (menus: ServiceMenu[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(toMenu))
  })
}
