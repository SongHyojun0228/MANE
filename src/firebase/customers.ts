import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  where,
  query,
  type DocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { Customer } from '../types'

const COLLECTION = 'customers'

function toCustomer(docSnap: DocumentSnapshot): Customer {
  const data = docSnap.data()!
  return {
    id: docSnap.id,
    name: data.name,
    phone: data.phone,
    memo: data.memo || undefined,
    lastVisitDate: data.lastVisitDate?.toDate(),
    createdAt: data.createdAt?.toDate() ?? new Date(),
  }
}

/** 고객 추가 (사용자별) */
export async function addCustomer(data: Omit<Customer, 'id' | 'createdAt'>, userId: string) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

/** 사용자의 고객 목록 실시간 구독 (createdAt 내림차순, 클라이언트 정렬) */
export function subscribeCustomers(userId: string, callback: (customers: Customer[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  return onSnapshot(q, (snapshot) => {
    const customers = snapshot.docs.map(toCustomer)
    customers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    callback(customers)
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
