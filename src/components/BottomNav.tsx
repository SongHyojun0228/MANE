import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Scissors, BarChart2 } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/home',      label: '홈',   icon: Home },
  { path: '/customers', label: '고객', icon: Users },
  { path: '/services',  label: '시술', icon: Scissors },
  { path: '/stats',     label: '통계', icon: BarChart2 },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-lg">
      <div className="max-w-2xl mx-auto flex justify-around py-2">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path)
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-violet-500' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
