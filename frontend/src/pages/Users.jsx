import { useState, useEffect } from 'react';
import { getUsers, getRoles, createUser, updateUser, deleteUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { InputField, SelectField, SearchInput } from '../components/ui/Input';
import { SkeletonTable } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineUsers, HiOutlineShieldCheck } from 'react-icons/hi';

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
  const [errors, setErrors] = useState({});

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
  };

  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, role_id: u.role_id, password: '', password_confirmation: '' });
    setEditUser(u);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }
      if (editUser) {
        await updateUser(editUser.id, payload);
        toast.success('User berhasil diperbarui');
      } else {
        await createUser(payload);
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

  const handleDelete = async (u) => {
    if (!confirm(`Hapus user "${u.name}"? Aksi ini tidak dapat dibatalkan.`)) return;
    try {
      await deleteUser(u.id);
      toast.success('User berhasil dihapus');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus user');
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
                      <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent-700 font-bold text-xs">{u.name.charAt(0).toUpperCase()}</span>
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
          <div className="grid grid-cols-1 gap-4">
            <div>
              <InputField
                label="Nama Lengkap"
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
            </div>
            <div>
              <InputField
                label="Email"
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
            </div>
            <div>
              <SelectField
                label="Role"
                required
                value={form.role_id}
                onChange={(e) => setForm({ ...form, role_id: e.target.value })}
              >
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
                required={!editUser}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 karakter"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
            </div>
            {form.password && (
              <InputField
                label="Konfirmasi Password"
                required
                type="password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              />
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => { setModalOpen(false); resetForm(); }}>Batal</Button>
            <Button type="submit">{editUser ? 'Simpan Perubahan' : 'Tambah User'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
