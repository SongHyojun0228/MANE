/** 고객 정보 */
export interface Customer {
  id: string
  name: string
  phone: string
  memo?: string
  lastVisitDate?: Date
  createdAt: Date
}

/** 시술 메뉴 */
export interface ServiceMenu {
  id: string
  name: string       // 컷, 펌, 염색 등
  price: number
  stylistIds?: string[] // 담당 미용사들 (여러 명 가능)
}

/** 시술 기록 (고객별) */
export interface ServiceRecord {
  id: string
  customerId: string
  menuId: string
  menuName: string
  price: number
  date: Date
  memo?: string
  photos?: string[] // Firebase Storage URLs
  reservationId?: string // 예약에서 생성된 경우 예약 ID
  stylistId?: string // 담당 미용사 ID
  stylistName?: string // 담당 미용사 이름
}

/** 미용사 */
export interface Stylist {
  id: string
  name: string
  phone?: string
  color: string // 캘린더 색상 구분용
  createdAt: Date
}

/** 예약 */
export interface Reservation {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  date: Date // 예약 날짜
  time: string // "14:30" 형식
  menuId?: string
  menuName?: string
  stylistId?: string
  stylistName?: string
  memo?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  createdAt: Date
}
