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
}
