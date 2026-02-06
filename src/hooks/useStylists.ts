import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { addStylist, updateStylist, deleteStylist, subscribeStylists } from '../firebase/stylists'
import type { Stylist } from '../types'

export function useStylists() {
  const { user } = useAuth()
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeStylists(user.uid, (data) => {
      setStylists(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const add = async (data: Omit<Stylist, 'id' | 'createdAt' | 'color'>) => {
    if (!user) return
    await addStylist(data, user.uid)
  }

  const update = async (id: string, data: Partial<Omit<Stylist, 'id' | 'createdAt'>>) => {
    await updateStylist(id, data)
  }

  const remove = async (id: string) => {
    await deleteStylist(id)
  }

  return {
    stylists,
    loading,
    addStylist: add,
    updateStylist: update,
    deleteStylist: remove,
  }
}
