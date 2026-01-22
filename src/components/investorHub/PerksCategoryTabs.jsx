// src/components/investorHub/PerksCategoryTabs.jsx
import React from 'react';

const CATEGORIES = [
  'All',
  'Tax & Compliance',
  'Investing Tools',
  'Learning & Books',
  'Health & Insurance',
  'Credit Cards & Banking',
  'Lifestyle & Wellness',
  'Partner Discounts',
];

export default function PerksCategoryTabs({ selected, onSelect }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar mb-4">
      <div className="flex w-max gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap border border-slate-200 ${selected === cat ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-slate-50 text-emerald-800 hover:bg-emerald-100'}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
