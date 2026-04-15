const variants = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-500/20',
  accent:
    'bg-accent-500 text-white hover:bg-accent-600 shadow-sm shadow-accent-500/20',
  secondary:
    'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20',
  ghost:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  success:
    'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-out hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
