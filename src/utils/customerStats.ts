import { differenceInDays } from 'date-fns'
import type { ServiceRecord } from '../types'

export interface CustomerStats {
  totalVisits: number // 총 방문 횟수
  isRegular: boolean // 단골 여부 (3회 이상)
  averageCycle: number | null // 평균 방문 주기 (일)
  daysSinceLastVisit: number | null // 마지막 방문 후 경과일
  nextExpectedVisit: number | null // 다음 예상 방문일까지 남은 일수 (음수면 지남)
}

/**
 * 고객별 방문 통계 계산
 */
export function calculateCustomerStats(
  records: ServiceRecord[],
  customerId: string
): CustomerStats {
  // 해당 고객의 시술 기록만 필터링 및 날짜 정렬
  const customerRecords = records
    .filter((r) => r.customerId === customerId)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const totalVisits = customerRecords.length
  const isRegular = totalVisits >= 3

  // 방문이 없거나 1회만 방문한 경우
  if (totalVisits === 0) {
    return {
      totalVisits: 0,
      isRegular: false,
      averageCycle: null,
      daysSinceLastVisit: null,
      nextExpectedVisit: null,
    }
  }

  if (totalVisits === 1) {
    const lastVisit = customerRecords[0].date
    const daysSinceLastVisit = differenceInDays(new Date(), lastVisit)
    return {
      totalVisits: 1,
      isRegular: false,
      averageCycle: null,
      daysSinceLastVisit,
      nextExpectedVisit: null,
    }
  }

  // 2회 이상 방문: 평균 주기 계산
  const intervals: number[] = []
  for (let i = 1; i < customerRecords.length; i++) {
    const interval = differenceInDays(customerRecords[i].date, customerRecords[i - 1].date)
    intervals.push(interval)
  }

  const averageCycle = Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length)

  const lastVisit = customerRecords[customerRecords.length - 1].date
  const daysSinceLastVisit = differenceInDays(new Date(), lastVisit)

  // 다음 예상 방문일까지 남은 일수 (평균 주기 기준)
  const nextExpectedVisit = averageCycle - daysSinceLastVisit

  return {
    totalVisits,
    isRegular,
    averageCycle,
    daysSinceLastVisit,
    nextExpectedVisit,
  }
}

/**
 * 재방문 알림 메시지 생성
 */
export function getVisitMessage(stats: CustomerStats): string | null {
  if (stats.totalVisits === 0) return null
  if (stats.totalVisits === 1) {
    return `${stats.daysSinceLastVisit}일 전 방문`
  }

  const { daysSinceLastVisit, nextExpectedVisit } = stats

  // 다음 방문 예정일이 다가옴 (3일 이내)
  if (nextExpectedVisit !== null && nextExpectedVisit >= 0 && nextExpectedVisit <= 3) {
    return nextExpectedVisit === 0
      ? '오늘 재방문 예정!'
      : `${nextExpectedVisit}일 후 재방문 예정`
  }

  // 예정일이 지났을 경우 (평균 주기 대비 늦음)
  if (nextExpectedVisit !== null && nextExpectedVisit < 0) {
    return `재방문 ${Math.abs(nextExpectedVisit)}일 지남`
  }

  // 일반적인 경우
  return `${daysSinceLastVisit}일 전 방문`
}
