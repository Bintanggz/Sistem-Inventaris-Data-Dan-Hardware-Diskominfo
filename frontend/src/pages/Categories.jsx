import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { InputField, TextareaField } from '../components/ui/Input';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineTag } from 'react-icons/hi';

export default function Categories() {
  const { hasRole } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ name: '', description: '' }); setEditCat(null); };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setEditCat(cat);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) {
        await updateCategory(editCat.id, form);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await createCategory(form);
        toast.success('Kategori berhasil ditambahkan');
      }
      setModalOpen(false);
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Hapus kategori "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.id);
      toast.success('Kategori berhasil dihapus');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Kategori" subtitle="Kelola kategori barang inventaris">
        {hasRole('admin') && (
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <HiOutlinePlus className="w-4 h-4" /> Tambah Kategori
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : categories.length === 0 ? (
          <div className="col-span-full">
            <EmptyState icon={HiOutlineTag} title="Belum ada kategori" description="Tambahkan kategori untuk mengelompokkan barang" />
          </div>
        ) : categories.map((cat, i) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-200 group animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <HiOutlineTag className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-400">{cat.items_count || 0} barang</p>
                </div>
              </div>
              {hasRole('admin') && (
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition"><HiOutlinePencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(cat)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition"><HiOutlineTrash className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            {cat.description && <p className="text-sm text-gray-500 mt-3 leading-relaxed">{cat.description}</p>}
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editCat ? 'Edit Kategori' : 'Tambah Kategori'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Nama Kategori" required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextareaField label="Deskripsi" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => { setModalOpen(false); resetForm(); }}>Batal</Button>
            <Button type="submit">{editCat ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
