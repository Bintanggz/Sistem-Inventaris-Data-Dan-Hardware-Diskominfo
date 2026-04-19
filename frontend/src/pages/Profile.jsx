import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import { InputField } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineMail, HiOutlineCamera } from 'react-icons/hi';

const ROLE_STYLE = {
  admin:   { label: 'Admin',   className: 'bg-rose-50 text-rose-700' },
  petugas: { label: 'Petugas', className: 'bg-blue-50 text-blue-700' },
  viewer:  { label: 'Viewer',  className: 'bg-gray-100 text-gray-600' },
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [pwErrors, setPwErrors] = useState({});
  const fileInputRef = useRef();

  const roleStyle = ROLE_STYLE[user?.role] || { label: user?.role, className: 'bg-gray-100 text-gray-600' };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const currentAvatar = avatarPreview || user?.avatar_url;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileLoading(true);
    try {
      const payload = { ...profileForm };
      if (avatarFile) payload.avatar = avatarFile;

      const res = await updateProfile(payload);
      updateUser(res.data.user);
      setProfileForm({ name: res.data.user.name, email: res.data.user.email });
      setAvatarFile(null);
      setAvatarPreview(null);
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
          {/* Avatar besar dengan overlay kamera */}
          <div className="relative flex-shrink-0 group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-accent-100 flex items-center justify-center shadow-md ring-2 ring-white">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-accent-700 font-bold text-3xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Ganti foto"
            >
              <HiOutlineCamera className="w-6 h-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
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
            {avatarFile && (
              <p className="text-xs text-amber-600 mt-1.5 font-medium">
                📷 Foto baru dipilih — simpan profil untuk mengupload
              </p>
            )}
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
            <p className="text-xs text-gray-400">Perbarui nama, email, dan foto profil</p>
          </div>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {/* Avatar upload section dalam form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-accent-100 flex-shrink-0 ring-2 ring-gray-100">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-accent-700 font-bold text-xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-accent-600 hover:text-accent-700 border border-accent-200 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition"
                >
                  {currentAvatar ? 'Ganti Foto' : 'Upload Foto'}
                </button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP maks. 2MB</p>
              </div>
            </div>
          </div>

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
