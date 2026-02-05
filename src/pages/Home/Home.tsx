import { useMemo } from 'react'
import { isToday, isSameMonth, format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useCustomers } from '../../hooks/useCustomers'
import { useAllRecords } from '../../hooks/useRecords'

export default function Home() {
  const { customers, loading: customersLoading } = useCustomers()
  const { records, loading: recordsLoading } = useAllRecords()

  const todayRecords = useMemo(() => records.filter((r) => isToday(r.date)), [records])
  const monthRecords = useMemo(
    () => records.filter((r) => isSameMonth(r.date, new Date())),
    [records]
  )

  const todayRevenue = todayRecords.reduce((sum, r) => sum + r.price, 0)
  const monthRevenue = monthRecords.reduce((sum, r) => sum + r.price, 0)
  const recentRecords = records.slice(0, 5)

  if (customersLoading || recordsLoading) {
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
        <h1 className="text-2xl font-bold text-gray-800">MANE</h1>
        <p className="text-sm text-gray-400 mt-0.5">미용실 관리</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-4">
        {/* 오늘 / 이번 달 매출 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-violet-500 rounded-2xl p-4 text-white shadow-sm">
            <p className="text-xs opacity-75">오늘 매출</p>
            <p className="text-2xl font-bold mt-0.5">
              {todayRevenue.toLocaleString()}
              <span className="text-sm font-normal opacity-75 ml-0.5">원</span>
            </p>
            <p className="text-xs opacity-60 mt-1">{todayRecords.length}건</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">이번 달 매출</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">
              {monthRevenue.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-0.5">원</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{monthRecords.length}건</p>
          </div>
        </div>

        {/* 총 고객 수 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">총 고객 수</p>
          <p className="text-lg font-bold text-gray-800">
            {customers.length}
            <span className="text-sm font-normal text-gray-400 ml-0.5">명</span>
          </p>
        </div>

        {/* 최근 시술 5건 */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2.5">최근 시술</h2>
          {recentRecords.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-center py-10 text-gray-400 text-sm">시술 기록이 없습니다.</p>
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
