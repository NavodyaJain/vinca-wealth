import React from "react";
import { PHASES } from "@/lib/retirementPhaseTracker";
import { CheckCircle, Hourglass, Lock } from "lucide-react";

const statusMap = {
  completed: { icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, label: "Completed", color: "emerald" },
  in_progress: { icon: <Hourglass className="w-4 h-4 text-yellow-500" />, label: "In Progress", color: "yellow" },
  locked: { icon: <Lock className="w-4 h-4 text-slate-400" />, label: "Locked", color: "slate" }
};

export default function RetirementPhaseTracker({ phaseProgress, currentPhase }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {PHASES.map(phase => {
          const status = phaseProgress?.[phase.id]?.status || "locked";
          const percent = phaseProgress?.[phase.id]?.percent || 0;
          const statusObj = statusMap[status];
          return (
            <div key={phase.id} className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col gap-2 min-w-[180px]">
              <div className="flex items-center gap-2 mb-1">
                {/* Icon placeholder, can swap for themed icon */}
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                  {phase.title.charAt(0)}
                </div>
                <div className="font-semibold text-slate-900 text-base">{phase.title}</div>
                <span className={`ml-auto flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-${statusObj.color}-50 text-${statusObj.color}-700`}>
                  {statusObj.icon} {statusObj.label}
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-1">{phase.description}</div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full bg-emerald-500 transition-all`} style={{ width: `${percent}%` }}></div>
              </div>
              <div className="text-xs text-slate-600 mt-1">{percent}% complete</div>
            </div>
          );
        })}
      </div>
      {/* Current Phase Banner */}
      {currentPhase && (
        <div className="w-full mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="font-semibold text-emerald-800 text-base flex-1">
            You are currently in: <span className="text-emerald-900">{PHASES.find(p => p.id === currentPhase)?.title} Phase</span>
          </div>
          {/* Placeholder for recommended actions, to be filled by parent */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Example actions, should be passed as prop or computed */}
            <span className="bg-white border border-emerald-200 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">Save your FIRE reading</span>
            <span className="bg-white border border-emerald-200 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">Test health stress</span>
            <span className="bg-white border border-emerald-200 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">Try lifestyle affordability</span>
          </div>
        </div>
      )}
    </div>
  );
}
