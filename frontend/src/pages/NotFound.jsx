import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineArrowLeft } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/80 p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-accent-100 to-blue-100 flex items-center justify-center shadow-xl shadow-blue-100">
            <span className="text-6xl font-black text-accent-500 tracking-tighter select-none">
              404
            </span>
          </div>
          {/* Floating dots decoration */}
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-300 shadow-md" />
          <div className="absolute -bottom-2 -left-4 w-4 h-4 rounded-full bg-rose-300 shadow-md" />
          <div className="absolute top-6 -left-6 w-3 h-3 rounded-full bg-blue-300 shadow-sm" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          Periksa kembali URL atau kembali ke halaman utama.
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
