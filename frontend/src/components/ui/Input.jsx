const baseClass =
  'w-full px-3 py-2 rounded-lg border border-gray-200/80 text-sm text-gray-800 bg-white placeholder-gray-400 transition-all duration-300 ease-out focus:border-accent-500 focus:ring-[3px] focus:ring-accent-500/20 hover:border-gray-300 outline-none disabled:bg-gray-50 disabled:text-gray-400';

export function InputField({ label, required, error, id, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input id={id} className={`${baseClass} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-400/15' : ''}`} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function SelectField({ label, required, error, id, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <select id={id} className={`${baseClass} ${error ? 'border-red-300' : ''}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function TextareaField({ label, required, error, id, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <textarea id={id} className={`${baseClass} resize-none ${error ? 'border-red-300' : ''}`} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function SearchInput({ icon: Icon, className = '', ...props }) {
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />}
      <input className={`${baseClass} ${Icon ? 'pl-9' : ''}`} {...props} />
    </div>
  );
}
