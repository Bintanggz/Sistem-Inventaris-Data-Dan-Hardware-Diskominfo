export default function Card({ children, className = '', padding = true, hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${hover ? 'transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300/60' : ''} ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-center justify-between mb-5 pb-0">
      <div>
        <h3 className="text-[13px] font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
