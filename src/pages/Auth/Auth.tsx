import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

/** Firebase 에러 코드 → 한국어 메시지 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error && 'code' in error) {
    switch (error.code) {
      case 'auth/email-already-in-use':  return '이미 사용 중인 이메일입니다.'
      case 'auth/invalid-email':         return '올바르지 않은 이메일 형식입니다.'
      case 'auth/weak-password':         return '비밀번호는 6자리 이상이어야 합니다.'
      case 'auth/user-not-found':        return '등록되지 않은 이메일입니다.'
      case 'auth/wrong-password':        return '비밀번호가 틀렸습니다.'
      case 'auth/invalid-credential':    return '이메일 또는 비밀번호가 잘못되었습니다.'
    }
  }
  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await signup(email, password)
      }
      // 성공 시 onAuthStateChanged 트리거 → AppRouter가 자동 전환
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-violet-600">MANE</h1>
          <p className="text-sm text-gray-400 mt-1">미용실 관리 앱</p>
        </div>

        {/* 로그인 / 회원가입 탭 */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 mb-5">
          <button
            onClick={() => { setIsLogin(true); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              isLogin ? 'bg-violet-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setIsLogin(false); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              !isLogin ? 'bg-violet-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="예: salon@email.com"
              autoFocus
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자리 이상"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!email || !password || loading}
            className="w-full py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-violet-600 transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </div>
      </div>
    </div>
  )
}
