import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';
import logoImg from '../assets/kominfologosiindah.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login berhasil!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel kiri — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1d32 0%, #1a365d 50%, #2563eb 100%)' }}>
        {/* Dekorasi */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-8 flex">
            <img src={logoImg} alt="Logo Diskominfo" className="h-16 w-auto drop-shadow-md" />
          </div>
          <h1 className="text-white text-4xl font-bold mb-3 tracking-tight">SiINDAH</h1>
          <p className="text-blue-200/80 text-lg mb-2">Sistem Inventaris Data & Hardware</p>
          <p className="text-blue-300/50 text-sm max-w-md leading-relaxed">
            Solusi modern untuk pengelolaan inventaris barang dan aset secara efisien, transparan, dan akuntabel.
          </p>

          <div className="mt-14 flex gap-10">
            {[
              { value: '100%', desc: 'Digital' },
              { value: 'Real-time', desc: 'Monitoring' },
              { value: 'Aman', desc: '& Terpercaya' },
            ].map((item) => (
              <div key={item.value}>
                <p className="text-white text-xl font-bold">{item.value}</p>
                <p className="text-blue-300/50 text-xs mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel kanan — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/80">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex justify-center mb-4">
              <img src={logoImg} alt="Logo Diskominfo" className="h-14 w-auto drop-shadow-sm" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SiINDAH</h1>
            <p className="text-gray-500 text-sm">Sistem Inventaris Data & Hardware</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Selamat Datang</h2>
            <p className="text-gray-500 text-sm mb-8">Masuk ke akun Anda untuk melanjutkan</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 outline-none transition-all text-sm"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15 outline-none transition-all text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
