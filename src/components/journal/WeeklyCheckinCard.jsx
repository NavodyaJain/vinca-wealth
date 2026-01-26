// src/components/journal/WeeklyCheckinCard.jsx
"use client";
import React from "react";

export default function WeeklyCheckinCard({ streak, lastCheckin, weekStatus, onAddEntry }) {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl shadow p-6 flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="text-lg font-bold text-slate-900">This Week’s Check-in</div>
        <button
          className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          onClick={onAddEntry}
        >
          Add Weekly Entry
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 flex flex-col gap-1">
          <div className="text-sm text-slate-700">Weekly streak: <span className="font-semibold text-emerald-700">{streak} week{streak === 1 ? '' : 's'} 🔥</span></div>
          <div className="text-xs text-slate-500">Last check-in: {lastCheckin || '—'}</div>
        </div>
        <div className="flex-1 flex flex-col gap-1 items-center">
          <div className="flex gap-1">
            {weekStatus.map((status, i) => (
              <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full border text-lg font-bold ${status === 'done' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : status === 'draft' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                {status === 'done' ? '✅' : status === 'draft' ? '✏️' : '❌'}
              </span>
            ))}
          </div>
          <div className="text-xs text-slate-400 mt-1">Last 6 weeks</div>
        </div>
      </div>
    </div>
  );
}
