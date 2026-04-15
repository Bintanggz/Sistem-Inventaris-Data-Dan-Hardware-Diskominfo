import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineMenu, HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';
import logoImg from '../../assets/kominfologosiindah.png';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar - desktop */}
      <Sidebar 
         collapsed={collapsed} 
         setCollapsed={setCollapsed} 
         className="hidden lg:flex fixed top-0 left-0 z-40 shadow-xl"
      />

      {/* Sidebar - mobile */}
      <Sidebar 
         collapsed={false} 
         setCollapsed={() => setMobileOpen(false)} 
         onMenuClick={() => setMobileOpen(false)}
         className={`lg:hidden fixed top-0 left-0 z-40 shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[256px]'}`}>
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between px-5 lg:px-8 h-[56px]">
            {/* Left: hamburger (mobile) + date */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <HiOutlineMenu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Mobile logo */}
              <div className="flex items-center lg:hidden">
                <img src={logoImg} alt="Logo" className="h-7 w-auto drop-shadow-sm" />
              </div>

              {/* Desktop date */}
              <p className="hidden lg:block text-[13px] text-gray-500 font-medium">{today}</p>
            </div>

            {/* Right: user */}
            <div className="flex items-center gap-1.5">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative" title="Notifikasi">
                <HiOutlineBell className="w-[18px] h-[18px] text-gray-400" />
              </button>

              <div className="hidden sm:flex items-center gap-2.5 pl-3 ml-1.5 border-l border-gray-200/80">
                <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                  <span className="text-[11px] text-white font-bold">{initials}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight">{user?.name}</p>
                  <p className="text-[11px] text-gray-400 capitalize leading-tight">{user?.role_display || user?.role}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="sm:hidden p-2 hover:bg-red-50 rounded-lg transition text-gray-400 hover:text-red-500"
                title="Keluar"
              >
                <HiOutlineLogout className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-5 lg:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
