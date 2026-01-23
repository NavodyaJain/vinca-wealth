// src/components/checkEligibility/BenefitCards.jsx
export default function BenefitCards({ benefits, optional }) {
  if (!benefits || benefits.length === 0) return null;
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${optional ? 'opacity-70' : ''}`}>
      {benefits.map((b) => (
        <div key={b.id} className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col gap-2 shadow-sm h-full">
          <div className="font-semibold text-slate-800">{b.title}</div>
          <div className="text-slate-600 text-sm">{b.whyItHelps}</div>
        </div>
      ))}
    </div>
  );
}
