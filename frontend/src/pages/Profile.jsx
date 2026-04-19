import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import { InputField } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineMail } from 'react-icons/hi';

const ROLE_STYLE = {
  admin:   { label: 'Admin',   className: 'bg-rose-50 text-rose-700' },
  petugas: { label: 'Petugas', className: 'bg-blue-50 text-blue-700' },
  viewer:  { label: 'Viewer',  className: 'bg-gray-100 text-gray-600' },
};

export default function Profile() {
  const { user, login } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [pwErrors, setPwErrors] = useState({});

  const roleStyle = ROLE_STYLE[user?.role] || { label: user?.role, className: 'bg-gray-100 text-gray-600' };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileLoading(true);
    try {
      const res = await updateProfile(profileForm);
      // Update stored user in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Force auth context refresh without full logout
      window.dispatchEvent(new Event('user-updated'));
      toast.success('Profil berhasil diperbarui');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setProfileErrors(data.errors);
      toast.error(data?.message || 'Gagal memperbarui profil');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwErrors({});
    if (pwForm.password !== pwForm.password_confirmation) {
      setPwErrors({ password_confirmation: ['Konfirmasi password tidak cocok'] });
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(pwForm);
      toast.success('Password berhasil diubah');
      setPwForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setPwErrors(data.errors);
      toast.error(data?.message || 'Gagal mengubah password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Profil Saya" subtitle="Kelola informasi akun dan keamanan" />

      {/* Info Card */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center flex-shrink-0">
            <span className="text-accent-700 font-bold text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <HiOutlineMail className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm text-gray-500">{user?.email}</span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyle.className}`}>
                <HiOutlineShieldCheck className="w-3 h-3" />
                {user?.role_display || roleStyle.label}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Form */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <HiOutlineUser className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Informasi Profil</h3>
            <p className="text-xs text-gray-400">Perbarui nama dan email akun Anda</p>
          </div>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <InputField
              label="Nama Lengkap"
              required
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
            {profileErrors.name && <p className="text-xs text-red-500 mt-1">{profileErrors.name[0]}</p>}
          </div>
          <div>
            <InputField
              label="Email"
              required
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            {profileErrors.email && <p className="text-xs text-red-500 mt-1">{profileErrors.email[0]}</p>}
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Form */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <HiOutlineLockClosed className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Keamanan Akun</h3>
            <p className="text-xs text-gray-400">Ubah password untuk menjaga keamanan akun</p>
          </div>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <InputField
              label="Password Saat Ini"
              required
              type="password"
              value={pwForm.current_password}
              onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
              placeholder="Masukkan password lama"
            />
            {pwErrors.current_password && <p className="text-xs text-red-500 mt-1">{pwErrors.current_password[0]}</p>}
          </div>
          <div>
            <InputField
              label="Password Baru"
              required
              type="password"
              value={pwForm.password}
              onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
              placeholder="Min. 6 karakter"
            />
            {pwErrors.password && <p className="text-xs text-red-500 mt-1">{pwErrors.password[0]}</p>}
          </div>
          <div>
            <InputField
              label="Konfirmasi Password Baru"
              required
              type="password"
              value={pwForm.password_confirmation}
              onChange={(e) => setPwForm({ ...pwForm, password_confirmation: e.target.value })}
              placeholder="Ulangi password baru"
            />
            {pwErrors.password_confirmation && <p className="text-xs text-red-500 mt-1">{pwErrors.password_confirmation[0]}</p>}
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={pwLoading} variant="secondary">
              {pwLoading ? 'Mengubah...' : 'Ubah Password'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
