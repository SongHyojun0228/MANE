import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeUserProfile, type Plan } from '../firebase/users'

export const PLAN_LIMITS: Record<Plan, { customers: number }> = {
  free:    { customers: 10 },
  premium: { customers: Infinity },
}

export function usePlan() {
  const { user } = useAuth()
  const [plan, setPlan] = useState<Plan>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeUserProfile(user.uid, (profile) => {
      setPlan(profile?.plan ?? 'free')
      setLoading(false)
    })
    return unsub
  }, [user])

  return { plan, limits: PLAN_LIMITS[plan], loading }
}
