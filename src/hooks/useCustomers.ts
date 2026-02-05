import { useState, useEffect } from 'react'
import { addCustomer, subscribeCustomers, subscribeCustomer } from '../firebase/customers'
import { useAuth } from '../context/AuthContext'
import type { Customer } from '../types'

export function useCustomers() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeCustomers(user.uid, (data) => {
      setCustomers(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const add = async (data: Omit<Customer, 'id' | 'createdAt'>) => {
    if (!user) return
    await addCustomer(data, user.uid)
  }

  return { customers, loading, addCustomer: add }
}

/** 단일 고객 구독 (상세 페이지용) */
export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeCustomer(id, (data) => {
      setCustomer(data)
      setLoading(false)
    })
    return unsubscribe
  }, [id])

  return { customer, loading }
}
