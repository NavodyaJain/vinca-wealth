// JourneyCompletionCard.jsx
// Shows journey completion as a circular progress card
import React from "react";

export default function JourneyCompletionCard({ percent = 14, yearsLeft = 26, monthsLeft = 0 }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[160px]">
      <div className="relative flex items-center justify-center mb-2">
        {/* Simple circular progress (replace with SVG for animation if needed) */}
        <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-2xl font-bold text-emerald-600">
          {percent}%
        </div>
      </div>
      <div className="text-lg font-semibold text-slate-900 mb-1">Journey Completion</div>
      <div className="text-sm text-slate-500">Time left: {yearsLeft} years, {monthsLeft} months</div>
    </div>
  );
}
