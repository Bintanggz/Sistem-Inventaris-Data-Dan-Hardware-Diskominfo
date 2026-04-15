import { useState, useEffect } from 'react';
import { getDashboardStats, getDashboardCharts } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card, { CardHeader } from '../components/ui/Card';
import { SkeletonStatCards } from '../components/ui/LoadingSkeleton';
import { HiOutlineCube, HiOutlineTag, HiOutlineLocationMarker, HiOutlineClipboardList, HiOutlineExclamation, HiOutlineCog } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const statConfig = [
  { key: 'total_items', icon: HiOutlineCube, label: 'Total Barang', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
  { key: 'total_categories', icon: HiOutlineTag, label: 'Kategori', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-l-emerald-500' },
  { key: 'total_locations', icon: HiOutlineLocationMarker, label: 'Lokasi', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-l-violet-500' },
  { key: 'active_borrowings', icon: HiOutlineClipboardList, label: 'Dipinjam', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500' },
  { key: 'overdue_borrowings', icon: HiOutlineExclamation, label: 'Terlambat', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-l-rose-500' },
  { key: 'active_maintenance', icon: HiOutlineCog, label: 'Pemeliharaan', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-l-purple-500' },
];

function StatCard({ icon: Icon, label, value, color, bg, border }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200/70 border-l-[3px] ${border} p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-[18px] h-[18px] ${color}`} />
        </div>
      </div>
      <p className="text-[22px] font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-xs text-gray-500 mt-1.5 font-medium">{label}</p>
    </div>
  );
}

function ConditionCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl p-4 border border-gray-100`}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-lg font-bold ${color} mt-1`}>{value}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-3 py-2.5 rounded-lg shadow-lg border border-gray-100 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getDashboardCharts()])
      .then(([statsRes, chartsRes]) => {
        setStats(statsRes.data);
        setCharts(chartsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton h-5 w-44 mb-2" />
          <div className="skeleton h-4 w-56" />
        </div>
        <SkeletonStatCards count={6} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200/70 p-5">
              <div className="skeleton h-4 w-28 mb-5" />
              <div className="skeleton h-[260px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Ringkasan data inventaris hari ini</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 stagger-in">
        {statConfig.map((s) => (
          <StatCard
            key={s.key}
            icon={s.icon}
            label={s.label}
            value={stats?.[s.key] || 0}
            color={s.color}
            bg={s.bg}
            border={s.border}
          />
        ))}
      </div>

      {/* Condition cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ConditionCard label="Baik" value={stats?.condition_stats?.baik || 0} color="text-emerald-600" bg="bg-emerald-50/50" />
        <ConditionCard label="Rusak Ringan" value={stats?.condition_stats?.rusak_ringan || 0} color="text-amber-600" bg="bg-amber-50/50" />
        <ConditionCard label="Rusak Berat" value={stats?.condition_stats?.rusak_berat || 0} color="text-rose-600" bg="bg-rose-50/50" />
        <ConditionCard label="Hilang" value={stats?.condition_stats?.hilang || 0} color="text-gray-600" bg="bg-gray-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Tren Bulanan" subtitle="Barang masuk & peminjaman" />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.monthly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="masuk" name="Barang Masuk" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="pinjam" name="Peminjaman" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Kondisi Barang" subtitle="Distribusi kondisi inventaris" />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={charts?.conditions || []} cx="50%" cy="50%" outerRadius={88} innerRadius={52} dataKey="value" nameKey="name" strokeWidth={2} stroke="#fff">
                {(charts?.conditions || []).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Barang per Kategori" subtitle="Jumlah barang di setiap kategori" />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.categories || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={110} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Jumlah" fill="#1a365d" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Barang per Lokasi" subtitle="Distribusi barang di setiap lokasi" />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={charts?.locations || []} cx="50%" cy="50%" outerRadius={88} dataKey="value" nameKey="name" strokeWidth={2} stroke="#fff">
                {(charts?.locations || []).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
