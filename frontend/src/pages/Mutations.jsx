import { useState, useEffect } from 'react';
import { getMutations, createMutation, getItems, getLocations } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { SelectField, InputField, TextareaField } from '../components/ui/Input';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import Pagination from '../components/ui/Pagination';
import toast from 'react-hot-toast';
import { HiOutlineSwitchHorizontal, HiOutlineArrowRight } from 'react-icons/hi';

export default function Mutations() {
  const { hasRole } = useAuth();
  const [mutations, setMutations] = useState([]);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ item_id: '', to_location_id: '', quantity: 1, mutation_date: '', reason: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMutations({ page });
      setMutations(res.data.data);
      setMeta(res.data.meta || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getItems({ per_page: 100 }), getLocations()]).then(([i, l]) => {
      setItems(i.data.data);
      setLocations(l.data.data);
    });
  }, []);

  useEffect(() => { load(); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation(form);
      toast.success('Mutasi barang berhasil dicatat');
      setModalOpen(false);
      setForm({ item_id: '', to_location_id: '', quantity: 1, mutation_date: '', reason: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Mutasi Barang" subtitle="Riwayat perpindahan barang antar lokasi">
        {hasRole('admin', 'petugas') && (
          <Button onClick={() => setModalOpen(true)}>
            <HiOutlineSwitchHorizontal className="w-4 h-4" /> Transfer Barang
          </Button>
        )}
      </PageHeader>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : mutations.length === 0 ? (
          <EmptyState icon={HiOutlineSwitchHorizontal} title="Belum ada mutasi" description="Belum ada riwayat perpindahan barang" />
        ) : mutations.map((m, i) => (
          <div key={m.id} className="bg-white rounded-xl border border-gray-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <HiOutlineSwitchHorizontal className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{m.item.name}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{m.item.code} &middot; {m.quantity} unit</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md font-medium text-xs ring-1 ring-inset ring-rose-200">{m.from_location.name}</span>
                <HiOutlineArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium text-xs ring-1 ring-inset ring-emerald-200">{m.to_location.name}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-gray-600 font-medium">{m.mutation_date}</p>
                <p className="text-[11px] text-gray-400">oleh {m.created_by.name}</p>
              </div>
            </div>
            {m.reason && (
              <p className="text-sm text-gray-500 mt-3 pl-[52px] border-t border-gray-50 pt-3">
                <span className="text-gray-400 text-xs font-medium">Alasan:</span> {m.reason}
              </p>
            )}
          </div>
        ))}
      </div>

      <Pagination meta={meta} currentPage={page} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Transfer Barang">
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField label="Barang" required value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}>
            <option value="">Pilih barang</option>
            {items.map((i) => <option key={i.id} value={i.id}>{i.code} — {i.name} ({i.location.name} · Stok: {i.quantity})</option>)}
          </SelectField>
          <SelectField label="Lokasi Tujuan" required value={form.to_location_id} onChange={(e) => setForm({ ...form, to_location_id: e.target.value })}>
            <option value="">Pilih lokasi tujuan</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </SelectField>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField label="Jumlah" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              {form.item_id && (
                <p className="text-[10px] text-gray-500 mt-1">
                  Maks: {items.find(i => i.id == form.item_id)?.quantity || 0}
                </p>
              )}
            </div>
            <InputField label="Tanggal" required type="date" value={form.mutation_date} onChange={(e) => setForm({ ...form, mutation_date: e.target.value })} />
          </div>
          <TextareaField label="Alasan" rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit">Transfer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
