import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IoGridOutline, IoCalendarOutline, IoAddCircleOutline, IoReceiptOutline, IoBarChartOutline, IoLogOutOutline, IoArrowBack, IoPersonOutline } from 'react-icons/io5'

const sidebarLinks = [
  { to: '/admin/dashboard', icon: IoGridOutline, label: 'Dashboard' },
  { to: '/admin/events', icon: IoCalendarOutline, label: 'My Events' },
//   { to: '/admin/events/create', icon: IoAddCircleOutline, label: 'Create Event' },
  { to: '/admin/orders', icon: IoReceiptOutline, label: 'Orders' },
  { to: '/admin/analytics', icon: IoBarChartOutline, label: 'Analytics' },
]

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0B0D1A] flex">
      {/* Sidebar - fixed full height */}
      <aside
        className="w-64 shrink-0 fixed top-0 left-0 h-full flex flex-col z-40"
        style={{
          background: 'linear-gradient(180deg, rgba(15,17,35,0.98) 0%, rgba(10,12,28,0.99) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              M
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Monora</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 ml-auto tracking-wider">ADMIN</span>
          </div>
        </div>

        {/* User Info */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
              <IoPersonOutline className="text-white text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm font-medium truncate">{user?.name}</div>
              <div className="text-white/30 text-[11px] capitalize">{user?.role === 'event_admin' ? 'Event Manager' : 'App Admin'}</div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin/events/create' || link.to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium no-underline transition-all ${
                  isActive
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`
              }
            >
              <link.icon className="text-lg shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 pb-5 pt-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all w-full bg-transparent border-none cursor-pointer"
          >
            <IoArrowBack className="text-lg" />
            Back to Site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full bg-transparent border-none cursor-pointer"
          >
            <IoLogOutOutline className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content - offset by sidebar width */}
      <main className="flex-1 min-w-0 ml-64">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
