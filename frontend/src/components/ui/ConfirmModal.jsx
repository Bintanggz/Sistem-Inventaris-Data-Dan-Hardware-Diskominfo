import { useEffect } from 'react';
import { HiOutlineExclamation, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import Button from './Button';

/**
 * ConfirmModal — Ganti confirm() browser dengan dialog yang proper.
 * 
 * Usage:
 *   <ConfirmModal
 *     isOpen={confirmOpen}
 *     onClose={() => setConfirmOpen(false)}
 *     onConfirm={handleDelete}
 *     title="Hapus Barang"
 *     message="Apakah Anda yakin ingin menghapus barang ini?"
 *     variant="danger"   // 'danger' | 'warning'
 *   />
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'danger',
  loading = false,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-900/20 w-full max-w-md animate-scale-in">
        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
        >
          <HiOutlineX className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
            isDanger ? 'bg-red-50' : 'bg-amber-50'
          }`}>
            {isDanger
              ? <HiOutlineTrash className="w-6 h-6 text-red-500" />
              : <HiOutlineExclamation className="w-6 h-6 text-amber-500" />
            }
          </div>

          {/* Title & message */}
          <h3 className="text-base font-semibold text-gray-900 mb-1.5">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/60 rounded-b-2xl border-t border-gray-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
