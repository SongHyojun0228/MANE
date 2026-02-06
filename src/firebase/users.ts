import { doc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from './config'

export type Plan = 'free' | 'premium'

export interface UserProfile {
  name: string
  plan: Plan
  createdAt: string // ISO 문자열
}

/** 회원가입 시 users/{uid} 프로필 문서 생성 */
export async function createUserProfile(uid: string, { name }: { name: string }) {
  await setDoc(doc(db, 'users', uid), {
    name,
    plan: 'premium', // 개발 단계: 모든 사용자 프리미엄으로 시작
    createdAt: new Date().toISOString(),
  })
}

/** 프로필 문서 실시간 구독 */
export function subscribeUserProfile(uid: string, callback: (profile: UserProfile | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snapshot) => {
    callback(snapshot.exists() ? (snapshot.data() as UserProfile) : null)
  })
}

/** 플랜 업그레이드 (결제 완료 후 호출) */
export async function upgradeUserPlan(uid: string) {
  await setDoc(doc(db, 'users', uid), { plan: 'premium' }, { merge: true })
}
