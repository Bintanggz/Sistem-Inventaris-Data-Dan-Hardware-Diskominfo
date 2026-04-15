import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineLocationMarker,
  HiOutlineSwitchHorizontal,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineDocumentReport,
  HiOutlineClock,
  HiOutlineChevronLeft,
  HiOutlineLogout,
} from 'react-icons/hi';
import logoImg from '../../assets/kominfologosiindah.png';

const menuSections = [
  {
    label: 'Utama',
    items: [
      { path: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
      { path: '/items', icon: HiOutlineCube, label: 'Barang' },
    ]
  },
  {
    label: 'Master Data',
    items: [
      { path: '/categories', icon: HiOutlineTag, label: 'Kategori' },
      { path: '/locations', icon: HiOutlineLocationMarker, label: 'Lokasi' },
    ]
  },
  {
    label: 'Transaksi',
    items: [
      { path: '/borrowings', icon: HiOutlineClipboardList, label: 'Peminjaman' },
      { path: '/mutations', icon: HiOutlineSwitchHorizontal, label: 'Mutasi' },
      { path: '/maintenance', icon: HiOutlineCog, label: 'Pemeliharaan' },
    ]
  },
  {
    label: 'Lainnya',
    items: [
      { path: '/reports', icon: HiOutlineDocumentReport, label: 'Laporan', roles: ['admin', 'petugas'] },
      { path: '/activity-log', icon: HiOutlineClock, label: 'Log Aktivitas', roles: ['admin'] },
    ]
  },
];

export default function Sidebar({ collapsed, setCollapsed, onMenuClick, className = '' }) {
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <aside
      className={`h-screen flex flex-col sidebar-transition ${
        collapsed ? 'w-[68px]' : 'w-[256px]'
      } ${className}`}
      style={{ background: 'linear-gradient(180deg, #0f1d32 0%, #152a45 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex-shrink-0 flex items-center justify-center p-1">
          <img src={logoImg} alt="Logo Diskominfo" className="w-10 h-auto drop-shadow-md" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-white font-bold text-base leading-tight tracking-tight">SiINDAH</h1>
            <p className="text-gray-500 text-[10px] leading-tight">Sistem Inventaris Data & Hardware</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
        {menuSections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || item.roles.some((r) => hasRole(r))
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              {collapsed && <div className="h-px bg-white/[0.06] mx-2 mb-2" />}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <li key={item.path} className="relative group">
                      <Link
                        to={item.path}
                        onClick={onMenuClick}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-accent-500/15 text-accent-400'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                        }`}
                        title={collapsed ? item.label : ''}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent-400 rounded-r-full" />
                        )}
                        <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-accent-400' : ''}`} />
                        {!collapsed && <span className="animate-fade-in truncate">{item.label}</span>}
                      </Link>
                      {collapsed && (
                        <div className="sidebar-tooltip">{item.label}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User & collapse */}
      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 px-1 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] text-accent-400 font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-[10px] capitalize">{user?.role_display || user?.role}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-[13px] transition-all flex-1"
            title="Keluar"
          >
            <HiOutlineLogout className="w-[18px] h-[18px]" />
            {!collapsed && <span>Keluar</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] rounded-lg transition-all"
            title={collapsed ? 'Perbesar' : 'Perkecil'}
          >
            <HiOutlineChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  );
}
