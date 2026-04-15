import { HiOutlineInbox } from 'react-icons/hi';

export default function EmptyState({
  icon: Icon = HiOutlineInbox,
  title = 'Tidak ada data',
  description,
  children,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-sm font-semibold text-gray-500 mb-1">{title}</h3>
      {description && <p className="text-xs text-gray-400 text-center max-w-xs">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
