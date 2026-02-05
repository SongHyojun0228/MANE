import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Phone, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import type { ServiceMenu, ServiceRecord } from '../../types'
import { useCustomer } from '../../hooks/useCustomers'
import { useRecords } from '../../hooks/useRecords'
import { useServices } from '../../hooks/useServices'

// --- 모달: 시술 기록 추가 ---
interface AddRecordModalProps {
  customerId: string
  menus: ServiceMenu[]
  onClose: () => void
  onAdd: (record: Omit<ServiceRecord, 'id'>) => void
}

function AddRecordModal({ customerId, menus, onClose, onAdd }: AddRecordModalProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [menuId, setMenuId] = useState('')
  const [price, setPrice] = useState('')
  const [memo, setMemo] = useState('')

  const selectedMenu = menus.find((m) => m.id === menuId)
  const isValid = date && menuId && Number(price) > 0

  /** 메뉴 선택 시 가격 자동 채우기 */
  const handleMenuChange = (e: { target: { value: string } }) => {
    const menu = menus.find((m) => m.id === e.target.value)
    setMenuId(e.target.value)
    if (menu) setPrice(String(menu.price))
  }

  const handleSubmit = () => {
    if (!isValid || !selectedMenu) return
    // "2026-02-05" → 로컬 날짜로 파싱 (UTC 오프셋 방지)
    const [year, month, day] = date.split('-').map(Number)
    onAdd({
      customerId,
      menuId,
      menuName: selectedMenu.name,
      price: Number(price),
      date: new Date(year, month - 1, day),
      memo: memo.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">시술 기록 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">날짜 *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">시술 메뉴 *</label>
            <select
              value={menuId}
              onChange={handleMenuChange}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            >
              <option value="">메뉴 선택</option>
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.price.toLocaleString()}원)
                </option>
              ))}
            </select>
            {menus.length === 0 && (
              <p className="text-xs text-red-400 mt-1.5">시술 메뉴가 없습니다. 먼저 메뉴를 추가해주세요.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">가격 (원) *</label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="메뉴 선택 시 자동 입력"
                min="1"
                className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">메모</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="특비사항 등"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>

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
              disabled={!isValid}
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

// --- 메인: 고객 상세 페이지 ---
export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { customer, loading: customerLoading } = useCustomer(id!)
  const { records, loading: recordsLoading, addRecord } = useRecords(id!)
  const { menus } = useServices()

  const [modalOpen, setModalOpen] = useState(false)

  // 통계 계산
  const totalVisits = records.length
  const totalRevenue = useMemo(() => records.reduce((sum, r) => sum + r.price, 0), [records])

  // 로딩
  if (customerLoading || recordsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="text-violet-500 animate-spin" />
      </div>
    )
  }

  // 고객 없음 (잘못된 URL 등)
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500 text-sm">고객 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/customers')}
          className="text-violet-500 text-sm font-medium hover:underline"
        >
          ← 목록으로
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/customers')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{customer.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* 고객 정보 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500">{customer.phone}</span>
          </div>
          {customer.memo && (
            <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">{customer.memo}</p>
          )}
        </div>

        {/* 통계 카드 2열 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">총 방문</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">
              {totalVisits}
              <span className="text-sm font-normal text-gray-400 ml-0.5">회</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">총 매출</p>
            <p className="text-2xl font-bold text-violet-600 mt-0.5">
              {totalRevenue.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-0.5">원</span>
            </p>
          </div>
        </div>

        {/* 시술 이력 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-gray-700">시술 이력</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 text-violet-500 hover:text-violet-600 text-sm font-medium transition"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {records.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-center py-12 text-gray-400 text-sm">시술 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {records.map((record, idx) => (
                <div
                  key={record.id}
                  className={`px-4 py-3 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{record.menuName}</span>
                    <span className="text-sm font-medium text-violet-500">
                      {record.price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">
                      {format(record.date, 'yyyy년 M월 d일')}
                    </span>
                    {record.memo && (
                      <span className="text-xs text-gray-400">· {record.memo}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 시술 기록 추가 모달 */}
      {modalOpen && (
        <AddRecordModal
          customerId={id!}
          menus={menus}
          onClose={() => setModalOpen(false)}
          onAdd={addRecord}
        />
      )}
    </div>
  )
}
