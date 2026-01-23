// src/components/checkEligibility/MembershipFitCard.jsx
export default function MembershipFitCard({ fit }) {
  if (!fit) return null;
  let badgeColor = 'bg-green-600';
  if (fit.verdict === 'Helpful') badgeColor = 'bg-yellow-500';
  if (fit.verdict === 'Not Needed Right Now') badgeColor = 'bg-slate-400';
  if (fit.verdict === 'Run tools first') badgeColor = 'bg-indigo-500';
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
      <div className={`px-4 py-2 rounded-full text-white font-semibold text-lg ${badgeColor}`}>{fit.verdict}</div>
      <div className="flex-1">
        <div className="text-xl font-bold text-slate-900 mb-1">{fit.title}</div>
        <div className="text-slate-700 text-base">{fit.subtitle}</div>
      </div>
    </div>
  );
}
