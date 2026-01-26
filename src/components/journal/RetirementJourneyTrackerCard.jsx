// src/components/journal/RetirementJourneyTrackerCard.jsx
"use client";
import React from "react";
import { Progress } from "@/components/ui/Progress";

export default function RetirementJourneyTrackerCard({ journey }) {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row gap-8 mb-8">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col gap-2 min-w-[220px]">
        <div className="text-lg font-bold text-slate-900 mb-1">Your Retirement Journey</div>
        <div className="text-slate-500 mb-2">Weekly check-ins to stay consistent and disciplined.</div>
        <div className="flex flex-col gap-1 text-sm text-slate-700">
          <div><span className="font-semibold">Started On:</span> {journey.formatted.start}</div>
          <div><span className="font-semibold">Target Retirement Age:</span> {journey.retirementAge || 60} yrs</div>
          <div><span className="font-semibold">Current Age:</span> {journey.currentAge || 30} yrs</div>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col gap-3 items-center justify-center min-w-[220px]">
        <div className="flex gap-3 w-full justify-center mb-2">
          <KpiPill label="Time Passed" value={journey.formatted.timePassed} />
          <KpiPill label="Time Left" value={journey.formatted.timeLeft} />
          <KpiPill label="Journey Completion" value={journey.percentComplete + '%'} />
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-4 rounded-full bg-emerald-500 transition-all" style={{ width: `${journey.percentComplete}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Start</span>
            <span>Retirement</span>
          </div>
        </div>
        <div className="text-xs text-slate-600 mt-2">You’re on track if you stay consistent for the next <span className="font-semibold">{journey.formatted.timeLeft}</span></div>
        <div className="text-xs text-emerald-700 mt-1">Next milestone: Finish this week’s check-in ✅</div>
      </div>
    </div>
  );
}

function KpiPill({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 min-w-[90px]">
      <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
      <div className="text-lg font-bold text-emerald-700">{value}</div>
    </div>
  );
}
