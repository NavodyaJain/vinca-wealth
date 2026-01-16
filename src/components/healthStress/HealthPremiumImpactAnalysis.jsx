import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/formatter';
import HealthCategoryCards from './HealthCategoryCards';

const formatINR = (value, { compact = false, allowZero = false } = {}) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '—';
  if (num === 0 && !allowZero) return '—';
  const abs = Math.abs(num);
  if (compact) {
    if (abs >= 1e7) return `₹${(num / 1e7).toFixed(1)} Cr`;
    if (abs >= 1e5) return `₹${(num / 1e5).toFixed(1)} L`;
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  }
  return formatCurrency(num);
};

const StatusPill = ({ tone, label }) => {
  const map = {
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    red: 'bg-rose-100 text-rose-800 border-rose-200'
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${map[tone] || map.green}`}>{label}</span>;
};

const HealthPremiumImpactAnalysis = ({ analysis, isLocked, selectedCategory, onSelectCategory }) => {
  if (!analysis || analysis.error) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-white text-slate-600">
        Add your retirement inputs to see personalized premium analysis.
      </div>
    );
  }

  const gapTone = analysis.monthlyGap <= 0 ? 'green' : analysis.monthlyGap < analysis.requiredMonthlyAtRetirement * 0.1 ? 'amber' : 'red';
  const statusTone = analysis.statusTone || gapTone;
  const statusLabel = analysis.statusLabel || (statusTone === 'green' ? 'Survives' : statusTone === 'amber' ? 'Tight' : 'Not Affordable');

  const pressureSeries = analysis.pressureSeries || [];

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 ${isLocked ? 'select-none' : ''}`}>
      <div className="flex flex-col gap-2 mb-6">
        <div className="text-sm font-semibold text-indigo-700">Premium Analysis</div>
        <h3 className="text-2xl font-bold text-slate-900">Personalized Impact on Your Retirement Plan</h3>
        <p className="text-sm text-slate-600">Simulates how this health category affects your retirement sustainability using your Financial Readiness inputs.</p>
        <p className="text-xs text-slate-500">Assumes 80% insurance coverage (20% out-of-pocket). Educational only.</p>
      </div>

      <div className="mb-8">
        <div className="text-sm font-semibold text-slate-800 mb-3">Choose a health category</div>
        <HealthCategoryCards selectedId={selectedCategory} onSelect={onSelectCategory} disabled={isLocked} />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="text-xs font-semibold text-slate-700 mb-1">Health-Adjusted Corpus</div>
            <div className="text-2xl font-bold text-slate-900">{formatINR(analysis.healthAdjustedCorpusAtRetirement, { compact: true, allowZero: true })}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="text-xs font-semibold text-slate-700 mb-1">Monthly Health-Adjusted Expenses (20% OOP)</div>
            <div className="text-2xl font-bold text-slate-900">{formatINR(analysis.requiredMonthlyAtRetirement, { compact: true, allowZero: true })} / month</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="text-xs font-semibold text-slate-700 mb-1">Monthly Withdrawal Your Plan Can Support</div>
            <div className="text-2xl font-bold text-slate-900">{formatINR(analysis.supportedMonthlyAtRetirement, { compact: true, allowZero: true })} / month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${gapTone === 'green' ? 'border-emerald-200 bg-emerald-50' : gapTone === 'amber' ? 'border-amber-200 bg-amber-50' : 'border-rose-200 bg-rose-50'}`}>
            <div className={`text-xs font-semibold ${gapTone === 'green' ? 'text-emerald-700' : gapTone === 'amber' ? 'text-amber-700' : 'text-rose-700'} mb-1`}>Monthly Gap</div>
            <div className={`text-2xl font-bold ${gapTone === 'green' ? 'text-emerald-700' : gapTone === 'amber' ? 'text-amber-700' : 'text-rose-700'}`}>
              {formatINR(analysis.monthlyGap, { compact: true, allowZero: true })} / month
            </div>
            <div className="text-xs text-slate-600">Negative or zero gap means you survive</div>
          </div>
          <div className={`p-4 rounded-xl border ${statusTone === 'green' ? 'border-emerald-200 bg-emerald-50' : statusTone === 'amber' ? 'border-amber-200 bg-amber-50' : 'border-rose-200 bg-rose-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-800">Plan outcome</div>
              <StatusPill tone={statusTone} label={statusLabel} />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {analysis.survivalAge >= analysis.inputs?.lifespan
                ? `Your plan survives this category till age ${analysis.survivalAge}`
                : `Your plan runs out around age ${analysis.survivalAge}`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-orange-200 bg-orange-50">
            <div className="text-xs font-semibold text-orange-700 mb-1">Hospitalization days your plan can support</div>
            <div className="text-2xl font-bold text-slate-900">
              {selectedCategory === 'everyday' ? 'No hospitalization required' : `${analysis.hospitalizationDaysAffordable ?? '—'}${analysis.hospitalizationDaysAffordable ? ' days' : ''}`}
            </div>
            <div className="text-xs text-slate-600">{selectedCategory === 'everyday' ? 'Routine OPD and medicines only' : 'Based on daily hospitalization out-of-pocket'}</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
            <div className="text-xs font-semibold text-blue-700 mb-1">Nursing / Recovery support</div>
            <div className="text-2xl font-bold text-slate-900">
              {selectedCategory === 'everyday' ? 'No nursing required' : `${analysis.nursingMonthsAffordable ?? '—'}${analysis.nursingMonthsAffordable ? ' months' : ''}`}
            </div>
            <div className="text-xs text-slate-600">{selectedCategory === 'everyday' ? 'These scenarios avoid long recovery' : 'Based on monthly recovery out-of-pocket'}</div>
          </div>
        </div>

        {/* Charts removed per request */}
      </div>
    </div>
  );
};

export default HealthPremiumImpactAnalysis;
