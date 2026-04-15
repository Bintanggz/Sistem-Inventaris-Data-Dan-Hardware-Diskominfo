import { useState, useEffect } from 'react';
import { getCategories, getLocations, exportPdf, exportExcel } from '../services/api';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import { SelectField } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { HiOutlineDocumentDownload, HiOutlineTable } from 'react-icons/hi';

export default function Reports() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({ category_id: '', location_id: '', condition: '' });
  const [loading, setLoading] = useState('');

  useEffect(() => {
    Promise.all([getCategories(), getLocations()]).then(([c, l]) => {
      setCategories(c.data.data);
      setLocations(l.data.data);
    });
  }, []);

  const handleExport = async (type) => {
    setLoading(type);
    try {
      const res = type === 'pdf' ? await exportPdf(filters) : await exportExcel(filters);
      const ext = type === 'pdf' ? 'pdf' : 'csv';
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `laporan-inventaris.${ext}`;
      link.click();
      toast.success('Laporan berhasil diunduh');
    } catch { toast.error('Gagal mengunduh laporan'); }
    finally { setLoading(''); }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Laporan" subtitle="Ekspor data inventaris" />

      <Card>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SelectField value={filters.category_id} onChange={(e) => setFilters({...filters, category_id: e.target.value})}>
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </SelectField>
          <SelectField value={filters.location_id} onChange={(e) => setFilters({...filters, location_id: e.target.value})}>
            <option value="">Semua Lokasi</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </SelectField>
          <SelectField value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})}>
            <option value="">Semua Kondisi</option>
            <option value="baik">Baik</option>
            <option value="rusak_ringan">Rusak Ringan</option>
            <option value="rusak_berat">Rusak Berat</option>
            <option value="hilang">Hilang</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!loading}
            className="flex items-center justify-center gap-4 p-6 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-200 group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition">
              <HiOutlineDocumentDownload className="w-6 h-6 text-rose-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Ekspor PDF</p>
              <p className="text-xs text-gray-400 mt-0.5">Unduh laporan format PDF</p>
            </div>
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={!!loading}
            className="flex items-center justify-center gap-4 p-6 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition">
              <HiOutlineTable className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Ekspor Excel</p>
              <p className="text-xs text-gray-400 mt-0.5">Unduh laporan format CSV</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
