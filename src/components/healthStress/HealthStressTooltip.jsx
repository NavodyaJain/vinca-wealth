import React from 'react';

const formatCompactINR = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '—';
  const abs = Math.abs(num);
  if (abs >= 1e7) return `₹${(num / 1e7).toFixed(1).replace(/\.0$/, '')} Cr`;
  if (abs >= 1e5) return `₹${(num / 1e5).toFixed(1).replace(/\.0$/, '')} L`;
  if (abs >= 1e3) return `₹${(num / 1e3).toFixed(1).replace(/\.0$/, '')}k`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
};

export default function HealthStressTooltip({
  active,
  payload,
  label,
  retirementAge,
  lifeExpectancyAge
}) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload || {};
  const age = Number.isFinite(data.age) ? data.age : retirementAge + Number(label || 0);
  const yearNumber = Number.isFinite(age) && Number.isFinite(retirementAge) ? Math.max(1, age - retirementAge + 1) : label;
  const baselineRequired = data.baselineRequiredMonthly;
  const required = data.requiredMonthly;
  const supported = data.supportedMonthly;
  const gap = Number.isFinite(required) && Number.isFinite(supported) ? required - supported : null;
  const corpus = data.corpusAfter;
  const gapTone = gap !== null && gap <= 0 ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 max-w-xs text-slate-800">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-semibold text-slate-900">Age {age}</div>
        <div className="text-[11px] text-slate-500">Year {yearNumber} of retirement</div>
      </div>
      <div className="text-[11px] text-slate-500 mb-3">
        Retirement starts at {retirementAge} · Planning till {lifeExpectancyAge}
      </div>

      <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-2">Monthly</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Baseline required</span>
          <span className="font-semibold">{formatCompactINR(baselineRequired)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Required (with disease)</span>
          <span className="font-semibold">{formatCompactINR(required)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Supported by plan</span>
          <span className="font-semibold">{formatCompactINR(supported)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Gap (disease)</span>
          <span className={`font-semibold ${gapTone}`}>{formatCompactINR(gap)}</span>
        </div>
      </div>

      {Number.isFinite(corpus) && (
        <>
          <div className="mt-3 text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-2">Remaining corpus</div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Corpus after withdrawals</span>
            <span className="font-semibold">{formatCompactINR(corpus)}</span>
          </div>
        </>
      )}
    </div>
  );
}
