import { utils, writeFile } from 'xlsx'
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns'
import type { Customer, ServiceRecord } from '../types'

export type DateRangeType = 'all' | 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'custom'

interface DateRange {
  start: Date
  end: Date
}

/** 기간 타입에 따른 날짜 범위 계산 */
function getDateRange(type: DateRangeType, customRange?: DateRange): DateRange {
  const now = new Date()

  switch (type) {
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case 'lastMonth': {
      const lastMonth = subMonths(now, 1)
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) }
    }
    case 'last3Months':
      return { start: subMonths(now, 3), end: now }
    case 'last6Months':
      return { start: subMonths(now, 6), end: now }
    case 'custom':
      return customRange || { start: new Date(0), end: now }
    case 'all':
    default:
      return { start: new Date(0), end: new Date(2100, 0, 1) }
  }
}

/** 고객 목록 엑셀 내보내기 */
export function exportCustomers(customers: Customer[]) {
  const headers = ['이름', '전화번호', '메모', '최근 방문', '등록일']
  const rows = customers.map((c) => [
    c.name,
    c.phone,
    c.memo || '',
    c.lastVisitDate ? format(c.lastVisitDate, 'yyyy.MM.dd') : '-',
    format(c.createdAt, 'yyyy.MM.dd'),
  ])

  const ws = utils.aoa_to_sheet([headers, ...rows])
  ws['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 22 }, { wch: 12 }, { wch: 12 }]

  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, '고객목록')
  writeFile(wb, `고객목록_${format(new Date(), 'yyyyMMdd')}.xlsx`)
}

/** 시술 기록 엑셀 내보내기 (기간별 필터링) */
export function exportRecords(
  records: ServiceRecord[],
  customers: Customer[],
  rangeType: DateRangeType = 'all',
  customRange?: DateRange
) {
  const customerMap = new Map(customers.map((c) => [c.id, c.name]))
  const range = getDateRange(rangeType, customRange)

  // 기간 필터링
  const filtered = records.filter((r) =>
    isWithinInterval(r.date, { start: range.start, end: range.end })
  )

  const sorted = [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime())

  const headers = ['날짜', '고객명', '시술명', '금액(원)', '메모']
  const rows = sorted.map((r) => [
    format(r.date, 'yyyy.MM.dd'),
    customerMap.get(r.customerId) || '(삭제된 고객)',
    r.menuName,
    r.price,
    r.memo || '',
  ])

  const ws = utils.aoa_to_sheet([headers, ...rows])
  ws['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 22 }]

  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, '시술기록')

  const periodLabel = rangeType === 'all' ? '전체' :
    rangeType === 'thisMonth' ? '이번달' :
    rangeType === 'lastMonth' ? '지난달' :
    rangeType === 'last3Months' ? '최근3개월' :
    rangeType === 'last6Months' ? '최근6개월' : '기간별'

  writeFile(wb, `시술기록_${periodLabel}_${format(new Date(), 'yyyyMMdd')}.xlsx`)
}

/** 매출 통계 엑셀 내보내기 (기간별 월별 집계) */
export function exportStats(
  records: ServiceRecord[],
  rangeType: DateRangeType = 'all',
  customRange?: DateRange
) {
  const range = getDateRange(rangeType, customRange)

  // 기간 필터링
  const filtered = records.filter((r) =>
    isWithinInterval(r.date, { start: range.start, end: range.end })
  )

  // 월별 그룹화
  const monthlyMap = new Map<string, { revenue: number; count: number }>()

  filtered.forEach((r) => {
    const monthKey = format(r.date, 'yyyy.MM')
    const current = monthlyMap.get(monthKey) || { revenue: 0, count: 0 }
    monthlyMap.set(monthKey, {
      revenue: current.revenue + r.price,
      count: current.count + 1,
    })
  })

  // 월별 정렬 (최신순)
  const sortedMonths = Array.from(monthlyMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))

  const headers = ['월', '매출(원)', '시술 건수', '평균 단가(원)']
  const rows = sortedMonths.map(([month, data]) => [
    month,
    data.revenue,
    data.count,
    Math.round(data.revenue / data.count),
  ])

  // 합계 행 추가
  const totalRevenue = filtered.reduce((sum, r) => sum + r.price, 0)
  const totalCount = filtered.length
  rows.push([
    '합계',
    totalRevenue,
    totalCount,
    totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0,
  ])

  const ws = utils.aoa_to_sheet([headers, ...rows])
  ws['!cols'] = [{ wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 14 }]

  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, '매출통계')

  const periodLabel = rangeType === 'all' ? '전체' :
    rangeType === 'thisMonth' ? '이번달' :
    rangeType === 'lastMonth' ? '지난달' :
    rangeType === 'last3Months' ? '최근3개월' :
    rangeType === 'last6Months' ? '최근6개월' : '기간별'

  writeFile(wb, `매출통계_${periodLabel}_${format(new Date(), 'yyyyMMdd')}.xlsx`)
}

