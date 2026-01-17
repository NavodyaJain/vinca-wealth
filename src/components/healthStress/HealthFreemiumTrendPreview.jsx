import { formatCurrency } from '@/lib/formatter';
import { calculateFreemiumHealthAdjustedCorpus } from '@/lib/healthStressTrends';

const formatINR = (value, { compact = false } = {}) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return '—';
  const abs = Math.abs(num);
  if (compact) {
    if (abs >= 1e7) return `₹${(num / 1e7).toFixed(1)} Cr`;
    if (abs >= 1e5) return `₹${(num / 1e5).toFixed(1)} L`;
  }
  return formatCurrency(num);
};

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const HealthFreemiumTrendPreview = ({ userInputs, onUpgrade }) => {
  const { healthAdjustedCorpus, extraMonthlyHealthLoad } = calculateFreemiumHealthAdjustedCorpus(userInputs || {});
  const monthlyExpenses = Math.max(0, safeNumber(userInputs?.monthlyExpenses, 50000));
  const incomeCushion = monthlyExpenses - extraMonthlyHealthLoad;

  const renderValue = (value, opts = {}) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '—';
    return formatINR(num, opts);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Your retirement plan vs general healthcare trends</h3>
        <p className="text-sm text-slate-600">A baseline preview of how rising healthcare costs typically affect retirement income and corpus over time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="text-xs font-semibold text-slate-600 mb-1">Health-adjusted retirement corpus (trend)</div>
          <div className="text-2xl font-bold text-slate-900">{renderValue(healthAdjustedCorpus, { compact: true })}</div>
          <div className="text-xs text-slate-600">Directional preview after typical healthcare inflation and routine medical costs. Not disease-specific.</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="text-xs font-semibold text-slate-600 mb-1">Ongoing healthcare load in retirement</div>
          <div className="text-2xl font-bold text-slate-900">{renderValue(extraMonthlyHealthLoad, { compact: true })} / month</div>
          <div className="text-xs text-slate-600">Typical OPD, medicines, diagnostics that rise with age and inflation (trend-based).</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="text-xs font-semibold text-slate-600 mb-1">Income cushion after healthcare costs</div>
          <div className="text-2xl font-bold text-slate-900">{renderValue(incomeCushion, { compact: true })} / month</div>
          <div className="text-xs text-slate-600">What may remain after typical healthcare spending — before lifestyle upgrades or emergencies.</div>
        </div>
      </div>
    </div>
  );
};

export default HealthFreemiumTrendPreview;
