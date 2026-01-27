// src/components/journal/ExecutionHeatmap.jsx
// GitHub-style monthly SIP execution heatmap for last 12 months
import React from "react";
import { formatMonthYear } from "@/lib/journal/dateUtils";

const STATUS_COLORS = {
  executed: "bg-emerald-500 border-emerald-600",
  partial: "bg-yellow-400 border-yellow-500",
  missed: "bg-slate-300 border-slate-400"
};

export default function ExecutionHeatmap({ months }) {
  // months: [{ month: '2025-12', status: 'executed'|'partial'|'missed', planned, executed, challenge }]
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row gap-2 mb-2">
        {months.map((m, idx) => (
          <div key={m.month}
            className={`w-10 h-10 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer group transition-all ${STATUS_COLORS[m.status]}`}
            title={`${formatMonthYear(m.month)}\nPlanned: ₹${m.planned}\nExecuted: ₹${m.executed}\nChallenge: ${m.challenge}`}
          >
            <span className="text-xs font-bold text-white">{formatMonthYear(m.month).split(' ')[0]}</span>
            <span className="text-[10px] text-white">{m.status === 'executed' ? '✔' : m.status === 'partial' ? '△' : '–'}</span>
            <div className="hidden group-hover:block absolute mt-12 z-10 bg-white text-slate-700 text-xs rounded shadow p-2 min-w-[120px] border border-slate-200">
              <div><b>{formatMonthYear(m.month)}</b></div>
              <div>Planned: ₹{m.planned}</div>
              <div>Executed: ₹{m.executed}</div>
              <div>Challenge: {m.challenge}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-xs text-slate-500">
        <span><span className="inline-block w-3 h-3 rounded bg-emerald-500 mr-1 align-middle"></span>Executed</span>
        <span><span className="inline-block w-3 h-3 rounded bg-yellow-400 mr-1 align-middle"></span>Partial</span>
        <span><span className="inline-block w-3 h-3 rounded bg-slate-300 mr-1 align-middle"></span>Missed</span>
      </div>
    </div>
  );
}
