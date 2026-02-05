import { useState, useEffect } from 'react'
import { addRecord, subscribeRecordsByCustomer, subscribeAllRecords } from '../firebase/records'
import { useAuth } from '../context/AuthContext'
import type { ServiceRecord } from '../types'

export function useRecords(customerId: string) {
  const { user } = useAuth()
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
    if (!user) return
    await addRecord(data, user.uid)
  }

  return { records, loading, addRecord: add }
}

/** 전체 시술 기록 구독 (대시보드·통계용, 사용자별) */
export function useAllRecords() {
  const { user } = useAuth()
  const [records, setRecords] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeAllRecords(user.uid, (data) => {
      setRecords(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  return { records, loading }
}
