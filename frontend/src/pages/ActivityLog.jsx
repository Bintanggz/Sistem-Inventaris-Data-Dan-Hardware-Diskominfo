import { useState, useEffect } from 'react';
import { getActivityLogs } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import { HiOutlineClock } from 'react-icons/hi';

const actionConfig = {
  create: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', dot: 'bg-emerald-500' },
  update: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200', dot: 'bg-blue-500' },
  delete: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200', dot: 'bg-rose-500' },
  login: { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200', dot: 'bg-purple-500' },
  logout: { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-200', dot: 'bg-gray-400' },
};

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getActivityLogs({ page })
      .then(res => { setLogs(res.data.data); setMeta(res.data); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-5">
      <PageHeader title="Log Aktivitas" subtitle="Riwayat aktivitas pengguna di sistem" />

      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : logs.length === 0 ? (
          <EmptyState icon={HiOutlineClock} title="Belum ada log aktivitas" description="Belum ada aktivitas yang tercatat" />
        ) : logs.map((log, i) => {
          const config = actionConfig[log.action] || actionConfig.logout;
          return (
            <div key={log.id} className="bg-white rounded-xl border border-gray-200/60 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 relative">
                <HiOutlineClock className="w-5 h-5 text-gray-400" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${config.dot} ring-2 ring-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-gray-900">{log.user?.name || 'System'}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
                    {log.action}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">{log.model_type}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{log.description || `${log.action} ${log.model_type} #${log.model_id}`}</p>
              </div>
              <time className="text-[11px] text-gray-400 flex-shrink-0 font-medium">{new Date(log.created_at).toLocaleString('id-ID')}</time>
            </div>
          );
        })}
      </div>

      <Pagination meta={meta} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
