import { useState, useEffect } from 'react';
import { getMaintenances, createMaintenance, updateMaintenance, getItems } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/Badge';
import { InputField, SelectField, TextareaField, SearchInput } from '../components/ui/Input';
import { SkeletonTable } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineCog, HiOutlinePencil } from 'react-icons/hi';

export default function MaintenancePage() {
  const { hasRole } = useAuth();
  const [maintenances, setMaintenances] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMaint, setEditMaint] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [form, setForm] = useState({ item_id: '', start_date: '', end_date: '', status: 'pending', cost: '', description: '', technician: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMaintenances(filters);
      setMaintenances(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems({ per_page: 100 }).then((res) => setItems(res.data.data));
  }, []);

  useEffect(() => { load(); }, [filters]);

  const resetForm = () => {
    setForm({ item_id: '', start_date: '', end_date: '', status: 'pending', cost: '', description: '', technician: '' });
    setEditMaint(null);
  };

  const openEdit = (m) => {
    setForm({ item_id: m.item.id, start_date: m.start_date, end_date: m.end_date || '', status: m.status, cost: m.cost || '', description: m.description || '', technician: m.technician || '' });
    setEditMaint(m);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMaint) {
        await updateMaintenance(editMaint.id, form);
        toast.success('Data pemeliharaan diperbarui');
      } else {
        await createMaintenance(form);
        toast.success('Data pemeliharaan berhasil ditambahkan');
      }
      setModalOpen(false);
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Pemeliharaan" subtitle="Kelola data perbaikan dan pemeliharaan barang">
        {hasRole('admin', 'petugas') && (
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <HiOutlinePlus className="w-4 h-4" /> Tambah Pemeliharaan
          </Button>
        )}
      </PageHeader>

      <Card>
        <div className="flex flex-wrap gap-3">
          <SearchInput
            placeholder="Cari barang..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 min-w-[200px]"
          />
          <SelectField value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="in_progress">Dalam Proses</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </SelectField>
        </div>
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-gray-200/60">
                <th className="text-left">Barang</th>
                <th className="text-left hidden md:table-cell">Teknisi</th>
                <th className="text-left hidden md:table-cell">Mulai</th>
                <th className="text-left hidden lg:table-cell">Selesai</th>
                <th className="text-right hidden lg:table-cell">Biaya</th>
                <th className="text-center">Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><SkeletonTable rows={5} cols={6} /></td></tr>
              ) : maintenances.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={HiOutlineCog} title="Tidak ada data pemeliharaan" description="Belum ada perbaikan atau pemeliharaan" />
                </td></tr>
              ) : maintenances.map((m) => (
                <tr key={m.id}>
                  <td>
                    <p className="text-sm font-medium text-gray-800">{m.item.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{m.item.code}</p>
                  </td>
                  <td className="text-sm text-gray-500 hidden md:table-cell">{m.technician || '-'}</td>
                  <td className="text-sm text-gray-500 hidden md:table-cell">{m.start_date}</td>
                  <td className="text-sm text-gray-500 hidden lg:table-cell">{m.end_date || '-'}</td>
                  <td className="text-sm text-right text-gray-600 font-medium hidden lg:table-cell">{m.cost ? `Rp ${Number(m.cost).toLocaleString('id-ID')}` : '-'}</td>
                  <td className="text-center"><StatusBadge status={m.status} /></td>
                  <td className="text-center">
                    {hasRole('admin', 'petugas') && (
                      <button onClick={() => openEdit(m)} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition"><HiOutlinePencil className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editMaint ? 'Edit Pemeliharaan' : 'Tambah Pemeliharaan'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField label="Barang" required disabled={!!editMaint} value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}>
            <option value="">Pilih barang</option>
            {items.map((i) => <option key={i.id} value={i.id}>{i.code} — {i.name}</option>)}
          </SelectField>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tanggal Mulai" required type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <InputField label="Tanggal Selesai" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Status" required value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Menunggu</option>
              <option value="in_progress">Dalam Proses</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </SelectField>
            <InputField label="Biaya" type="number" min={0} placeholder="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </div>
          <InputField label="Teknisi" type="text" value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} />
          <TextareaField label="Deskripsi" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => { setModalOpen(false); resetForm(); }}>Batal</Button>
            <Button type="submit">{editMaint ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
