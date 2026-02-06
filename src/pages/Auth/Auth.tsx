import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getFirebaseErrorMessage } from '../../utils/errorMessages'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const toast = useToast()

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('이메일을 먼저 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('재설정 이메일을 보내드렸습니다. 받은편지함을 확인해주세요.')
    } catch (e) {
      toast.error(getFirebaseErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!isLogin) {
      if (!name.trim()) {
        toast.error('사장님 성함을 입력해주세요.')
        return
      }
      if (password !== passwordConfirm) {
        toast.error('비밀번호가 일치하지 않습니다.')
        return
      }
    }
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
        toast.success('로그인되었습니다!')
      } else {
        await signup(email, password, name.trim())
        toast.success('회원가입이 완료되었습니다!')
      }
    } catch (e) {
      toast.error(getFirebaseErrorMessage(e))
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
            onClick={() => { setIsLogin(true); setName(''); setPasswordConfirm('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              isLogin ? 'bg-violet-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setIsLogin(false); setName(''); setPasswordConfirm('') }}
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
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">사장님 성함</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김사장님"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
            </div>
          )}
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
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">비밀번호 확인</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 다시 입력"
                className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition ${
                  passwordConfirm && password !== passwordConfirm ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
          )}

          {/* 비밀번호 재설정 링크 (로그인 모드에서만) */}
          {isLogin && (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="text-xs text-violet-500 hover:text-violet-700 disabled:opacity-40 transition"
            >
              비밀번호 재설정
            </button>
          )}

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!email || !password || loading || (!isLogin && (!name || !passwordConfirm))}
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
