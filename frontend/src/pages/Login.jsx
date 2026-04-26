import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import logoImg from '../assets/kominfologosiindah.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* === PANEL KIRI === */}
      <div style={{
        width: '52%',
        background: 'linear-gradient(155deg, #0a1628 0%, #0f1d35 40%, #122145 70%, #1a2f5a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px',
        position: 'relative',
        overflow: 'hidden',
      }} className="login-left-panel">

        {/* Geometric lines latar — manual, bukan blob */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="200" x2="600" y2="400" stroke="white" strokeWidth="0.8"/>
          <line x1="0" y1="400" x2="600" y2="100" stroke="white" strokeWidth="0.5"/>
          <line x1="100" y1="0" x2="300" y2="800" stroke="white" strokeWidth="0.6"/>
          <line x1="400" y1="0" x2="600" y2="500" stroke="white" strokeWidth="0.4"/>
          <rect x="450" y="80" width="120" height="120" fill="none" stroke="white" strokeWidth="0.6" transform="rotate(15 510 140)"/>
          <rect x="30" y="550" width="80" height="80" fill="none" stroke="white" strokeWidth="0.5" transform="rotate(-10 70 590)"/>
          <circle cx="520" cy="680" r="80" fill="none" stroke="white" strokeWidth="0.6"/>
          <circle cx="80" cy="150" r="50" fill="none" stroke="white" strokeWidth="0.4"/>
        </svg>

        {/* Satu titik cahaya premium di kanan bawah */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          right: '-60px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <img src={logoImg} alt="Logo Diskominfo" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Tengah: Teks Utama */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Tag kecil elegan */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '100px',
            padding: '5px 14px',
            marginBottom: '28px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa' }}/>
            <span style={{ color: '#93c5fd', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Sistem Inventaris Digital
            </span>
          </div>

          <h1 style={{
            color: '#ffffff',
            fontSize: '52px',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
          }}>
            Si<span style={{ color: '#60a5fa' }}>INDAH</span>
          </h1>

          <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '15px', lineHeight: 1.7, maxWidth: '340px' }}>
            Platform pengelolaan inventaris data &amp; hardware Diskominfo yang transparan, efisien, dan akuntabel.
          </p>

          {/* Tiga atribut dengan garis pemisah vertikal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '48px' }}>
            {[
              { label: 'Inventaris', sub: 'Terpusat' },
              { label: 'Real-time', sub: 'Monitoring' },
              { label: 'Laporan', sub: 'Otomatis' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {i > 0 && <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }}/>}
                <div>
                  <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ color: 'rgba(148,163,184,0.5)', fontSize: '11px', marginTop: '2px' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer kiri */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px' }}>
            © 2025 Dinas Komunikasi dan Informatika
          </p>
        </div>
      </div>

      {/* === PANEL KANAN === */}
      <div style={{
        flex: 1,
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
      }}>

        {/* Texture dots sangat halus */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.4,
          pointerEvents: 'none',
        }}/>

        <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
          
          {/* Untuk mobile: logo */}
          <div className="login-mobile-logo" style={{ textAlign: 'center', marginBottom: '36px', display: 'none' }}>
            <img src={logoImg} alt="Logo" style={{ height: '44px', margin: '0 auto 12px', display: 'block' }}/>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Sistem Inventaris Data &amp; Hardware</p>
          </div>

          {/* Heading form */}
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '8px',
            }}>
              Masuk ke Akun
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              Silakan masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Field Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="nama@diskominfo.go.id"
                  required
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    fontSize: '14px',
                    color: '#0f172a',
                    background: focused === 'email' ? '#ffffff' : '#f1f5f9',
                    border: `1.5px solid ${focused === 'email' ? '#3b82f6' : 'transparent'}`,
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    boxShadow: focused === 'email' ? '0 0 0 4px rgba(59,130,246,0.08)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Field Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '13px 48px 13px 16px',
                    fontSize: '14px',
                    color: '#0f172a',
                    background: focused === 'password' ? '#ffffff' : '#f1f5f9',
                    border: `1.5px solid ${focused === 'password' ? '#3b82f6' : 'transparent'}`,
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    boxShadow: focused === 'password' ? '0 0 0 4px rgba(59,130,246,0.08)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  tabIndex={-1}
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Masuk */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '10px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(37,99,235,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 0.8s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>

          </form>

          {/* Footer kanan */}
          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#cbd5e1' }}>
            Akses terbatas hanya untuk petugas yang berwenang
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .login-left-panel { display: none !important; }
          .login-mobile-logo { display: block !important; }
        }

        #login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(37,99,235,0.38) !important;
        }
        #login-submit:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
