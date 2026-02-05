import {
  collection,
  addDoc,
  onSnapshot,
  where,
  query,
  type DocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import type { ServiceRecord } from '../types'
import { updateCustomerLastVisit } from './customers'

const COLLECTION = 'records'

function toRecord(docSnap: DocumentSnapshot): ServiceRecord {
  const data = docSnap.data()!
  return {
    id: docSnap.id,
    customerId: data.customerId,
    menuId: data.menuId,
    menuName: data.menuName,
    price: data.price,
    date: data.date?.toDate() ?? new Date(),
    memo: data.memo || undefined,
  }
}

/** 시술 기록 추가 + 고객의 lastVisitDate 갱신 */
export async function addRecord(data: Omit<ServiceRecord, 'id'>) {
  const docRef = await addDoc(collection(db, COLLECTION), data)
  await updateCustomerLastVisit(data.customerId, data.date)
  return docRef.id
}

/** 전체 시술 기록 실시간 구독 (날짜 내림차순, 클라이언트 정렬) */
export function subscribeAllRecords(callback: (records: ServiceRecord[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const records = snapshot.docs.map(toRecord)
    records.sort((a, b) => b.date.getTime() - a.date.getTime())
    callback(records)
  })
}

/** 특정 고객의 시술 기록 실시간 구독 (날짜 내림차순, 클라이언트 정렬) */
export function subscribeRecordsByCustomer(
  customerId: string,
  callback: (records: ServiceRecord[]) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION), where('customerId', '==', customerId))
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(toRecord)
    records.sort((a, b) => b.date.getTime() - a.date.getTime())
    callback(records)
  })
}
