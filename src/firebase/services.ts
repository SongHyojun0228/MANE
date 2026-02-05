import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
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

export async function addMenu(data: Omit<ServiceMenu, 'id'>) {
  const docRef = await addDoc(collection(db, COLLECTION), data)
  return docRef.id
}

export async function updateMenu(id: string, data: Omit<ServiceMenu, 'id'>) {
  await updateDoc(doc(db, COLLECTION, id), data)
}

export async function deleteMenu(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}

export function subscribeMenus(callback: (menus: ServiceMenu[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    callback(snapshot.docs.map(toMenu))
  })
}
