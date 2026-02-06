import { useState, useMemo } from 'react'
import { Plus, X, Phone, Loader2, Check } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useReservations } from '../../hooks/useReservations'
import { useCustomers } from '../../hooks/useCustomers'
import { useServices } from '../../hooks/useServices'
import { useStylists } from '../../hooks/useStylists'
import { useAuth } from '../../context/AuthContext'
import { addRecord, getRecordByReservationId, deleteRecord } from '../../firebase/records'
import type { Reservation, Customer, ServiceMenu, Stylist } from '../../types'

// --- 모달: 예약 추가/수정 ---
interface ReservationModalProps {
  reservation?: Reservation // 수정 시
  customers: Customer[]
  menus: ServiceMenu[]
  stylists: Stylist[]
  onClose: () => void
  onSave: (data: Omit<Reservation, 'id' | 'createdAt'>) => void
}

function ReservationModal({ reservation, customers, menus, stylists, onClose, onSave }: ReservationModalProps) {
  const [customerId, setCustomerId] = useState(reservation?.customerId || '')
  const [date, setDate] = useState(
    reservation ? format(reservation.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  )
  const [time, setTime] = useState(reservation?.time || '10:00')
  const [menuId, setMenuId] = useState(reservation?.menuId || '')
  const [stylistId, setStylistId] = useState(reservation?.stylistId || '')
  const [memo, setMemo] = useState(reservation?.memo || '')
  const [status, setStatus] = useState<Reservation['status']>(reservation?.status || 'scheduled')

  const selectedCustomer = customers.find((c) => c.id === customerId)
  const selectedMenu = menus.find((m) => m.id === menuId)
  const selectedStylist = stylists.find((s) => s.id === stylistId)
  const isValid = customerId && date && time

  // 선택된 미용사의 메뉴만 필터링
  const availableMenus = stylistId
    ? menus.filter((m) => {
        // 미용사가 배정되지 않은 메뉴(공용) 또는 선택된 미용사가 포함된 메뉴만 표시
        return !m.stylistIds || m.stylistIds.length === 0 || m.stylistIds.includes(stylistId)
      })
    : menus

  const handleSubmit = () => {
    if (!isValid || !selectedCustomer) return
    const [year, month, day] = date.split('-').map(Number)
    onSave({
      customerId,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      date: new Date(year, month - 1, day),
      time,
      menuId: menuId || undefined,
      menuName: selectedMenu?.name,
      stylistId: stylistId || undefined,
      stylistName: selectedStylist?.name,
      memo: memo.trim() || undefined,
      status,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {reservation ? '예약 수정' : '예약 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">고객 *</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">고객 선택</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">날짜 *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">시간 *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">담당 미용사</label>
            <select
              value={stylistId}
              onChange={(e) => {
                setStylistId(e.target.value)
                setMenuId('') // 미용사 변경 시 메뉴 초기화
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">선택 안 함</option>
              {stylists.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">시술 메뉴</label>
            <select
              value={menuId}
              onChange={(e) => setMenuId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">선택 안 함</option>
              {availableMenus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.price.toLocaleString()}원)
                </option>
              ))}
            </select>
            {stylistId && availableMenus.length === 0 && (
              <p className="text-xs text-gray-400 mt-1.5">선택한 미용사의 메뉴가 없습니다.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">메모</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="특이사항 등"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {reservation && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">상태</label>
              <div className="flex gap-2">
                {(['scheduled', 'completed', 'cancelled'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                      status === s
                        ? 'bg-violet-500 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s === 'scheduled' && '예약'}
                    {s === 'completed' && '완료'}
                    {s === 'cancelled' && '취소'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-violet-600"
            >
              {reservation ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- 메인: 예약 페이지 ---
export default function Reservations() {
  const { reservations, loading, addReservation, updateReservation } = useReservations()
  const { customers } = useCustomers()
  const { menus } = useServices()
  const { stylists } = useStylists()
  const { user } = useAuth()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | undefined>()

  // 선택된 날짜의 예약 필터링 + 시간순 정렬
  const filteredReservations = useMemo(() => {
    return reservations
      .filter((r) => isSameDay(r.date, selectedDate))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [reservations, selectedDate])

  // 시간대별 슬롯 생성 (09:00 ~ 20:00) - 여러 예약 가능
  const timeSlots = useMemo(() => {
    const slots: { time: string; reservations: Reservation[] }[] = []
    for (let hour = 9; hour <= 20; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`
      const reservations = filteredReservations.filter((r) => r.time.startsWith(timeStr.slice(0, 2)))
      slots.push({ time: timeStr, reservations })
    }
    return slots
  }, [filteredReservations])

  const handleAdd = () => {
    setEditingReservation(undefined)
    setModalOpen(true)
  }

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation)
    setModalOpen(true)
  }

  const handleSave = async (data: Omit<Reservation, 'id' | 'createdAt'>) => {
    if (editingReservation) {
      const wasCompleted = editingReservation.status === 'completed'
      const nowCompleted = data.status === 'completed'

      await updateReservation(editingReservation.id, data)

      // 완료 → 취소: 시술 이력 삭제
      if (wasCompleted && data.status === 'cancelled') {
        const existingRecord = await getRecordByReservationId(editingReservation.id)
        if (existingRecord) {
          await deleteRecord(existingRecord.id)
        }
      }

      // 완료 상태로 변경되는 경우 시술 이력 추가 (중복 방지)
      if (nowCompleted && data.menuId && data.menuName && user) {
        const existingRecord = await getRecordByReservationId(editingReservation.id)

        if (!existingRecord) {
          const menu = menus.find((m) => m.id === data.menuId)

          if (menu) {
            const recordData: any = {
              customerId: data.customerId,
              menuId: data.menuId,
              menuName: data.menuName,
              price: menu.price,
              date: data.date,
              reservationId: editingReservation.id,
            }
            if (data.memo) {
              recordData.memo = data.memo
            }
            if (data.stylistId) {
              recordData.stylistId = data.stylistId
              recordData.stylistName = data.stylistName
            }

            await addRecord(recordData, user.uid)
          }
        }
      }
    } else {
      await addReservation(data)
    }
  }

  if (loading) {
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
          <h1 className="text-xl font-bold text-gray-800">예약 관리</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            <Plus size={16} />
            추가
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* 날짜 선택 */}
        <div>
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value + 'T00:00:00'))}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* 시간대별 캘린더 */}
        <div>
          <p className="text-xs text-gray-400 mb-2 px-1">
            {format(selectedDate, 'M월 d일 (EEE)', { locale: ko })} · 총 {filteredReservations.length}건
          </p>

          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus size={24} className="text-blue-300" />
              </div>
              <p className="text-sm text-gray-400 mb-1">이 날짜에 예약이 없어요</p>
              <p className="text-xs text-gray-300 mb-4">새로운 예약을 추가해보세요</p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
              >
                <Plus size={16} />
                예약 추가
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {timeSlots.map((slot, idx) => (
              <div
                key={slot.time}
                className={`flex ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
              >
                {/* 시간 */}
                <div className="w-16 flex-shrink-0 py-3 px-3 bg-gray-50 border-r border-gray-100">
                  <span className="text-xs font-medium text-gray-500">{slot.time}</span>
                </div>

                {/* 예약 내용 (여러 개 가능) */}
                <div className="flex-1 py-3 px-4">
                  {slot.reservations.length === 0 ? (
                    <button
                      onClick={handleAdd}
                      className="text-xs text-gray-300 hover:text-violet-400 transition"
                    >
                      예약 없음
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {slot.reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          onClick={() => handleEdit(reservation)}
                          className="p-2 rounded-lg hover:bg-violet-50 cursor-pointer transition border border-transparent hover:border-violet-200"
                          style={{ borderLeftWidth: '3px', borderLeftColor: reservation.stylistName ? stylists.find(s => s.id === reservation.stylistId)?.color : '#d1d5db' }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-800">
                              {reservation.customerName}
                            </span>
                            <span className="text-xs text-gray-500">{reservation.time}</span>
                            {reservation.stylistName && (
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                {reservation.stylistName}
                              </span>
                            )}
                            {reservation.status === 'completed' && (
                              <span className="flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <Check size={10} />
                                완료
                              </span>
                            )}
                            {reservation.status === 'cancelled' && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                취소
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Phone size={11} />
                              {reservation.customerPhone}
                            </span>
                            {reservation.menuName && (
                              <span className="text-violet-600">· {reservation.menuName}</span>
                            )}
                          </div>
                          {reservation.memo && (
                            <p className="text-xs text-gray-400 mt-1">{reservation.memo}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>

      {/* 예약 추가/수정 모달 */}
      {modalOpen && (
        <ReservationModal
          reservation={editingReservation}
          customers={customers}
          menus={menus}
          stylists={stylists}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
