export default function KpiCard({ title, value, helper }) {
  return (
    <div className="flex-1 min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{title}</p>
      <div className="text-2xl font-semibold text-slate-900 leading-tight">{value || '—'}</div>
      {helper && <p className="text-xs text-slate-500 mt-1">{helper}</p>}
    </div>
  );
}
