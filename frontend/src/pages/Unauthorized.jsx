import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineArrowLeft, HiOutlineShieldExclamation } from 'react-icons/hi';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/80 p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-100 flex items-center justify-center shadow-xl shadow-rose-100">
            <HiOutlineShieldExclamation className="w-20 h-20 text-rose-400" />
          </div>
          <div className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-orange-300 shadow-md" />
          <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full bg-rose-300 shadow-md" />
          <div className="absolute top-1 -left-6 w-3 h-3 rounded-full bg-amber-300 shadow-sm" />
          {/* Badge 403 */}
          <div className="absolute -bottom-3 -right-2 bg-rose-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-md">
            403
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Anda tidak memiliki izin untuk mengakses halaman ini.
          Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
          >
            <HiOutlineArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition shadow-sm shadow-accent-500/20"
          >
            <HiOutlineHome className="w-4 h-4" /> Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
