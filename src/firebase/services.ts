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
  }
}

/** 메뉴 추가 (사용자별) */
export async function addMenu(data: Omit<ServiceMenu, 'id'>, userId: string) {
  const docRef = await addDoc(collection(db, COLLECTION), { ...data, userId })
  return docRef.id
}

export async function updateMenu(id: string, data: Omit<ServiceMenu, 'id'>) {
  await updateDoc(doc(db, COLLECTION, id), data)
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
