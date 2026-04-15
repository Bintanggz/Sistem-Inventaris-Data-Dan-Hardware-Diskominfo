import { useState, useEffect } from 'react';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { InputField, TextareaField } from '../components/ui/Input';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Locations() {
  const { hasRole } = useAuth();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLoc, setEditLoc] = useState(null);
  const [form, setForm] = useState({ name: '', building: '', floor: '', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getLocations();
      setLocations(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ name: '', building: '', floor: '', description: '' }); setEditLoc(null); };

  const openEdit = (loc) => {
    setForm({ name: loc.name, building: loc.building || '', floor: loc.floor || '', description: loc.description || '' });
    setEditLoc(loc);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editLoc) {
        await updateLocation(editLoc.id, form);
        toast.success('Lokasi berhasil diperbarui');
      } else {
        await createLocation(form);
        toast.success('Lokasi berhasil ditambahkan');
      }
      setModalOpen(false);
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (loc) => {
    if (!confirm(`Hapus lokasi "${loc.name}"?`)) return;
    try {
      await deleteLocation(loc.id);
      toast.success('Lokasi berhasil dihapus');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Lokasi" subtitle="Kelola lokasi penyimpanan barang">
        {hasRole('admin') && (
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <HiOutlinePlus className="w-4 h-4" /> Tambah Lokasi
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : locations.length === 0 ? (
          <div className="col-span-full">
            <EmptyState icon={HiOutlineLocationMarker} title="Belum ada lokasi" description="Tambahkan lokasi untuk mengelola penyimpanan" />
          </div>
        ) : locations.map((loc, i) => (
          <div key={loc.id} className="bg-white rounded-xl border border-gray-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-200 group animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <HiOutlineLocationMarker className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{loc.name}</h3>
                  <p className="text-xs text-gray-400">{[loc.building, loc.floor].filter(Boolean).join(', ') || 'Tanpa gedung'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">{loc.items_count || 0} barang</span>
                {hasRole('admin') && (
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(loc)} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition"><HiOutlinePencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(loc)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition"><HiOutlineTrash className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
            {loc.description && <p className="text-sm text-gray-500 mt-3 leading-relaxed">{loc.description}</p>}
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editLoc ? 'Edit Lokasi' : 'Tambah Lokasi'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Nama Lokasi" required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Gedung" type="text" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
            <InputField label="Lantai" type="text" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
          </div>
          <TextareaField label="Deskripsi" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => { setModalOpen(false); resetForm(); }}>Batal</Button>
            <Button type="submit">{editLoc ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
