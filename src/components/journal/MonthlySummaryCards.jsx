// src/components/journal/MonthlySummaryCards.jsx
// Monthly summary cards for fintech journal
import React from "react";
import { formatMonthYear } from "@/lib/journal/dateUtils";

export default function MonthlySummaryCards({ summaries }) {
  return (
    <div className="w-full mt-8">
      <div className="text-lg font-bold text-slate-800 mb-3">Monthly Summaries</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {summaries.map(summary => (
          <div key={summary.month} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
            <div className="font-semibold text-slate-900">{formatMonthYear(summary.month)}</div>
            <div className="text-xs text-slate-500">Avg Discipline: <span className="font-bold text-emerald-700">{summary.avgDiscipline}</span></div>
            <div className="text-xs text-slate-500">SIP Increase: <span className="font-bold">₹{summary.totalSIPChange}</span></div>
            <div className="text-xs text-slate-500">Emergency Spends: <span className="font-bold">₹{summary.totalEmergency}</span></div>
            <div className="text-xs text-slate-500">Top Improvement: <span className="font-bold">{summary.topImprovement}</span></div>
            <div className="text-xs text-slate-500">Next Month Focus: <span className="font-bold">{summary.nextFocus}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
