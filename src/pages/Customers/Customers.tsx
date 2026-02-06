import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, X, Phone, User, ChevronRight, Loader2, Download, Star, Calendar } from 'lucide-react'
import { differenceInCalendarDays } from 'date-fns'
import type { Customer } from '../../types'
import { useCustomers } from '../../hooks/useCustomers'
import { useAllRecords } from '../../hooks/useRecords'
import { useReservations } from '../../hooks/useReservations'
import { usePlan } from '../../hooks/usePlan'
import UpgradeModal from '../../components/UpgradeModal'
import { exportCustomers } from '../../utils/exportExcel'
import { calculateCustomerStats, getVisitMessage } from '../../utils/customerStats'

// --- 모달: 고객 추가 폼 ---
interface AddCustomerModalProps {
  onClose: () => void
  onAdd: (customer: Omit<Customer, 'id' | 'createdAt'>) => void
}

function AddCustomerModal({ onClose, onAdd }: AddCustomerModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return
    onAdd({ name: name.trim(), phone: phone.trim(), memo: memo.trim() || undefined })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">고객 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 폼 */}
        <form action={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">이름 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">전화번호 *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="특비사항, 선호 시술 등"
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !phone.trim()}
              className="flex-1 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-violet-600 transition"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- 메인 페이지 ---
export default function Customers() {
  const { customers, loading, addCustomer } = useCustomers()
  const { records, loading: recordsLoading } = useAllRecords()
  const { reservations, loading: reservationsLoading } = useReservations()
  const { plan, limits } = usePlan()
  const [search, setSearch] = useState('')
  const [filterRegular, setFilterRegular] = useState(false) // 단골 필터
  const [modalOpen, setModalOpen] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  const handleAddClick = () => {
    if (customers.length >= limits.customers) {
      setUpgradeModalOpen(true)
    } else {
      setModalOpen(true)
    }
  }

  const handleExport = () => {
    if (plan !== 'premium') { setUpgradeModalOpen(true); return }
    exportCustomers(customers)
  }

  // 검색 + 단골 필터
  const filtered = useMemo(() => {
    let result = customers

    // 단골 필터
    if (filterRegular) {
      result = result.filter((c) => {
        const stats = calculateCustomerStats(records, c.id)
        return stats.isRegular
      })
    }

    // 검색 필터
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (c) => c.name.includes(q) || c.phone.includes(q) || (c.memo ?? '').toLowerCase().includes(q)
      )
    }

    return result
  }, [customers, records, search, filterRegular])

  // 로딩 중
  if (loading || recordsLoading || reservationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="text-violet-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">고객 관리</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={customers.length === 0}
              className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-transparent rounded-xl transition"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
            >
              <Plus size={16} />
              추가
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {/* 검색 */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 전화번호, 메모로 검색"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
        </div>

        {/* 필터 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRegular(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              !filterRegular
                ? 'bg-violet-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterRegular(true)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              filterRegular
                ? 'bg-violet-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Star size={12} />
            단골만
          </button>
        </div>

        {/* 건수 표시 */}
        <p className="text-xs text-gray-400 px-1">
          총 {customers.length}명
          {(search.trim() || filterRegular) && ` · 필터 결과 ${filtered.length}명`}
        </p>

        {/* 고객 목록 */}
        {filtered.length === 0 ? (
          search.trim() || filterRegular ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 mb-1">검색 결과가 없습니다</p>
              <p className="text-xs text-gray-300">다른 검색어나 필터로 시도해보세요</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-violet-100 rounded-full flex items-center justify-center">
                <User size={24} className="text-violet-300" />
              </div>
              <p className="text-sm text-gray-400 mb-1">아직 고객이 없어요</p>
              <p className="text-xs text-gray-300">첫 고객을 추가하고 관리를 시작해보세요</p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.map((customer, idx) => {
              const stats = calculateCustomerStats(records, customer.id)
              const visitMessage = getVisitMessage(stats)

              // 다가오는 예약 확인 (예약 상태만)
              const upcomingReservation = reservations
                .filter((r) => r.customerId === customer.id && r.status === 'scheduled')
                .sort((a, b) => a.date.getTime() - b.date.getTime())[0]

              // 예약이 있으면 예약 메시지 우선 표시
              let displayMessage = visitMessage
              let messageColor = 'bg-gray-50 text-gray-500'
              let showCalendar = false

              if (upcomingReservation) {
                const daysUntil = differenceInCalendarDays(upcomingReservation.date, new Date())
                if (daysUntil >= 0) {
                  displayMessage = daysUntil === 0 ? '오늘 예약' : `${daysUntil}일 후 예약`
                  messageColor = 'bg-blue-50 text-blue-600'
                  showCalendar = true
                }
              } else if (stats.nextExpectedVisit !== null && stats.nextExpectedVisit >= 0 && stats.nextExpectedVisit <= 3) {
                messageColor = 'bg-green-50 text-green-600'
              } else if (stats.nextExpectedVisit !== null && stats.nextExpectedVisit < 0) {
                messageColor = 'bg-orange-50 text-orange-600'
              }

              return (
                <Link
                  key={customer.id}
                  to={`/customers/${customer.id}`}
                  className={`flex items-center gap-3 px-4 py-3.5 hover:bg-violet-50 transition ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
                >
                  {/* 아바타 */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center relative">
                    <User size={18} className="text-violet-500" />
                    {stats.isRegular && (
                      <Star
                        size={12}
                        className="absolute -top-1 -right-1 text-amber-500 fill-amber-500"
                      />
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">{customer.name}</span>
                      {stats.isRegular && (
                        <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                          단골
                        </span>
                      )}
                      {displayMessage && (
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${messageColor}`}>
                          {showCalendar && <Calendar size={10} />}
                          {displayMessage}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone size={12} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{customer.phone}</span>
                      {stats.totalVisits > 0 && (
                        <span className="text-xs text-gray-400 ml-2">
                          · 총 {stats.totalVisits}회 방문
                        </span>
                      )}
                    </div>
                    {customer.memo && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{customer.memo}</p>
                    )}
                  </div>

                  {/* 클릭 힌트 아이콘 */}
                  <ChevronRight size={18} className="flex-shrink-0 text-gray-300" />
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* 모달 */}
      {modalOpen && <AddCustomerModal onClose={() => setModalOpen(false)} onAdd={addCustomer} />}
      {upgradeModalOpen && (
        <UpgradeModal
          onClose={() => setUpgradeModalOpen(false)}
          currentCount={customers.length}
          limit={limits.customers}
        />
      )}
    </div>
  )
}