/** 미용사별 통계 엑셀 내보내기 */
export function exportStylistStats(
  records: ServiceRecord[],
  rangeType: DateRangeType = 'all',
  customRange?: DateRange
) {
  const range = getDateRange(rangeType, customRange)

  // 기간 필터링
  const filtered = records.filter((r) =>
    isWithinInterval(r.date, { start: range.start, end: range.end })
  )

  // 미용사별 통계 계산
  const stylistMap = new Map<string, {
    name: string
    revenue: number
    count: number
    menus: Map<string, { name: string; count: number; revenue: number }>
  }>()

  filtered.forEach((record) => {
    if (!record.stylistId || !record.stylistName) return

    if (!stylistMap.has(record.stylistId)) {
      stylistMap.set(record.stylistId, {
        name: record.stylistName,
        revenue: 0,
        count: 0,
        menus: new Map(),
      })
    }

    const stat = stylistMap.get(record.stylistId)!
    stat.revenue += record.price
    stat.count += 1

    if (!stat.menus.has(record.menuId)) {
      stat.menus.set(record.menuId, {
        name: record.menuName,
        count: 0,
        revenue: 0,
      })
    }
    const menu = stat.menus.get(record.menuId)!
    menu.count += 1
    menu.revenue += record.price
  })

  // 엑셀 시트 1: 미용사별 요약
  const summaryHeaders = ['미용사', '매출(원)', '시술 건수', '평균 단가(원)']
  const summaryRows = Array.from(stylistMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .map((stat) => [
      stat.name,
      stat.revenue,
      stat.count,
      Math.round(stat.revenue / stat.count),
    ])

  const summaryWs = utils.aoa_to_sheet([summaryHeaders, ...summaryRows])
  summaryWs['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 14 }]

  // 엑셀 시트 2: 미용사별 시술 상세
  const detailHeaders = ['미용사', '시술명', '건수', '매출(원)']
  const detailRows: any[] = []

  Array.from(stylistMap.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .forEach(([_, stat]) => {
      Array.from(stat.menus.values())
        .sort((a, b) => b.revenue - a.revenue)
        .forEach((menu) => {
          detailRows.push([stat.name, menu.name, menu.count, menu.revenue])
        })
    })

  const detailWs = utils.aoa_to_sheet([detailHeaders, ...detailRows])
  detailWs['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 14 }]

  // 워크북 생성
  const wb = utils.book_new()
  utils.book_append_sheet(wb, summaryWs, '미용사별 요약')
  utils.book_append_sheet(wb, detailWs, '시술 상세')

  const periodLabel = rangeType === 'all' ? '전체' :
    rangeType === 'thisMonth' ? '이번달' :
    rangeType === 'lastMonth' ? '지난달' :
    rangeType === 'last3Months' ? '최근3개월' :
    rangeType === 'last6Months' ? '최근6개월' : '기간별'

  writeFile(wb, `미용사별통계_${periodLabel}_${format(new Date(), 'yyyyMMdd')}.xlsx`)
}
