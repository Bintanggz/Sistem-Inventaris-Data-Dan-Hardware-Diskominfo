export default function Badge({ variant = 'default', children }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600 ring-gray-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-200',
    info: 'bg-blue-50 text-blue-700 ring-blue-200',
    primary: 'bg-primary-50 text-primary-700 ring-primary-200',
    accent: 'bg-teal-50 text-teal-700 ring-teal-200',
    purple: 'bg-purple-50 text-purple-700 ring-purple-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function ConditionBadge({ condition }) {
  const map = {
    baik: { variant: 'success', label: 'Baik', dot: 'bg-emerald-500' },
    rusak_ringan: { variant: 'warning', label: 'Rusak Ringan', dot: 'bg-amber-500' },
    rusak_berat: { variant: 'danger', label: 'Rusak Berat', dot: 'bg-rose-500' },
    hilang: { variant: 'default', label: 'Hilang', dot: 'bg-gray-400' },
  };
  const { variant, label, dot } = map[condition] || { variant: 'default', label: condition, dot: 'bg-gray-400' };
  return (
    <Badge variant={variant}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}

export function StatusBadge({ status }) {
  const map = {
    dipinjam: { variant: 'warning', label: 'Dipinjam', dot: 'bg-amber-500' },
    dikembalikan: { variant: 'success', label: 'Dikembalikan', dot: 'bg-emerald-500' },
    terlambat: { variant: 'danger', label: 'Terlambat', dot: 'bg-rose-500' },
    pending: { variant: 'warning', label: 'Menunggu', dot: 'bg-amber-500' },
    in_progress: { variant: 'info', label: 'Dalam Proses', dot: 'bg-blue-500' },
    selesai: { variant: 'success', label: 'Selesai', dot: 'bg-emerald-500' },
    dibatalkan: { variant: 'default', label: 'Dibatalkan', dot: 'bg-gray-400' },
  };
  const { variant, label, dot } = map[status] || { variant: 'default', label: status, dot: 'bg-gray-400' };
  return (
    <Badge variant={variant}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}
