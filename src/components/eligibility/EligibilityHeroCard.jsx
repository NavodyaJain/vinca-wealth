// src/components/eligibility/EligibilityHeroCard.jsx
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function EligibilityHeroCard({ score, verdict, onJoin, reasons }) {
  // Map verdict to color and label
  const verdictColor = verdict === 'Strong Fit' ? 'text-emerald-700' : verdict === 'Helpful' ? 'text-yellow-600' : verdict === 'Optional' ? 'text-slate-500' : 'text-indigo-600';
  const scoreBg = verdict === 'Strong Fit' ? 'bg-emerald-50' : verdict === 'Helpful' ? 'bg-yellow-50' : verdict === 'Optional' ? 'bg-slate-50' : 'bg-indigo-50';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
      {/* Left: Score + CTA */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">Your Financial Readiness Fit</h1>
          <p className="text-slate-600 text-base md:text-lg mb-4">A quantified view of how well Vinca supports your current stage.</p>
        </div>
        <div className={`rounded-xl px-8 py-6 flex flex-col items-center ${scoreBg} border border-slate-200 mb-2`}>
          <div className="text-5xl font-bold mb-2 text-emerald-700">{score ?? '--'}%</div>
          <div className={`text-base font-medium mb-4 ${verdictColor}`}>{verdict}</div>
          <p className="text-xs text-slate-600 text-center leading-relaxed">This score reflects how closely Vinca's tools align with your current financial readiness needs.</p>
        </div>
        <button
          className="w-full md:w-auto px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition"
          onClick={onJoin}
        >
          Join Membership
        </button>
        <div className="text-xs text-gray-500 mt-2">Educational membership. No stock tips or recommendations.</div>
      </div>
      {/* Right: Signals Checklist */}
      <div>
        <div className="text-lg font-semibold text-emerald-800 mb-4">Signals in your retirement plan</div>
        <ul className="space-y-3">
          {reasons && reasons.length > 0 ? reasons.map((r, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-800 text-base">
              <AlertTriangle className="h-5 w-5 text-emerald-500" />
              <span>{r.title}</span>
            </li>
          )) : (
            <>
              <li className="flex items-center gap-3 text-gray-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Your plan looks stable based on current inputs</span>
              </li>
              <li className="flex items-center gap-3 text-gray-800 text-base">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Membership is optional — but can still help you stay consistent</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
