import { useState, useEffect } from 'react'
import { addMenu, updateMenu, deleteMenu, subscribeMenus } from '../firebase/services'
import { useAuth } from '../context/AuthContext'
import type { ServiceMenu } from '../types'

export function useServices() {
  const { user } = useAuth()
  const [menus, setMenus] = useState<ServiceMenu[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeMenus(user.uid, (data) => {
      setMenus(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const add = async (data: Omit<ServiceMenu, 'id'>) => {
    if (!user) return
    await addMenu(data, user.uid)
  }

  const update = async (id: string, data: Omit<ServiceMenu, 'id'>) => {
    await updateMenu(id, data)
  }

  const remove = async (id: string) => {
    await deleteMenu(id)
  }

  return { menus, loading, addMenu: add, updateMenu: update, deleteMenu: remove }
}
