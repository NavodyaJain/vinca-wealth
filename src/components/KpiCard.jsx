export default function KpiCard({ title, value, helper }) {
  return (
    <div className="flex-1 min-w-[140px] bg-white border border-slate-200 rounded-2xl shadow-sm px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <p className="text-[11px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">{title}</p>
      <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 leading-tight">{value || '—'}</div>
      {helper && <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 mt-1">{helper}</p>}
    </div>
  );
}
