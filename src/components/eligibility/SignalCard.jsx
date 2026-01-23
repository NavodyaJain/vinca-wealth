// src/components/eligibility/SignalCard.jsx
export default function SignalCard({ title, description, evidence }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 mb-4 flex flex-col gap-1">
      <div className="font-semibold text-slate-900 text-base mb-1">{title}</div>
      <div className="text-slate-700 text-sm mb-1">{description}</div>
      {evidence && <div className="text-green-700 text-xs font-mono">{evidence}</div>}
    </div>
  );
}
