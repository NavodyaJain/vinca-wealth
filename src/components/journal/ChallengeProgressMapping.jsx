// src/components/journal/ChallengeProgressMapping.jsx
// Maps each challenge to SIP committed, executed, completion, and corpus impact
import React from "react";
import { formatINR } from "@/lib/journal/dateUtils";

export default function ChallengeProgressMapping({ challenges }) {
  // challenges: [{ name, duration, sipCommitted, sipExecuted, completion, corpusImpact }]
  return (
    <div className="w-full flex flex-col gap-4">
      {challenges.length === 0 ? (
        <div className="text-slate-400 text-center py-8">No challenges yet. Start one to see your progress here.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {challenges.map((c, idx) => (
            <div key={c.name + idx} className="bg-white rounded-2xl border border-slate-200 shadow p-5 flex flex-col gap-2">
              <div className="text-lg font-bold text-slate-900 mb-1">{c.name}</div>
              <div className="text-xs text-slate-500 mb-1">Duration: <span className="font-semibold text-emerald-700">{c.duration}</span></div>
              <div className="text-xs text-slate-500">SIP Committed: <span className="font-bold">₹{c.sipCommitted.toLocaleString()}</span></div>
              <div className="text-xs text-slate-500">SIP Executed: <span className="font-bold">₹{c.sipExecuted.toLocaleString()}</span></div>
              <div className="text-xs text-slate-500">Completion: <span className="font-bold text-emerald-700">{c.completion}%</span></div>
              <div className="text-xs text-slate-500">Corpus Impact: <span className="font-bold">₹{c.corpusImpact.toLocaleString()}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
