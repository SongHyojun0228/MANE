import { useState, useEffect } from 'react'
import { addMenu, updateMenu, deleteMenu, subscribeMenus } from '../firebase/services'
import type { ServiceMenu } from '../types'

export function useServices() {
  const [menus, setMenus] = useState<ServiceMenu[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeMenus((data) => {
      setMenus(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const add = async (data: Omit<ServiceMenu, 'id'>) => {
    await addMenu(data)
  }

  const update = async (id: string, data: Omit<ServiceMenu, 'id'>) => {
    await updateMenu(id, data)
  }

  const remove = async (id: string) => {
    await deleteMenu(id)
  }

  return { menus, loading, addMenu: add, updateMenu: update, deleteMenu: remove }
}
