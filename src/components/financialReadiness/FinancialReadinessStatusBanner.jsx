// src/components/financialReadiness/FinancialReadinessStatusBanner.jsx
import KpiCard from '../KpiCard';

const FinancialReadinessStatusBanner = ({ results }) => {
  const {
    expectedCorpusAtRetirement,
    requiredCorpusAtRetirement,
    currentMonthlySIP,
    requiredMonthlySIP,
    depletionAge,
    retirementAge,
    lifespan
  } = results;

  const formatCurrency = (value) => {
    if (value === undefined || value === null || Number.isNaN(value)) return '—';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    if (value === 0) return '₹0';
    return `₹${Math.round(value).toLocaleString('en-IN')}`;
  };

  const gap = requiredCorpusAtRetirement !== undefined && expectedCorpusAtRetirement !== undefined
    ? requiredCorpusAtRetirement - expectedCorpusAtRetirement
    : null;

  const depletionCopy = depletionAge
    ? `Your expected corpus may deplete around age ${depletionAge.toFixed(1)}`
    : `Your corpus is projected to last till age ${lifespan}+ ✅`;

  const depletionTone = () => {
    if (depletionAge && depletionAge < lifespan - 5) return 'risk'; // early depletion
    if (depletionAge && depletionAge < lifespan) return 'tight'; // close to lifespan
    return 'stable';
  };

  const tone = depletionTone();
  const toneClasses = {
    risk: 'bg-rose-50 border-rose-200 text-rose-700',
    tight: 'bg-amber-50 border-amber-200 text-amber-700',
    stable: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-wrap gap-4">
        <KpiCard title="Expected Retirement Age" value={retirementAge ? `${Math.round(retirementAge)} yrs` : '—'} helper="Your selected retirement age" />
        <KpiCard title="Expected Corpus by that Age" value={formatCurrency(expectedCorpusAtRetirement)} helper="Projected with current SIP" />
        <KpiCard title="Required Corpus" value={formatCurrency(requiredCorpusAtRetirement)} helper="Needed to sustain till lifespan" />
        <KpiCard title="Gap in Corpus" value={gap !== null ? formatCurrency(gap) : '—'} helper="Required minus expected corpus" />
      </div>

      <div className={`text-sm font-medium rounded-xl border px-4 py-3 ${toneClasses[tone]}`}>{depletionCopy}</div>

      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <p className="text-sm text-slate-600 mb-1">Current SIP</p>
            <div className="text-2xl font-semibold text-slate-900">{formatCurrency(currentMonthlySIP)}</div>
            <p className="text-xs text-slate-500">Per month</p>
          </div>
          <div className="border border-green-100 rounded-xl p-4 bg-emerald-50">
            <p className="text-sm text-emerald-700 mb-1">Required SIP</p>
            <div className="text-2xl font-semibold text-slate-900">{formatCurrency(requiredMonthlySIP)}</div>
            <p className="text-xs text-emerald-700">Targets corpus that meets your need at retirement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReadinessStatusBanner;