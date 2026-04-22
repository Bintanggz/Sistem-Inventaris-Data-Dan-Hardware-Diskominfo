import { useState, useEffect } from 'react';
import { getItems, getCategories, getLocations, createItem, updateItem, deleteItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
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
  const [filters, setFilters] = useState({ search: '', category_id: '', location_id: '', kondisi_umur: '', page: 1 });

  const [form, setForm] = useState({ name: '', brand_type: '', category_id: '', location_id: '', quantity: 1, condition: 'baik', acquisition_date: '', description: '', image: null, serial_number_device: '', procurement_method: 'Pengadaan', status: 'Terpasang' });
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null, loading: false });

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
    setForm({ name: '', brand_type: '', category_id: '', location_id: '', quantity: 1, condition: 'baik', acquisition_date: '', description: '', image: null, serial_number_device: '', procurement_method: 'Pengadaan', status: 'Terpasang' });
    setEditItem(null);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name,
      brand_type: item.brand_type || '',
      category_id: item.category.id,
      location_id: item.location.id,
      quantity: item.quantity,
      condition: item.condition,
      acquisition_date: item.acquisition_date || '',
      description: item.description || '',
      image: null,
      serial_number_device: item.serial_number_device || '',
      procurement_method: item.procurement_method || 'Pengadaan',
      status: item.status || 'Terpasang',
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
    setConfirmModal({ open: true, item, loading: false });
  };

  const confirmDelete = async () => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await deleteItem(confirmModal.item.id);
      toast.success('Barang berhasil dihapus');
      setConfirmModal({ open: false, item: null, loading: false });
      loadItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
      setConfirmModal(prev => ({ ...prev, loading: false }));
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
          <SelectField
            value={filters.kondisi_umur}
            onChange={(e) => setFilters({ ...filters, kondisi_umur: e.target.value, page: 1 })}
          >
            <option value="">Semua Kondisi Umur</option>
            <option value="masih_baik">Masih Baik (1-3 th)</option>
            <option value="siap_pengadaan">Siap Rencana Pengadaan (4-5 th)</option>
            <option value="disarankan_ganti">Disarankan Ganti (&gt;5 th)</option>
          </SelectField>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-gray-200/60 whitespace-nowrap">
                <th className="text-center px-4 py-3">No</th>
                <th className="text-left px-4 py-3">Kategori Barang</th>
                <th className="text-left px-4 py-3">Nama Barang</th>
                <th className="text-left px-4 py-3">Merk / Type</th>
                <th className="text-left px-4 py-3">Serial Number Device</th>
                <th className="text-left px-4 py-3">Tanggal Barang Masuk</th>
                <th className="text-left px-4 py-3">Metode Pengadaan</th>
                <th className="text-left px-4 py-3">Status Barang</th>
                <th className="text-left px-4 py-3">Lokasi Barang</th>
                <th className="text-center px-4 py-3">Umur Barang (th)</th>
                <th className="text-center px-4 py-3">Sisa Umur (th)</th>
                <th className="text-center px-4 py-3">Kondisi Barang</th>
                <th className="text-left px-4 py-3">Keterangan</th>
                <th className="text-center px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={13}><SkeletonTable rows={5} cols={13} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={13}>
                  <EmptyState icon={HiOutlineCube} title="Tidak ada barang" description="Belum ada data barang yang sesuai filter" />
                </td></tr>
              ) : items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 whitespace-nowrap">
                  <td className="text-sm font-medium text-gray-500 text-center px-4 py-3">{(filters.page - 1) * 10 + index + 1}</td>
                  <td className="text-sm text-gray-600 px-4 py-3">{item.category.name}</td>
                  <td className="text-sm font-medium text-gray-800 px-4 py-3">{item.name}</td>
                  <td className="text-sm text-gray-600 px-4 py-3">{item.brand_type || '-'}</td>
                  <td className="text-sm font-mono text-gray-500 px-4 py-3">{item.serial_number_device || '-'}</td>
                  <td className="text-sm text-gray-600 px-4 py-3">{item.acquisition_date || '-'}</td>
                  <td className="text-sm text-gray-600 px-4 py-3">{item.procurement_method || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Terpasang' ? 'bg-green-100 text-green-700' : item.status === 'Backup' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status || '-'}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600 px-4 py-3">{item.location.name}</td>
                  <td className="text-sm text-center text-gray-700 px-4 py-3">{item.umur_barang}</td>
                  <td className="text-sm text-center text-gray-700 px-4 py-3">{item.sisa_umur_barang}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.kondisi_barang === 'Masih Baik' ? 'bg-green-100 text-green-700' : item.kondisi_barang === 'Siap Rencana Pengadaan' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-700'}`}>
                      {item.kondisi_barang}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500 max-w-[200px] truncate px-4 py-3" title={item.description}>{item.description || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <InputField label="Nama Barang" required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <InputField label="Merk / Type" type="text" value={form.brand_type} onChange={(e) => setForm({ ...form, brand_type: e.target.value })} />
            <SelectField label="Kategori" required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Pilih kategori</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SelectField>
            <SelectField label="Lokasi" required value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })}>
              <option value="">Pilih lokasi</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </SelectField>
            <InputField label="Serial Number Device" type="text" value={form.serial_number_device} onChange={(e) => setForm({ ...form, serial_number_device: e.target.value })} />
            <SelectField label="Metode Pengadaan" value={form.procurement_method} onChange={(e) => setForm({ ...form, procurement_method: e.target.value })}>
              <option value="Pengadaan">Pengadaan</option>
              <option value="Pemeliharaan">Pemeliharaan</option>
            </SelectField>
            <SelectField label="Status Barang" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Terpasang">Terpasang</option>
              <option value="Backup">Backup</option>
              <option value="Idle">Idle</option>
            </SelectField>
            <InputField label="Jumlah (Qty)" required type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <InputField label="Tanggal Barang Masuk" type="date" required value={form.acquisition_date} onChange={(e) => setForm({ ...form, acquisition_date: e.target.value })} />
            <div className="hidden">
              <SelectField label="Kondisi Fisik" required value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                <option value="baik">Baik</option>
                <option value="rusak_ringan">Rusak Ringan</option>
                <option value="rusak_berat">Rusak Berat</option>
                <option value="hilang">Hilang</option>
              </SelectField>
            </div>
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
                { label: 'Merk / Type', value: detailModal.brand_type || '-' },
                { label: 'Serial Number', value: detailModal.serial_number_device || '-' },
                { label: 'Kategori', value: detailModal.category.name },
                { label: 'Lokasi', value: detailModal.location.name },
                { label: 'Metode Pengadaan', value: detailModal.procurement_method || '-' },
                { label: 'Status Barang', value: detailModal.status || '-' },
                { label: 'Tanggal Masuk', value: detailModal.acquisition_date || '-' },
                { label: 'Umur Barang', value: detailModal.umur_barang + ' tahun' },
                { label: 'Sisa Umur', value: detailModal.sisa_umur_barang + ' tahun' },
                { label: 'Kondisi Barang', value: <span className="font-medium text-blue-600">{detailModal.kondisi_barang}</span> },
                { label: 'Jumlah', value: detailModal.quantity },
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, item: null, loading: false })}
        onConfirm={confirmDelete}
        loading={confirmModal.loading}
        title="Hapus Barang"
        message={`Apakah Anda yakin ingin menghapus barang "${confirmModal.item?.name}"? Aksi ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
      />
    </div>
  );
}
