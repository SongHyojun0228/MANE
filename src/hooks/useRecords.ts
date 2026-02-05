import { useState, useEffect } from 'react'
import { addRecord, subscribeRecordsByCustomer, subscribeAllRecords } from '../firebase/records'
import type { ServiceRecord } from '../types'

export function useRecords(customerId: string) {
  const [records, setRecords] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeRecordsByCustomer(customerId, (data) => {
      setRecords(data)
      setLoading(false)
    })
    return unsubscribe
  }, [customerId])

  const add = async (data: Omit<ServiceRecord, 'id'>) => {
    await addRecord(data)
  }

  return { records, loading, addRecord: add }
}

/** 전체 시술 기록 구독 (대시보드·통계용) */
export function useAllRecords() {
  const [records, setRecords] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeAllRecords((data) => {
      setRecords(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { records, loading }
}
