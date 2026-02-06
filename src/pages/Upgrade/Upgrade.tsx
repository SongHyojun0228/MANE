import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, Check } from 'lucide-react'
import { usePlan } from '../../hooks/usePlan'

const FREE_FEATURES = [
  { text: '고객 관리 (10명까지)', ok: true },
  { text: '시술 기록', ok: true },
  { text: '기본 통계', ok: true },
  { text: '무제한 고객', ok: false },
  { text: '엑셀 내보내기', ok: false },
  { text: '데이터 백업', ok: false },
]

const PREMIUM_FEATURES = [
  '무제한 고객 관리',
  '시술 기록 및 통계',
  '월별 리포트',
  '엑셀 내보내기',
  '데이터 백업',
]

export default function Upgrade() {
  const navigate = useNavigate()
  const { plan } = usePlan()

  // 이미 프리미엄 사용 중
  if (plan === 'premium') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
          <Crown size={32} className="text-violet-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">프리미엄 사용 중</h1>
        <p className="text-sm text-gray-500 mb-6">모든 기능을 사용할 수 있습니다.</p>
        <button onClick={() => navigate('/home')} className="text-sm text-violet-500 hover:text-violet-700 transition">
          홈으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">플랜 업그레이드</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* 무료 플랜 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">무료</h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">현재 플랜</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            0원<span className="text-sm font-normal text-gray-400">/월</span>
          </p>
          <ul className="space-y-2">
            {FREE_FEATURES.map(({ text, ok }) => (
              <li key={text} className="flex items-center gap-2 text-sm">
                <span className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 ${ok ? 'bg-violet-100' : 'bg-gray-100'}`}>
                  {ok ? <Check size={12} className="text-violet-500" /> : <span className="text-gray-400">—</span>}
                </span>
                <span className={ok ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 프리미엄 플랜 카드 */}
        <div className="bg-white rounded-2xl border-2 border-violet-400 p-5 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
            추천
          </span>
          <div className="flex items-center gap-2 mb-3">
            <Crown size={18} className="text-violet-500" />
            <h2 className="text-lg font-semibold text-gray-800">프리미엄</h2>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            9,900원<span className="text-sm font-normal text-gray-400">/월</span>
          </p>
          <ul className="space-y-2 mb-5">
            {PREMIUM_FEATURES.map((text) => (
              <li key={text} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-violet-100 flex-shrink-0">
                  <Check size={12} className="text-violet-500" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          {/* 결제 버튼 — 토스페이먼츠 연동 준비 중 */}
          <button
            disabled
            className="w-full py-3 rounded-xl bg-violet-500 text-white text-sm font-semibold disabled:opacity-50 cursor-not-allowed"
          >
            결제하기
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">토스페이먼츠 연동 준비 중</p>
        </div>
      </div>
    </div>
  )
}
