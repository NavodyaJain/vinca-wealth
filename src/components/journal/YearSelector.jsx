// YearSelector.jsx
import React from "react";
export default function YearSelector({ years = [2024, 2025, 2026], selected = 2026, onSelect }) {
  return (
    <div className="flex gap-2 mb-4">
      {years.map(y => (
        <button
          key={y}
          className={`px-3 py-1 rounded ${y === selected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          onClick={() => onSelect && onSelect(y)}
        >
          {y}
        </button>
      ))}
    </div>
  );
}
