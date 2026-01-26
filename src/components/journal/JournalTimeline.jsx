
"use client";
import React from "react";

function formatWeekRange(weekStart, weekEnd) {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const opts = { day: '2-digit', month: 'short' };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

export default function JournalTimeline({ weeklyEntries, onViewEntry }) {
  return (
    <div className="w-full max-w-7xl mx-auto mt-6">
      <div className="text-xl font-bold text-slate-900 mb-4">Your Weekly Entries</div>
      {(!weeklyEntries || weeklyEntries.length === 0) ? (
        <div className="text-center text-slate-400 py-12">
          Start your first weekly check-in to track progress.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {weeklyEntries.map(entry => (
            <div key={entry.weekStart} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 items-center mb-1">
                  <span className="font-semibold text-emerald-700 text-base">{formatWeekRange(entry.weekStart, entry.weekEnd)}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${entry.status === 'done' ? 'bg-emerald-100 text-emerald-700' : entry.status === 'draft' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-400'}`}>
                    {entry.status === 'done' ? '✅ Done' : entry.status === 'draft' ? '✏️ Draft' : '⏳ Missed'}
                  </span>
                </div>
                <div className="text-slate-900 font-medium mb-1 truncate max-w-full">{entry.reflection || 'No reflection added.'}</div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {(entry.tags || []).map(tag => (
                    <span key={entry.weekStart + '-' + tag} className="bg-emerald-50 text-emerald-700 text-xs rounded px-2 py-0.5">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  className="px-4 py-1 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 text-xs"
                  onClick={() => onViewEntry && onViewEntry(entry)}
                >
                  View Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
