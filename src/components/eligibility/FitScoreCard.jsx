// src/components/eligibility/FitScoreCard.jsx
export default function FitScoreCard({ score, verdict, updatedAt }) {
  let color = 'bg-green-600 text-white';
  if (verdict === 'Helpful') color = 'bg-yellow-400 text-slate-900';
  if (verdict === 'Optional' || verdict === 'Not Needed Right Now') color = 'bg-slate-200 text-slate-700';
  if (verdict === 'Incomplete') color = 'bg-indigo-200 text-indigo-800';
  return (
    <div className={`rounded-2xl shadow-sm px-8 py-6 flex flex-col items-center min-w-[180px] ${color}`}>
      <div className="text-4xl font-bold mb-1">{score ?? '--'}</div>
      <div className="text-lg font-semibold mb-2">{verdict}</div>
      {updatedAt && <div className="text-xs opacity-80">Last updated<br/>{new Date(updatedAt).toLocaleString()}</div>}
    </div>
  );
}
