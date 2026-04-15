import { useState, useEffect } from 'react';
import { getItems, getCategories, getLocations, createItem, updateItem, deleteItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { ConditionBadge } from '../components/ui/Badge';
import { InputField, SelectField, TextareaField, SearchInput } from '../components/ui/Input';
import { SkeletonTable } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineCube } from 'react-icons/hi';

export default function Items() {
  const { hasRole } = useAuth();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({});
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [filters, setFilters] = useState({ search: '', category_id: '', location_id: '', condition: '', page: 1 });

  const [form, setForm] = useState({ name: '', category_id: '', location_id: '', quantity: 1, condition: 'baik', acquisition_date: '', description: '', image: null });

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await getItems(filters);
      setItems(res.data.data);
      setMeta(res.data.meta || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getCategories(), getLocations()]).then(([c, l]) => {
      setCategories(c.data.data);
      setLocations(l.data.data);
    });
  }, []);

  useEffect(() => { loadItems(); }, [filters]);

  const resetForm = () => {
    setForm({ name: '', category_id: '', location_id: '', quantity: 1, condition: 'baik', acquisition_date: '', description: '', image: null });
    setEditItem(null);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name,
      category_id: item.category.id,
      location_id: item.location.id,
      quantity: item.quantity,
      condition: item.condition,
      acquisition_date: item.acquisition_date || '',
      description: item.description || '',
      image: null,
    });
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== '') formData.append(key, form[key]);
    });

    try {
      if (editItem) {
        formData.append('_method', 'PUT');
        await updateItem(editItem.id, formData);
        toast.success('Barang berhasil diperbarui');
      } else {
        await createItem(formData);
        toast.success('Barang berhasil ditambahkan');
      }
      setModalOpen(false);
      resetForm();
      loadItems();
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan';
      toast.error(msg);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus barang "${item.name}"?`)) return;
    try {
      await deleteItem(item.id);
      toast.success('Barang berhasil dihapus');
      loadItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Daftar Barang" subtitle="Kelola inventaris barang dan aset">
        {hasRole('admin', 'petugas') && (
          <Button id="add-item-btn" onClick={() => { resetForm(); setModalOpen(true); }}>
            <HiOutlinePlus className="w-4 h-4" /> Tambah Barang
          </Button>
        )}
      </PageHeader>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <SearchInput
            id="search-items"
            icon={HiOutlineSearch}
            placeholder="Cari nama atau kode..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="lg:col-span-2"
          />
          <SelectField value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value, page: 1 })}>
            <option value="">Semua Kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </SelectField>
          <SelectField value={filters.location_id} onChange={(e) => setFilters({ ...filters, location_id: e.target.value, page: 1 })}>
            <option value="">Semua Lokasi</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </SelectField>
          <SelectField value={filters.condition} onChange={(e) => setFilters({ ...filters, condition: e.target.value, page: 1 })}>
            <option value="">Semua Kondisi</option>
            <option value="baik">Baik</option>
            <option value="rusak_ringan">Rusak Ringan</option>
            <option value="rusak_berat">Rusak Berat</option>
            <option value="hilang">Hilang</option>
          </SelectField>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-gray-200/60">
                <th className="text-left">Kode</th>
                <th className="text-left">Nama</th>
                <th className="text-left hidden md:table-cell">Kategori</th>
                <th className="text-left hidden lg:table-cell">Lokasi</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Kondisi</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><SkeletonTable rows={5} cols={6} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={HiOutlineCube} title="Tidak ada barang" description="Belum ada data barang yang sesuai filter" />
                </td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td className="text-sm font-mono text-accent-600 font-medium">{item.code}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover ring-1 ring-gray-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                          <HiOutlineCube className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-gray-500 hidden md:table-cell">{item.category.name}</td>
                  <td className="text-sm text-gray-500 hidden lg:table-cell">{item.location.name}</td>
                  <td className="text-sm text-center font-medium text-gray-700">{item.quantity}</td>
                  <td className="text-center"><ConditionBadge condition={item.condition} /></td>
                  <td>
                    <div className="flex items-center justify-center gap-0.5">
                      <button onClick={() => setDetailModal(item)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition" title="Detail"><HiOutlineEye className="w-4 h-4" /></button>
                      {hasRole('admin', 'petugas') && (
                        <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
                      )}
                      {hasRole('admin') && (
                        <button onClick={() => handleDelete(item)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition" title="Hapus"><HiOutlineTrash className="w-4 h-4" /></button>
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

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editItem ? 'Edit Barang' : 'Tambah Barang'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Nama Barang" required className="sm:col-span-2" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <SelectField label="Kategori" required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Pilih kategori</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SelectField>
            <SelectField label="Lokasi" required value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })}>
              <option value="">Pilih lokasi</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </SelectField>
            <InputField label="Jumlah" required type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <SelectField label="Kondisi" required value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              <option value="baik">Baik</option>
              <option value="rusak_ringan">Rusak Ringan</option>
              <option value="rusak_berat">Rusak Berat</option>
              <option value="hilang">Hilang</option>
            </SelectField>
            <InputField label="Tanggal Perolehan" type="date" value={form.acquisition_date} onChange={(e) => setForm({ ...form, acquisition_date: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar</label>
              <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition" />
            </div>
            <TextareaField label="Deskripsi" className="sm:col-span-2" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => { setModalOpen(false); resetForm(); }}>Batal</Button>
            <Button type="submit">{editItem ? 'Simpan Perubahan' : 'Tambah Barang'}</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Detail Barang" size="md">
        {detailModal && (
          <div className="space-y-4">
            {detailModal.image && <img src={detailModal.image} alt="" className="w-full h-48 object-cover rounded-lg" />}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Kode', value: <span className="font-mono text-accent-600 font-medium">{detailModal.code}</span> },
                { label: 'Nama', value: detailModal.name },
                { label: 'Kategori', value: detailModal.category.name },
                { label: 'Lokasi', value: detailModal.location.name },
                { label: 'Jumlah', value: detailModal.quantity },
                { label: 'Kondisi', value: <ConditionBadge condition={detailModal.condition} /> },
                { label: 'Tanggal Perolehan', value: detailModal.acquisition_date || '-' },
                { label: 'Terakhir Diubah', value: detailModal.updated_at },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">{item.label}</p>
                  <div className="text-sm text-gray-800 mt-0.5 font-medium">{item.value}</div>
                </div>
              ))}
            </div>
            {detailModal.description && (
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Deskripsi</p>
                <p className="text-sm text-gray-600 mt-0.5">{detailModal.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
