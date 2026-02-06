import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  addReservation,
  updateReservation,
  deleteReservation,
  subscribeReservations,
} from '../firebase/reservations'
import type { Reservation } from '../types'

export function useReservations() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeReservations(user.uid, (data) => {
      setReservations(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const add = async (data: Omit<Reservation, 'id' | 'createdAt'>) => {
    if (!user) return
    await addReservation(data, user.uid)
  }

  const update = async (id: string, data: Partial<Omit<Reservation, 'id' | 'createdAt'>>) => {
    await updateReservation(id, data)
  }

  const remove = async (id: string) => {
    await deleteReservation(id)
  }

  return {
    reservations,
    loading,
    addReservation: add,
    updateReservation: update,
    deleteReservation: remove,
  }
}
