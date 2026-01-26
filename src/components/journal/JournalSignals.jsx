// src/components/journal/JournalSignals.jsx
// Fintech signal cards for plan insights
import React from "react";

const severityColors = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700"
};

export default function JournalSignals({ signals }) {
  return (
    <div className="w-full mb-8">
      <div className="text-lg font-bold text-slate-800 mb-3">Your Plan Signals</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {signals.map((signal, idx) => (
          <div key={signal.title + idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
            <div className="font-semibold text-slate-900">{signal.title}</div>
            <div className="text-xs text-slate-500">{signal.reason}</div>
            <span className={`self-start px-2 py-0.5 rounded-full text-xs font-semibold ${severityColors[signal.severity]}`}>{signal.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
