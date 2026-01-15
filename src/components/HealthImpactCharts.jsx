'use client';

import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';

// General educational charts used as a fallback/legacy view. These are generic (non-personalized).
export default function HealthImpactCharts() {
  const generalInflationData = useMemo(() => {
    const baseCost = 100000;
    return Array.from({ length: 21 }, (_, year) => ({
      year,
      medical: Math.round(baseCost * Math.pow(1.09, year)),
      normal: Math.round(baseCost * Math.pow(1.06, year))
    }));
  }, []);

  const healthEventConversionData = useMemo(() => {
    const typicalMonthlySpend = 50000;
    const categories = [
      { label: 'Everyday care (₹5k/mo)', annualCost: 5000 * 12 },
      { label: 'Planned event (₹3L one-time)', annualCost: 300000 },
      { label: 'High impact event (₹12L one-time)', annualCost: 1200000 }
    ];
    return categories.map((item) => ({
      label: item.label,
      months: Number(((item.annualCost / typicalMonthlySpend)).toFixed(1))
    }));
  }, []);

  const insuranceRealityData = useMemo(
    () => [
      {
        label: '₹10L hospital bill',
        insurance: 800000,
        oop: 200000
      }
    ],
    []
  );

  const readinessData = useMemo(() => {
    const hospitalPerDay = 20000;
    const emergencyFund = 300000;
    const healthBuffer = 200000;
    const total = emergencyFund + healthBuffer;
    return [
      {
        label: 'Emergency fund only',
        days: Math.round(emergencyFund / hospitalPerDay)
      },
      {
        label: 'Emergency + health buffer',
        days: Math.round(total / hospitalPerDay)
      },
      {
        label: 'Insurance + buffer',
        days: Math.round(total / (hospitalPerDay * 0.2))
      }
    ];
  }, []);

  const formatINR = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '—';
    const abs = Math.abs(num);
    if (abs >= 1e7) return `₹${(num / 1e7).toFixed(1).replace(/\.0$/, '')} Cr`;
    if (abs >= 1e5) return `₹${(num / 1e5).toFixed(1).replace(/\.0$/, '')} L`;
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-amber-600" />
          <h4 className="text-lg font-medium text-slate-800">Medical Inflation vs Normal Inflation (India Trend)</h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">Generic view: medical costs (9%) outpace general inflation (6%) over time.</p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generalInflationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v)} />
                <Tooltip formatter={(value) => formatINR(value)} labelFormatter={(label) => `Year ${label}`} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ paddingTop: '12px' }} />
                <Line type="monotone" dataKey="medical" name="Medical (9%)" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="normal" name="Normal (6%)" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} className="text-blue-600" />
          <h4 className="text-lg font-medium text-slate-800">How One Health Event Converts to Months of Retirement Spending</h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">General example vs typical ₹50k/month retirement spend.</p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthEventConversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} angle={-10} textAnchor="end" height={70} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}m`} label={{ value: 'Months of expenses', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value} months`} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="months" name="Months of retirement spend" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-rose-600" />
          <h4 className="text-lg font-medium text-slate-800">Insurance vs Out-of-Pocket Reality (80/20 example)</h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">Sample ₹10L bill with 80% insurance coverage.</p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insuranceRealityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v)} />
                <Tooltip formatter={(value) => formatINR(value)} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="insurance" stackId="a" name="Insurance (80%)" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="oop" stackId="a" name="Out-of-pocket (20%)" fill="#ef4444" radius={[0, 0, 6, 6]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} className="text-purple-600" />
          <h4 className="text-lg font-medium text-slate-800">Emergency Readiness: Buffer vs No Buffer</h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">General days of hospitalization covered.</p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} angle={-10} textAnchor="end" height={70} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'Days covered', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value} days`} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="days" name="Days covered" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}