import {
  collection,
  addDoc,
  onSnapshot,
  where,
  query,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
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
    reservationId: data.reservationId || undefined,
    stylistId: data.stylistId || undefined,
    stylistName: data.stylistName || undefined,
  }
}

/** 시술 기록 추가 (사용자별) + lastVisitDate 갱신 */
export async function addRecord(data: Omit<ServiceRecord, 'id'>, userId: string) {
  const docRef = await addDoc(collection(db, COLLECTION), { ...data, userId })
  await updateCustomerLastVisit(data.customerId, data.date)
  return docRef.id
}

/** 사용자의 전체 시술 기록 실시간 구독 (날짜 내림차순) */
export function subscribeAllRecords(userId: string, callback: (records: ServiceRecord[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(toRecord)
    records.sort((a, b) => b.date.getTime() - a.date.getTime())
    callback(records)
  })
}

/** 특정 고객의 시술 기록 실시간 구독 (날짜 내림차순) */
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

/** 예약 ID로 시술 기록 조회 (중복 생성 방지용) */
export async function getRecordByReservationId(reservationId: string): Promise<ServiceRecord | null> {
  const q = query(collection(db, COLLECTION), where('reservationId', '==', reservationId))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return toRecord(snapshot.docs[0])
}

/** 시술 기록 수정 */
export async function updateRecord(recordId: string, data: Partial<ServiceRecord>) {
  await updateDoc(doc(db, COLLECTION, recordId), data)
}

/** 시술 기록 삭제 */
export async function deleteRecord(recordId: string) {
  await deleteDoc(doc(db, COLLECTION, recordId))
}
