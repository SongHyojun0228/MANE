import { useMemo } from 'react'
import { isToday, isSameMonth, isSameDay, format } from 'date-fns'
import { Loader2, LogOut, Calendar, Star, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCustomers } from '../../hooks/useCustomers'
import { useAllRecords } from '../../hooks/useRecords'
import { useReservations } from '../../hooks/useReservations'
import { useAuth } from '../../context/AuthContext'
import { calculateCustomerStats } from '../../utils/customerStats'

export default function Home() {
  const { logout } = useAuth()
  const { customers, loading: customersLoading } = useCustomers()
  const { records, loading: recordsLoading } = useAllRecords()
  const { reservations, loading: reservationsLoading } = useReservations()

  // 오늘/이번달 통계
  const todayRecords = useMemo(() => records.filter((r) => isToday(r.date)), [records])
  const monthRecords = useMemo(
    () => records.filter((r) => isSameMonth(r.date, new Date())),
    [records]
  )
  const todayRevenue = todayRecords.reduce((sum, r) => sum + r.price, 0)
  const monthRevenue = monthRecords.reduce((sum, r) => sum + r.price, 0)

  // 오늘 예약
  const todayReservations = useMemo(
    () => reservations.filter((r) => isSameDay(r.date, new Date()) && r.status === 'scheduled'),
    [reservations]
  )

  // 단골 고객 수
  const regularCustomers = useMemo(
    () => customers.filter((c) => calculateCustomerStats(records, c.id).isRegular),
    [customers, records]
  )

  const recentRecords = records.slice(0, 5)

  if (customersLoading || recordsLoading || reservationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="text-violet-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white px-4 pt-6 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">MANE</h1>
            <p className="text-sm text-gray-400 mt-0.5">미용실 관리</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* 오늘 / 이번 달 매출 */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/stats"
            className="bg-violet-500 rounded-2xl p-4 text-white shadow-sm hover:bg-violet-600 transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} />
              <p className="text-xs opacity-75">오늘 매출</p>
            </div>
            <p className="text-2xl font-bold mt-0.5">
              {todayRevenue.toLocaleString()}
              <span className="text-sm font-normal opacity-75 ml-0.5">원</span>
            </p>
            <p className="text-xs opacity-60 mt-1">{todayRecords.length}건</p>
          </Link>
          <Link
            to="/stats"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-gray-400" />
              <p className="text-xs text-gray-400">이번 달 매출</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">
              {monthRevenue.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-0.5">원</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{monthRecords.length}건</p>
          </Link>
        </div>

        {/* 고객 & 예약 통계 */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            to="/customers"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Users size={12} className="text-gray-400" />
              <p className="text-xs text-gray-400">고객</p>
            </div>
            <p className="text-lg font-bold text-gray-800">
              {customers.length}
              <span className="text-xs font-normal text-gray-400 ml-0.5">명</span>
            </p>
          </Link>
          <Link
            to="/customers?filter=regular"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={12} className="text-amber-500" />
              <p className="text-xs text-gray-400">단골</p>
            </div>
            <p className="text-lg font-bold text-amber-600">
              {regularCustomers.length}
              <span className="text-xs font-normal text-gray-400 ml-0.5">명</span>
            </p>
          </Link>
          <Link
            to="/reservations"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar size={12} className="text-blue-500" />
              <p className="text-xs text-gray-400">오늘 예약</p>
            </div>
            <p className="text-lg font-bold text-blue-600">
              {todayReservations.length}
              <span className="text-xs font-normal text-gray-400 ml-0.5">건</span>
            </p>
          </Link>
        </div>

        {/* 최근 시술 5건 */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-gray-700">최근 시술</h2>
            {recentRecords.length > 0 && (
              <Link to="/stats" className="text-xs text-violet-500 hover:text-violet-600">
                더보기
              </Link>
            )}
          </div>
          {recentRecords.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 mb-1">아직 시술 기록이 없어요</p>
              <p className="text-xs text-gray-300">고객에게 시술을 진행하고 기록을 남겨보세요</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {recentRecords.map((record, idx) => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between px-4 py-3 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{record.menuName}</p>
                    <p className="text-xs text-gray-400">{format(record.date, 'M월 d일')}</p>
                  </div>
                  <p className="text-sm font-medium text-violet-500">
                    {record.price.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
