// ChallengeKPIStrip.jsx
import React from 'react';

const KPI_CONFIG = [
  { key: 'weekly', label: 'Weekly streak' },
  { key: 'monthly', label: 'Monthly streak' },
  { key: 'quarterly', label: 'Quarterly streak' },
  { key: 'yearly', label: 'Yearly streak' }
];

export default function ChallengeKPIStrip({ streaks }) {
  return (
    <div className="flex gap-4 mb-6">
      {KPI_CONFIG.map(kpi => (
        <div key={kpi.key} className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 min-w-[110px]">
          <div className="text-2xl font-bold text-emerald-700">{streaks[kpi.key] || 0}</div>
          <div className="text-xs text-slate-600 font-medium">{kpi.label}</div>
          <div className="text-[10px] text-slate-400 mt-1">Consecutive cycles completed</div>
        </div>
      ))}
    </div>
  );
}
