import { useState } from 'react'
import { Plus, X, Pencil, Trash2, Loader2 } from 'lucide-react'
import type { ServiceMenu } from '../../types'
import { useServices } from '../../hooks/useServices'

// --- 모달: 메뉴 추가 / 수정 (공유) ---
interface MenuModalProps {
  menu: ServiceMenu | null // null = 추가모드, object = 수정모드
  onClose: () => void
  onSave: (data: Omit<ServiceMenu, 'id'>) => void
}

function MenuModal({ menu, onClose, onSave }: MenuModalProps) {
  const [name, setName] = useState(menu?.name ?? '')
  const [price, setPrice] = useState(menu ? String(menu.price) : '')

  const isValid = name.trim().length > 0 && Number(price) > 0

  const handleSubmit = () => {
    if (!isValid) return
    onSave({ name: name.trim(), price: Number(price) })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {menu ? '메뉴 수정' : '메뉴 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">가격 (원) *</label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                min="1"
                className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
            </div>
            {price && Number(price) > 0 && (
              <p className="text-xs text-gray-400 mt-1.5 pl-0.5">
                표시 가격: {Number(price).toLocaleString()}원
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-violet-600 transition"
            >
              {menu ? '저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- 삭제 확인 모달 ---
interface DeleteConfirmProps {
  menuName: string
  onClose: () => void
  onConfirm: () => void
}

function DeleteConfirm({ menuName, onClose, onConfirm }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">메뉴 삭제</h2>
        <p className="text-sm text-gray-500 mb-5">
          &apos;<span className="font-medium text-gray-700">{menuName}</span>&apos; 메뉴를 삭제하면
          복원할 수 없습니다.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

// --- 메인 페이지 ---
export default function Services() {
  const { menus, loading, addMenu, updateMenu, deleteMenu } = useServices()

  // 모달 상태: null = 닫힘, ServiceMenu = 수정모드
  const [editingMenu, setEditingMenu] = useState<ServiceMenu | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ServiceMenu | null>(null)

  const handleSave = async (data: Omit<ServiceMenu, 'id'>) => {
    if (editingMenu) {
      await updateMenu(editingMenu.id, data)
    } else {
      await addMenu(data)
    }
    setEditingMenu(null)
    setAddModalOpen(false)
  }

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteMenu(deleteTarget.id)
      setDeleteTarget(null)
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
          <h1 className="text-xl font-bold text-gray-800">시술 관리</h1>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            <Plus size={16} />
            추가
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        <p className="text-xs text-gray-400 px-1">총 {menus.length}가지 메뉴</p>

        {/* 메뉴 목록 */}
        {menus.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            메뉴가 아직 없습니다. 추가해보세요!
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {menus.map((menu, idx) => (
              <div
                key={menu.id}
                className={`flex items-center justify-between px-4 py-3.5 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}
              >
                {/* 이름 + 가격 */}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{menu.name}</p>
                  <p className="text-sm text-violet-500 font-medium mt-0.5">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>

                {/* 수정 / 삭제 버튼 */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingMenu(menu)}
                    className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(menu)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 추가 모달 */}
      {addModalOpen && (
        <MenuModal menu={null} onClose={() => setAddModalOpen(false)} onSave={handleSave} />
      )}

      {/* 수정 모달 */}
      {editingMenu && (
        <MenuModal menu={editingMenu} onClose={() => setEditingMenu(null)} onSave={handleSave} />
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <DeleteConfirm
          menuName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
