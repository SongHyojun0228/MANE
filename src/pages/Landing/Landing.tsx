import { useNavigate } from 'react-router-dom'
import { Users, FileText, TrendingUp, Check, Crown } from 'lucide-react'

const FEATURES = [
  {
    icon: Users,
    title: '고객 관리',
    description: '단골 고객 정보를 한눈에 확인하고 관리하세요',
  },
  {
    icon: FileText,
    title: '시술 기록',
    description: '매 시술마다 자동 기록, 이력을 간편하게 추적',
  },
  {
    icon: TrendingUp,
    title: '매출 통계',
    description: '월별 매출과 방문 통계를 한눈에',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          미용실 관리를
          <br />더 <span className="text-violet-600">간단하게</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          단골 고객 관리부터 매출 통계까지, MANE에서 한번에
        </p>
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-lg transition"
        >
          무료로 시작하기
        </button>
        <p className="text-sm text-gray-400 mt-4">신용카드 등록 없이 바로 시작</p>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">왜 MANE인가요?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">간단한 요금제</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">무료</h3>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              0원<span className="text-base font-normal text-gray-400">/월</span>
            </p>
            <ul className="space-y-3 mb-6">
              {['고객 10명까지', '시술 기록', '기본 통계'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={16} className="text-violet-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 rounded-xl border-2 border-violet-500 text-violet-600 font-semibold hover:bg-violet-50 transition"
            >
              시작하기
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl border-2 border-violet-400 p-6 text-white relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-violet-900 text-xs font-bold px-3 py-1 rounded-full">
              추천
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} />
              <h3 className="text-xl font-bold">프리미엄</h3>
            </div>
            <p className="text-3xl font-bold mb-4">
              9,900원<span className="text-base font-normal opacity-80">/월</span>
            </p>
            <ul className="space-y-3 mb-6">
              {['무제한 고객 관리', '엑셀 내보내기', '데이터 백업', '우선 지원'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 rounded-xl bg-white text-violet-600 font-semibold hover:bg-gray-50 transition"
            >
              시작하기
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">지금 바로 시작하세요</h2>
        <p className="text-lg text-gray-600 mb-8">무료 플랜으로 시작해서 필요할 때 업그레이드</p>
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-lg transition"
        >
          무료로 시작하기
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 MANE. 미용실 관리 앱</p>
        </div>
      </div>
    </div>
  )
}
