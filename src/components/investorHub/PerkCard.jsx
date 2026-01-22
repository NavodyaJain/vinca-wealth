// src/components/investorHub/PerkCard.jsx
import React from 'react';
import { BadgePercent } from 'lucide-react';

export default function PerkCard({ perk, onClick, redeemed }) {
  return (
    <div
      className={`flex bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer min-h-[140px] max-h-[180px] w-full`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${perk.title}`}
    >
      <div className="flex-none w-[140px] h-full flex items-center justify-center overflow-hidden rounded-l-2xl bg-slate-50">
        <img src={perk.image} alt={perk.title} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1 flex flex-col justify-between p-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-emerald-800 line-clamp-1">{perk.title}</span>
          <span className="ml-auto"><BadgePercent className="h-5 w-5 text-emerald-400" /></span>
        </div>
        <div className="text-gray-700 text-sm line-clamp-2">{perk.description}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-100">{perk.category}</span>
          <span className="text-xs text-gray-500 ml-2">Valid till {perk.validTill}</span>
        </div>
        <div className="flex gap-2 mt-2">
          {redeemed ? (
            <span className="px-4 py-1 rounded bg-emerald-100 border border-emerald-400 text-emerald-700 font-semibold text-xs">Redeemed</span>
          ) : (
            <button
              className="px-4 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs hover:bg-emerald-100"
              onClick={e => { e.stopPropagation(); onClick(); }}
            >
              View Perk
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
