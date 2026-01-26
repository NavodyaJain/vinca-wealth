// src/components/journal/JournalKpiRing.jsx
// Premium KPI ring card for fintech dashboard
import React from "react";
import { Progress } from "@/components/ui/Progress";

export default function JournalKpiRing({ value, max = 100, label, subtext, badge, color = "emerald" }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 min-w-[180px]">
      <div className="relative w-24 h-24 mb-2">
        <Progress value={value} max={max} className={`absolute top-0 left-0 w-full h-full rounded-full bg-slate-100`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold text-${color}-700`}>{value}%</span>
        </div>
      </div>
      <div className="text-lg font-semibold text-slate-800 mb-1">{label}</div>
      {subtext && <div className="text-xs text-slate-500 mb-2">{subtext}</div>}
      {badge && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>{badge}</span>}
    </div>
  );
}
