import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function Pagination({ meta, currentPage, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const pages = [];
  const total = meta.last_page;

  // Show max 5 pages centered around current
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(total, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        Halaman <span className="font-medium text-gray-700">{meta.current_page}</span> dari{' '}
        <span className="font-medium text-gray-700">{meta.last_page}</span>
        {meta.total && (
          <span className="hidden sm:inline"> &middot; {meta.total} data</span>
        )}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
        </button>
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition"
            >
              1
            </button>
            {start > 2 && <span className="text-gray-300 text-xs px-1">...</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
              currentPage === page
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        {end < total && (
          <>
            {end < total - 1 && <span className="text-gray-300 text-xs px-1">...</span>}
            <button
              onClick={() => onPageChange(total)}
              className="w-8 h-8 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition"
            >
              {total}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= total}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
