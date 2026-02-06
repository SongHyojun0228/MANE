import { useState, useMemo } from 'react'
import { subMonths, isSameMonth, isSameYear, format } from 'date-fns'
import { Loader2, Download, FileSpreadsheet, User, TrendingUp } from 'lucide-react'
import { useAllRecords } from '../../hooks/useRecords'
import { useCustomers } from '../../hooks/useCustomers'
import { useStylists } from '../../hooks/useStylists'
import { usePlan } from '../../hooks/usePlan'
import UpgradeModal from '../../components/UpgradeModal'
import { exportRecords, exportStats, exportStylistStats, type DateRangeType } from '../../utils/exportExcel'
import { calculateCustomerStats } from '../../utils/customerStats'
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
  const { records, loading: recordsLoading } = useAllRecords()
  const { customers, loading: customersLoading } = useCustomers()
  const { stylists, loading: stylistsLoading } = useStylists()
  const { plan } = usePlan()
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [exportPeriod, setExportPeriod] = useState<DateRangeType>('thisMonth')
  const monthlyData = useMemo(() => getMonthlyStats(records), [records])

  // 미용사별 통계 계산
  const stylistStats = useMemo(() => {
    const statsMap = new Map<string, {
      stylistId: string
      stylistName: string
      revenue: number
      count: number
      color: string
      menuStats: Map<string, { menuName: string; count: number; revenue: number }>
    }>()

    records.forEach((record) => {
      if (!record.stylistId || !record.stylistName) return

      if (!statsMap.has(record.stylistId)) {
        const stylist = stylists.find((s) => s.id === record.stylistId)
        statsMap.set(record.stylistId, {
          stylistId: record.stylistId,
          stylistName: record.stylistName,
          revenue: 0,
          count: 0,
          color: stylist?.color || '#9ca3af',
          menuStats: new Map(),
        })
      }

      const stats = statsMap.get(record.stylistId)!
      stats.revenue += record.price
      stats.count += 1

      // 메뉴별 통계
      if (!stats.menuStats.has(record.menuId)) {
        stats.menuStats.set(record.menuId, {
          menuName: record.menuName,
          count: 0,
          revenue: 0,
        })
      }
      const menuStat = stats.menuStats.get(record.menuId)!
      menuStat.count += 1
      menuStat.revenue += record.price
    })

    return Array.from(statsMap.values()).sort((a, b) => b.revenue - a.revenue)
  }, [records, stylists])

  // 단골 고객 통계
  const regularStats = useMemo(() => {
    const regularCustomers = customers.filter((c) => {
      const stats = calculateCustomerStats(records, c.id)
      return stats.isRegular
    })

    // 평균 재방문 주기 계산
    const cycles = customers
      .map((c) => calculateCustomerStats(records, c.id))
      .filter((s) => s.averageCycle !== null)
      .map((s) => s.averageCycle!)

    const averageCycle = cycles.length > 0
      ? Math.round(cycles.reduce((sum, val) => sum + val, 0) / cycles.length)
      : null

    // 재방문율 (2회 이상 방문 고객 비율)
    const returningCustomers = customers.filter((c) => {
      const stats = calculateCustomerStats(records, c.id)
      return stats.totalVisits >= 2
    })
    const returnRate = customers.length > 0
      ? Math.round((returningCustomers.length / customers.length) * 100)
      : 0

    return {
      regularCount: regularCustomers.length,
      averageCycle,
      returnRate,
    }
  }, [customers, records])

  const handleExportRecords = () => {
    if (plan !== 'premium') { setUpgradeModalOpen(true); return }
    exportRecords(records, customers, exportPeriod)
  }

  const handleExportStats = () => {
    if (plan !== 'premium') { setUpgradeModalOpen(true); return }
    exportStats(records, exportPeriod)
  }

  const handleExportStylistStats = () => {
    if (plan !== 'premium') { setUpgradeModalOpen(true); return }
    exportStylistStats(records, exportPeriod)
  }

  const loading = recordsLoading || customersLoading || stylistsLoading

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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-800">통계</h1>
          </div>

          {records.length > 0 && (
            /* 엑셀 내보내기 컨트롤 */
            <div className="flex items-center gap-2">
            <select
              value={exportPeriod}
              onChange={(e) => setExportPeriod(e.target.value as DateRangeType)}
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="thisMonth">이번 달</option>
              <option value="lastMonth">지난 달</option>
              <option value="last3Months">최근 3개월</option>
              <option value="last6Months">최근 6개월</option>
              <option value="all">전체 기간</option>
            </select>

            <button
              onClick={handleExportRecords}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-violet-500 hover:bg-violet-50 disabled:opacity-30 disabled:hover:text-gray-600 disabled:hover:bg-transparent border border-gray-200 rounded-xl transition"
              title="시술 기록 엑셀"
            >
              <Download size={16} />
              <span className="hidden sm:inline">시술기록</span>
            </button>

            <button
              onClick={handleExportStats}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-violet-500 hover:bg-violet-50 disabled:opacity-30 disabled:hover:text-gray-600 disabled:hover:bg-transparent border border-gray-200 rounded-xl transition"
              title="매출 통계 엑셀"
            >
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">매출통계</span>
            </button>

            <button
              onClick={handleExportStylistStats}
              disabled={records.length === 0 || stylistStats.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-violet-500 hover:bg-violet-50 disabled:opacity-30 disabled:hover:text-gray-600 disabled:hover:bg-transparent border border-gray-200 rounded-xl transition"
              title="미용사별 통계 엑셀"
            >
              <User size={16} />
              <span className="hidden sm:inline">미용사통계</span>
            </button>
            </div>
          )}
        </div>
      </div>

      {records.length === 0 ? (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-violet-100 rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-violet-300" />
            </div>
            <p className="text-sm text-gray-400 mb-1">아직 통계 데이터가 없어요</p>
            <p className="text-xs text-gray-300">시술 기록을 추가하면 매출과 방문 통계를 확인할 수 있어요</p>
          </div>
        </div>
      ) : (
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

        {/* 단골 고객 통계 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">단골 고객</p>
            <p className="text-xl font-bold text-amber-600 mt-0.5">
              {regularStats.regularCount}
              <span className="text-sm font-normal text-gray-400 ml-0.5">명</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">평균 주기</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {regularStats.averageCycle || '-'}
              <span className="text-sm font-normal text-gray-400 ml-0.5">일</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400">재방문율</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {regularStats.returnRate}
              <span className="text-sm font-normal text-gray-400 ml-0.5">%</span>
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

        {/* 미용사별 통계 */}
        {stylistStats.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">미용사별 통계</h2>
            <div className="space-y-3">
              {stylistStats.map((stat) => (
                <div key={stat.stylistId} className="border border-gray-100 rounded-xl p-3">
                  {/* 미용사 헤더 */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: stat.color + '20' }}
                    >
                      <User size={16} style={{ color: stat.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{stat.stylistName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span>매출 {stat.revenue.toLocaleString()}원</span>
                        <span>·</span>
                        <span>{stat.count}건</span>
                        <span>·</span>
                        <span>평균 {Math.round(stat.revenue / stat.count).toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>

                  {/* 시술별 상세 */}
                  <div className="space-y-1.5 pl-11">
                    {Array.from(stat.menuStats.values())
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((menu) => (
                        <div key={menu.menuName} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{menu.menuName}</span>
                          <div className="flex items-center gap-2 text-gray-500">
                            <span>{menu.count}건</span>
                            <span className="text-violet-600 font-medium">{menu.revenue.toLocaleString()}원</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      )}

      {/* 업그레이드 모달 */}
      {upgradeModalOpen && (
        <UpgradeModal
          onClose={() => setUpgradeModalOpen(false)}
          currentCount={customers.length}
          limit={10}
        />
      )}
    </div>
  )
}
