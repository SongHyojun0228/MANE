import { useNavigate } from 'react-router-dom'
import { X, Crown, Check } from 'lucide-react'

interface UpgradeModalProps {
  onClose: () => void
  currentCount: number
  limit: number
}

export default function UpgradeModal({ onClose, currentCount, limit }: UpgradeModalProps) {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">업그레이드 필요</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            무료 플랜은 고객{' '}
            <span className="font-semibold text-violet-500">{limit}명</span>까지 관리할 수 있습니다.
            <br />
            현재{' '}
            <span className="font-semibold text-gray-800">{currentCount}명</span>의 고객이 등록되어 있습니다.
          </p>

          {/* 프리미엄 혜택 */}
          <div className="bg-violet-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={18} className="text-violet-500" />
              <span className="text-sm font-semibold text-violet-700">프리미엄 혜택</span>
            </div>
            <ul className="space-y-2">
              {['무제한 고객 관리', '월별 통계 리포트', '엑셀 내보내기', '데이터 백업'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={15} className="text-violet-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 가격 */}
          <p className="text-center">
            <span className="text-2xl font-bold text-gray-800">9,900원</span>
            <span className="text-sm text-gray-400">/월</span>
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            나중에
          </button>
          <button
            onClick={() => { onClose(); navigate('/upgrade') }}
            className="flex-1 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition"
          >
            업그레이드 하기
          </button>
        </div>
      </div>
    </div>
  )
}
