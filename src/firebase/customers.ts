import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
  type DocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { Customer } from '../types'

const COLLECTION = 'customers'

/** Firestore 문서 → Customer 타입 변환 */
function toCustomer(doc: DocumentSnapshot): Customer {
  const data = doc.data()!
  return {
    id: doc.id,
    name: data.name,
    phone: data.phone,
    memo: data.memo || undefined,
    lastVisitDate: data.lastVisitDate?.toDate(),
    createdAt: data.createdAt?.toDate() ?? new Date(),
  }
}

/** 고객 추가 → Firestore에 저장 */
export async function addCustomer(data: Omit<Customer, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

/** 고객 목록 실시간 구독 (createdAt 내림차순) */
export function subscribeCustomers(callback: (customers: Customer[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(toCustomer))
  })
}

/** 단일 고객 실시간 구독 */
export function subscribeCustomer(id: string, callback: (customer: Customer | null) => void): Unsubscribe {
  return onSnapshot(doc(db, COLLECTION, id), (docSnap) => {
    callback(docSnap.exists() ? toCustomer(docSnap) : null)
  })
}

/** 고객의 lastVisitDate 갱신 */
export async function updateCustomerLastVisit(id: string, date: Date) {
  await updateDoc(doc(db, COLLECTION, id), { lastVisitDate: date })
}
