import { formatCurrency, formatPercentage } from '../lib/formatters';

export default function StatCard({
  title,
  value,
  type = 'currency',
  trend,
  description,
  subtitle,
  icon,
  color = 'primary',
  status,
  badge
}) {
  const colorClasses = {
    primary: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    danger: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700'
  };

  const statusClasses = {
    achieved: 'bg-green-50 border-green-200',
    insufficient: 'bg-red-50 border-red-200',
    secure: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200'
  };

  const formatValue = () => {
    if (value === null || value === undefined || value === '') return '—';
    if (type === 'currency') return formatCurrency(value);
    if (type === 'percentage') return formatPercentage(value);
    if (type === 'age') return `${Math.round(value)} years`;
    return value;
  };

  const statusColor = status === 'achieved' ? 'green' : status === 'insufficient' ? 'red' : status === 'secure' ? 'green' : 'amber';
  const statusBgClasses = statusClasses[status] || '';

  return (
    <div className={`rounded-lg border p-4 transition-all hover:shadow-md ${status ? statusBgClasses : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className={`text-xs font-medium mb-1 ${status ? (status === 'insufficient' ? 'text-red-600' : 'text-green-600') : 'text-slate-500'}`}>
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900">{formatValue()}</p>
          {subtitle && (
            <p className="text-xs text-slate-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className={`p-2 rounded-lg flex-shrink-0 ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      
      {badge && (
        <div className="mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            badge === 'Insufficient' 
              ? 'bg-red-100 text-red-800' 
              : badge === 'Secure'
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {badge}
          </span>
        </div>
      )}
      
      {trend && (
        <div className={`inline-flex items-center text-sm px-2 py-1 rounded ${
          trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '↗' : '↘'}
          </span>
          <span className="ml-1 font-medium">
            {Math.abs(trend)}%
          </span>
        </div>
      )}
      
      {description && !status && (
        <p className="text-xs text-slate-500 mt-2">{description}</p>
      )}
      
      {description && status && (
        <p className={`text-xs mt-2 ${status === 'insufficient' ? 'text-red-700' : 'text-green-700'}`}>{description}</p>
      )}
    </div>
  );
}