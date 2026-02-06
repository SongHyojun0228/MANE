import { useState } from 'react'
import { LogOut, User, Building2, Phone, MapPin, Mail, Lock, Trash2, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { getFirebaseErrorMessage } from '../../utils/errorMessages'

export default function Settings() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handlePasswordReset = async () => {
    if (!user?.email) return
    try {
      await sendPasswordResetEmail(auth, user.email)
      toast.success('비밀번호 재설정 이메일을 보냈습니다.')
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error))
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setDeleteLoading(true)
    try {
      // TODO: Firestore 데이터 삭제 (고객, 시술 기록 등)
      await deleteUser(user)
      toast.success('계정이 삭제되었습니다.')
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('보안을 위해 다시 로그인한 후 시도해주세요.')
      } else {
        toast.error(getFirebaseErrorMessage(error))
      }
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">설정</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* 계정 정보 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">계정 정보</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <User size={20} className="text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">이름</p>
                <p className="text-sm font-medium text-gray-800">{user?.displayName || '사용자'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail size={20} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">이메일</p>
                <p className="text-sm font-medium text-gray-800">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">보안</h2>
          </div>
          <div className="p-4">
            <button
              onClick={handlePasswordReset}
              className="flex items-center gap-3 w-full text-left hover:bg-gray-50 p-3 rounded-xl transition"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Lock size={20} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">비밀번호 변경</p>
                <p className="text-xs text-gray-400 mt-0.5">이메일로 재설정 링크 받기</p>
              </div>
            </button>
          </div>
        </div>

        {/* 미용실 정보 (추후 구현) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden opacity-50">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">미용실 정보</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">미용실 이름</p>
                <p className="text-sm text-gray-500">설정 안 됨 (준비 중)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">전화번호</p>
                <p className="text-sm text-gray-500">설정 안 됨 (준비 중)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">주소</p>
                <p className="text-sm text-gray-500">설정 안 됨 (준비 중)</p>
              </div>
            </div>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 transition"
        >
          <LogOut size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">로그아웃</span>
        </button>

        {/* 회원탈퇴 */}
        <div className="pt-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-gray-400 hover:text-red-500 transition"
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 text-center mb-2">
              정말 탈퇴하시겠습니까?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              모든 데이터(고객, 시술 기록, 예약 등)가<br />
              영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {deleteLoading && <Loader2 size={16} className="animate-spin" />}
                탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
