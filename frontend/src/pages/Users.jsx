import { useState, useEffect, useRef } from 'react';
import { getUsers, getRoles, createUser, updateUser, deleteUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { InputField, SelectField, SearchInput } from '../components/ui/Input';
import { SkeletonTable } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineUsers, HiOutlineShieldCheck, HiOutlineCamera } from 'react-icons/hi';

const ROLE_STYLE = {
  admin:   { label: 'Admin',   className: 'bg-rose-50 text-rose-700 border border-rose-200' },
  petugas: { label: 'Petugas', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  viewer:  { label: 'Viewer',  className: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

function RoleBadge({ role }) {
  const s = ROLE_STYLE[role] || { label: role, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
      <HiOutlineShieldCheck className="w-3 h-3" />
      {s.label}
    </span>
  );
}

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [filters, setFilters] = useState({ search: '', page: 1 });
  const [form, setForm] = useState({ name: '', email: '', role_id: '', password: '', password_confirmation: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState({ open: false, user: null, loading: false });
  const fileInputRef = useRef();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(filters);
      setUsers(res.data.data);
      setMeta(res.data.meta || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles().then((r) => setRoles(r.data.data));
  }, []);

  useEffect(() => { loadUsers(); }, [filters]);

  const resetForm = () => {
    setForm({ name: '', email: '', role_id: '', password: '', password_confirmation: '' });
    setErrors({});
    setEditUser(null);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, role_id: u.role_id, password: '', password_confirmation: '' });
    setEditUser(u);
    setAvatarFile(null);
    setAvatarPreview(u.avatar_url || null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('role_id', form.role_id);
      if (form.password) {
        formData.append('password', form.password);
        formData.append('password_confirmation', form.password_confirmation);
      }
      if (avatarFile) formData.append('avatar', avatarFile);

      if (editUser) {
        formData.append('_method', 'PUT');
        await updateUser(editUser.id, formData);
        toast.success('User berhasil diperbarui');
      } else {
        await createUser(formData);
        toast.success('User berhasil ditambahkan');
      }
      setModalOpen(false);
      resetForm();
      loadUsers();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      toast.error(data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = (u) => {
    setConfirmModal({ open: true, user: u, loading: false });
  };

  const confirmDelete = async () => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await deleteUser(confirmModal.user.id);
      toast.success('User berhasil dihapus');
      setConfirmModal({ open: false, user: null, loading: false });
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus user');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Manajemen User" subtitle="Kelola akun pengguna sistem">
        <Button id="add-user-btn" onClick={() => { resetForm(); setModalOpen(true); }}>
          <HiOutlinePlus className="w-4 h-4" /> Tambah User
        </Button>
      </PageHeader>

      <Card>
        <SearchInput
          id="search-users"
          icon={HiOutlineSearch}
          placeholder="Cari nama atau email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="max-w-sm"
        />
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-gray-200/60">
                <th className="text-left px-6 py-3">Nama</th>
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Role</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Bergabung</th>
                <th className="text-center px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}><SkeletonTable rows={5} cols={5} /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5}>
                  <EmptyState icon={HiOutlineUsers} title="Tidak ada user" description="Belum ada data pengguna" />
                </td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar: foto jika ada, inisial jika tidak */}
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-accent-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-accent-700 font-bold text-xs">{u.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{u.name}</p>
                        {u.id === currentUser?.id && (
                          <span className="text-[10px] text-emerald-600 font-medium">• Akun Anda</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-6 py-3 text-sm text-gray-400 hidden md:table-cell">{u.created_at?.split(' ')[0]}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition" title="Edit">
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button onClick={() => handleDelete(u)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition" title="Hapus">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} currentPage={filters.page} onPageChange={(page) => setFilters({ ...filters, page })} />
      </Card>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editUser ? 'Edit User' : 'Tambah User'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-accent-100 flex-shrink-0 ring-2 ring-gray-100 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-accent-700 font-bold text-xl">
                      {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <HiOutlineCamera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium text-accent-600 hover:text-accent-700 border border-accent-200 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition"
                >
                  {avatarPreview ? 'Ganti Foto' : 'Pilih Foto'}
                </button>
                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WebP maks. 2MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (!f) return;
                  setAvatarFile(f);
                  const reader = new FileReader();
                  reader.onload = (ev) => setAvatarPreview(ev.target.result);
                  reader.readAsDataURL(f);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <InputField label="Nama Lengkap" required type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
            </div>
            <div>
              <InputField label="Email" required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
            </div>
            <div>
              <SelectField label="Role" required value={form.role_id}
                onChange={(e) => setForm({ ...form, role_id: e.target.value })}>
                <option value="">Pilih role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.display_name || r.name}</option>
                ))}
              </SelectField>
              {errors.role_id && <p className="text-xs text-red-500 mt-1">{errors.role_id[0]}</p>}
            </div>
            <div>
              <InputField
                label={editUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
                required={!editUser} type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 karakter"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
            </div>
            {form.password && (
              <InputField label="Konfirmasi Password" required type="password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => { setModalOpen(false); resetForm(); }}>Batal</Button>
            <Button type="submit">{editUser ? 'Simpan Perubahan' : 'Tambah User'}</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, user: null, loading: false })}
        onConfirm={confirmDelete}
        loading={confirmModal.loading}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${confirmModal.user?.name}"? Semua data terkait user ini akan ikut terhapus.`}
        confirmLabel="Ya, Hapus"
      />
    </div>
  );
}
