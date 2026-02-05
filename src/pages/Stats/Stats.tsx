import { useMemo } from 'react'
import { subMonths, isSameMonth, isSameYear, format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useAllRecords } from '../../hooks/useRecords'
import type { ServiceRecord } from '../../types'

// 마지막 6개 월의 통계 생성
function getMonthlyStats(records: ServiceRecord[]) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i)
    const monthRecords = records.filter(
      (r) => isSameMonth(r.date, month) && isSameYear(r.date, month)
    )
    return {
      label: format(month, 'M월'),
      revenue: monthRecords.reduce((sum, r) => sum + r.price, 0),
      visits: monthRecords.length,
      isCurrent: i === 5,
    }
  })
}

// 간단한 바 차트 (라이브러리 없이 순수 Tailwind)
interface BarChartItem {
  label: string
  value: number
  isCurrent: boolean
}

function BarChart({ data }: { data: BarChartItem[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex gap-1.5">
      {data.map((item) => {
        const heightPct = (item.value / maxValue) * 100
        return (
          <div key={item.label} className="flex-1 flex flex-col items-center">
            {/* 값 표시 */}
            <span className="text-xs font-medium text-gray-500 h-4 mb-1">
              {item.value > 0 ? item.value.toLocaleString() : ''}
            </span>
            {/* 바 영역 (고정 높이 컨테이너) */}
            <div className="w-full flex flex-col justify-end" style={{ height: 110 }}>
              <div
                className={`w-full rounded-t-sm ${item.isCurrent ? 'bg-violet-500' : 'bg-violet-200'}`}
                style={{ height: `${Math.max(heightPct, item.value > 0 ? 6 : 0)}%` }}
              />
            </div>
            {/* 월 라벨 */}
            <span
              className={`text-xs mt-1.5 ${item.isCurrent ? 'text-violet-500 font-semibold' : 'text-gray-400'}`}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function Stats() {
  const { records, loading } = useAllRecords()
  const monthlyData = useMemo(() => getMonthlyStats(records), [records])

  const currentMonth = monthlyData[5]

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
        <h1 className="text-xl font-bold text-gray-800">통계</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* 이번 달 요약 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">이번 달 매출</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {currentMonth.revenue.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-0.5">원</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">이번 달 방문</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {currentMonth.visits}
              <span className="text-sm font-normal text-gray-400 ml-0.5">회</span>
            </p>
          </div>
        </div>

        {/* 월별 매출 차트 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">월별 매출</h2>
          <BarChart data={monthlyData.map((d) => ({ label: d.label, value: d.revenue, isCurrent: d.isCurrent }))} />
        </div>

        {/* 월별 방문 횟수 차트 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">월별 방문 횟수</h2>
          <BarChart data={monthlyData.map((d) => ({ label: d.label, value: d.visits, isCurrent: d.isCurrent }))} />
        </div>
      </div>
    </div>
  )
}
