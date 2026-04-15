import { useState, useEffect } from 'react';
import { getBorrowings, createBorrowing, returnBorrowing, getItems } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/Badge';
import { InputField, SelectField, TextareaField, SearchInput } from '../components/ui/Input';
import { SkeletonTable } from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineReply, HiOutlineClipboardList } from 'react-icons/hi';

export default function Borrowings() {
  const { hasRole } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [meta, setMeta] = useState({});
  const [filters, setFilters] = useState({ status: '', search: '', page: 1 });
  const [form, setForm] = useState({ item_id: '', borrower_name: '', quantity: 1, borrow_date: '', due_date: '', notes: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBorrowings(filters);
      setBorrowings(res.data.data);
      setMeta(res.data.meta || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems({ per_page: 100 }).then((res) => setItems(res.data.data));
  }, []);

  useEffect(() => { load(); }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBorrowing(form);
      toast.success('Peminjaman berhasil dicatat');
      setModalOpen(false);
      setForm({ item_id: '', borrower_name: '', quantity: 1, borrow_date: '', due_date: '', notes: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleReturn = async (borrowing) => {
    if (!confirm('Konfirmasi pengembalian barang?')) return;
    try {
      await returnBorrowing(borrowing.id);
      toast.success('Barang berhasil dikembalikan');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengembalikan');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Peminjaman" subtitle="Kelola peminjaman dan pengembalian barang">
        {hasRole('admin', 'petugas') && (
          <Button onClick={() => setModalOpen(true)}>
            <HiOutlinePlus className="w-4 h-4" /> Pinjam Barang
          </Button>
        )}
      </PageHeader>

      {/* Filter */}
      <Card>
        <div className="flex flex-wrap gap-3">
          <SearchInput
            placeholder="Cari peminjam..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="flex-1 min-w-[200px]"
          />
          <SelectField value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">Semua Status</option>
            <option value="dipinjam">Dipinjam</option>
            <option value="dikembalikan">Dikembalikan</option>
            <option value="terlambat">Terlambat</option>
          </SelectField>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-gray-200/60">
                <th className="text-left">Barang</th>
                <th className="text-left">Peminjam</th>
                <th className="text-center hidden md:table-cell">Qty</th>
                <th className="text-left hidden md:table-cell">Tgl Pinjam</th>
                <th className="text-left hidden lg:table-cell">Jatuh Tempo</th>
                <th className="text-center">Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><SkeletonTable rows={5} cols={6} /></td></tr>
              ) : borrowings.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={HiOutlineClipboardList} title="Tidak ada peminjaman" description="Belum ada data peminjaman" />
                </td></tr>
              ) : borrowings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <p className="text-sm font-medium text-gray-800">{b.item.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{b.item.code}</p>
                  </td>
                  <td className="text-sm text-gray-700">{b.borrower_name}</td>
                  <td className="text-sm text-center font-medium text-gray-700 hidden md:table-cell">{b.quantity}</td>
                  <td className="text-sm text-gray-500 hidden md:table-cell">{b.borrow_date}</td>
                  <td className="text-sm text-gray-500 hidden lg:table-cell">{b.due_date}</td>
                  <td className="text-center"><StatusBadge status={b.status} /></td>
                  <td className="text-center">
                    {b.status === 'dipinjam' && hasRole('admin', 'petugas') && (
                      <Button variant="success" size="sm" onClick={() => handleReturn(b)}>
                        <HiOutlineReply className="w-3.5 h-3.5" /> Kembalikan
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} currentPage={filters.page} onPageChange={(page) => setFilters({ ...filters, page })} />
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Pinjam Barang">
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField label="Barang" required value={form.item_id} onChange={(e) => setForm({ ...form, item_id: e.target.value })}>
            <option value="">Pilih barang</option>
            {items.map((i) => <option key={i.id} value={i.id}>{i.code} — {i.name}</option>)}
          </SelectField>
          <InputField label="Nama Peminjam" required type="text" value={form.borrower_name} onChange={(e) => setForm({ ...form, borrower_name: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Jumlah" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <InputField label="Tgl Pinjam" required type="date" value={form.borrow_date} onChange={(e) => setForm({ ...form, borrow_date: e.target.value })} />
            <InputField label="Jatuh Tempo" required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </div>
          <TextareaField label="Catatan" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit">Pinjam</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
