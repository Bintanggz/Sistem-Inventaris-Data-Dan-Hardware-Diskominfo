import { useState } from 'react';
import {
  HiOutlineExclamation,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

/**
 * CriticalAlertBanner
 * Displays collapsible warning banners for:
 * - Items older than 5 years (need replacement)
 * - Overdue borrowings
 */
export default function CriticalAlertBanner({ overdueCount = 0, criticalItemsCount = 0 }) {
  const [dismissed, setDismissed] = useState(() => {
    // Auto-reset dismissal daily
    const stored = localStorage.getItem('alert_dismissed_date');
    const today = new Date().toDateString();
    return stored === today;
  });

  const hasCritical = overdueCount > 0 || criticalItemsCount > 0;
  if (!hasCritical || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem('alert_dismissed_date', new Date().toDateString());
    setDismissed(true);
  };

  return (
    <div className="space-y-2">
      {/* Overdue borrowings */}
      {overdueCount > 0 && (
        <div className="relative flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200/70 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <HiOutlineClock className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-800">
              {overdueCount} Peminjaman Melewati Jatuh Tempo
            </p>
            <p className="text-xs text-red-600/80 mt-0.5">
              Terdapat peminjaman yang belum dikembalikan setelah melewati tanggal jatuh tempo.
            </p>
          </div>
          <Link
            to="/borrowings"
            className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap"
          >
            Lihat <HiOutlineChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Critical items (>5 years) */}
      {criticalItemsCount > 0 && (
        <div className="relative flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/70 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <HiOutlineExclamation className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              {criticalItemsCount} Barang Disarankan untuk Diganti
            </p>
            <p className="text-xs text-amber-700/80 mt-0.5">
              Barang-barang ini telah berumur lebih dari 5 tahun dan disarankan untuk dilakukan pengadaan pengganti.
            </p>
          </div>
          <Link
            to="/items"
            className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap"
          >
            Lihat <HiOutlineChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Dismiss button */}
      <div className="flex justify-end">
        <button
          onClick={handleDismiss}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition"
        >
          <HiOutlineX className="w-3 h-3" /> Sembunyikan hari ini
        </button>
      </div>
    </div>
  );
}
