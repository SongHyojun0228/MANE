import { useState } from 'react'
import { Plus, X, Pencil, Trash2, Loader2, User, Scissors } from 'lucide-react'
import type { ServiceMenu, Stylist } from '../../types'
import { useServices } from '../../hooks/useServices'
import { useStylists } from '../../hooks/useStylists'

// --- 모달: 메뉴 추가 / 수정 ---
interface MenuModalProps {
  menu: ServiceMenu | null
  stylists: Stylist[]
  onClose: () => void
  onSave: (data: Omit<ServiceMenu, 'id'>) => void
}

function MenuModal({ menu, stylists, onClose, onSave }: MenuModalProps) {
  const [name, setName] = useState(menu?.name ?? '')
  const [price, setPrice] = useState(menu ? String(menu.price) : '')
  const [selectedStylistIds, setSelectedStylistIds] = useState<string[]>(menu?.stylistIds ?? [])
  const isValid = name.trim().length > 0 && Number(price) > 0

  const toggleStylist = (stylistId: string) => {
    setSelectedStylistIds((prev) =>
      prev.includes(stylistId) ? prev.filter((id) => id !== stylistId) : [...prev, stylistId]
    )
  }

  const handleSubmit = () => {
    if (!isValid) return
    onSave({
      name: name.trim(),
      price: Number(price),
      stylistIds: selectedStylistIds, // 빈 배열이면 모든 미용사
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{menu ? '메뉴 수정' : '메뉴 추가'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">시술 이름 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 컷, 펌, 염색"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">가격 (원) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15000"
              min="1"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">담당 미용사 (여러 명 선택 가능)</label>
            {stylists.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">미용사를 먼저 추가해주세요.</p>
            ) : (
              <div className="space-y-2 border border-gray-200 rounded-xl p-3">
                {stylists.map((stylist) => (
                  <label key={stylist.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedStylistIds.includes(stylist.id)}
                      onChange={() => toggleStylist(stylist.id)}
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700">{stylist.name}</span>
                  </label>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1.5">선택 안 하면 모든 미용사가 가능한 메뉴</p>
          </div>

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
              {menu ? '저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- 모달: 미용사 추가 / 수정 ---
interface StylistModalProps {
  stylist: Stylist | null
  onClose: () => void
  onSave: (data: Omit<Stylist, 'id' | 'createdAt' | 'color'>) => void
}

function StylistModal({ stylist, onClose, onSave }: StylistModalProps) {
  const [name, setName] = useState(stylist?.name ?? '')
  const [phone, setPhone] = useState(stylist?.phone ?? '')
  const isValid = name.trim().length > 0

  const handleSubmit = () => {
    if (!isValid) return
    onSave({ name: name.trim(), phone: phone.trim() || undefined })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{stylist ? '미용사 수정' : '미용사 추가'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">이름 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김디자이너"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

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
              {stylist ? '저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- 메인 페이지 ---
export default function Services() {
  const { menus, loading: menusLoading, addMenu, updateMenu, deleteMenu } = useServices()
  const { stylists, loading: stylistsLoading, addStylist, updateStylist, deleteStylist } = useStylists()

  const [editingMenu, setEditingMenu] = useState<ServiceMenu | null>(null)
  const [addMenuModalOpen, setAddMenuModalOpen] = useState(false)

  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null)
  const [addStylistModalOpen, setAddStylistModalOpen] = useState(false)

  const handleMenuSave = async (data: Omit<ServiceMenu, 'id'>) => {
    if (editingMenu) {
      await updateMenu(editingMenu.id, data)
    } else {
      await addMenu(data)
    }
    setEditingMenu(null)
    setAddMenuModalOpen(false)
  }

  const handleStylistSave = async (data: Omit<Stylist, 'id' | 'createdAt' | 'color'>) => {
    if (editingStylist) {
      await updateStylist(editingStylist.id, data)
    } else {
      await addStylist(data)
    }
    setEditingStylist(null)
    setAddStylistModalOpen(false)
  }

  if (menusLoading || stylistsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="text-violet-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">시술 관리</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
        {/* 시술 메뉴 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-gray-700">시술 메뉴</h2>
            <button
              onClick={() => setAddMenuModalOpen(true)}
              className="flex items-center gap-1 text-violet-500 hover:text-violet-600 text-sm font-medium"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {menus.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-violet-100 rounded-full flex items-center justify-center">
                <Scissors size={24} className="text-violet-300" />
              </div>
              <p className="text-sm text-gray-400 mb-1">아직 시술 메뉴가 없어요</p>
              <p className="text-xs text-gray-300">컷, 펌, 염색 등 메뉴를 추가해보세요</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {menus.map((menu, idx) => (
                <div
                  key={menu.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{menu.name}</p>
                      {menu.stylistIds && menu.stylistIds.length > 0 ? (
                        menu.stylistIds.map((id) => {
                          const stylist = stylists.find((s) => s.id === id)
                          return stylist ? (
                            <span key={id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {stylist.name}
                            </span>
                          ) : null
                        })
                      ) : (
                        <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">
                          모든 미용사
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-violet-500 font-medium mt-0.5">{menu.price.toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingMenu(menu)}
                      className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => confirm('메뉴를 삭제하시겠습니까?') && deleteMenu(menu.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 미용사 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-gray-700">미용사</h2>
            <button
              onClick={() => setAddStylistModalOpen(true)}
              className="flex items-center gap-1 text-violet-500 hover:text-violet-600 text-sm font-medium"
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {stylists.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={24} className="text-blue-300" />
              </div>
              <p className="text-sm text-gray-400 mb-1">아직 미용사가 없어요</p>
              <p className="text-xs text-gray-300">미용사를 추가하고 시술을 배정해보세요</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {stylists.map((stylist, idx) => (
                <div
                  key={stylist.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: stylist.color + '20' }}
                    >
                      <User size={16} style={{ color: stylist.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{stylist.name}</p>
                      {stylist.phone && <p className="text-xs text-gray-500 mt-0.5">{stylist.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingStylist(stylist)}
                      className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => confirm('미용사를 삭제하시겠습니까?') && deleteStylist(stylist.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달들 */}
      {addMenuModalOpen && (
        <MenuModal menu={null} stylists={stylists} onClose={() => setAddMenuModalOpen(false)} onSave={handleMenuSave} />
      )}
      {editingMenu && <MenuModal menu={editingMenu} stylists={stylists} onClose={() => setEditingMenu(null)} onSave={handleMenuSave} />}

      {addStylistModalOpen && (
        <StylistModal stylist={null} onClose={() => setAddStylistModalOpen(false)} onSave={handleStylistSave} />
      )}
      {editingStylist && (
        <StylistModal stylist={editingStylist} onClose={() => setEditingStylist(null)} onSave={handleStylistSave} />
      )}
    </div>
  )
}
