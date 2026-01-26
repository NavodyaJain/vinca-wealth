// CadenceTabs.jsx
import React from 'react';

const CADENCES = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'yearly', label: 'Yearly' }
];

export default function CadenceTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-6">
      {CADENCES.map(cadence => (
        <button
          key={cadence.key}
          className={`px-4 py-1 rounded-full font-semibold text-sm border transition ${active === cadence.key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200'}`}
          onClick={() => onChange(cadence.key)}
        >
          {cadence.label}
        </button>
      ))}
    </div>
  );
}
