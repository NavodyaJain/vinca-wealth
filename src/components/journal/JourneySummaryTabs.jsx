// JourneySummaryTabs.jsx
import React, { useState } from "react";
export default function JourneySummaryTabs() {
  const [tab, setTab] = useState(0);
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex gap-4 mb-4">
        <button className={tab === 0 ? "font-bold text-emerald-600" : "text-slate-600"} onClick={() => setTab(0)}>So Far</button>
        <button className={tab === 1 ? "font-bold text-emerald-600" : "text-slate-600"} onClick={() => setTab(1)}>At Retirement</button>
        <button className={tab === 2 ? "font-bold text-emerald-600" : "text-slate-600"} onClick={() => setTab(2)}>Post Retirement</button>
      </div>
      {tab === 0 && <div>Total SIP committed, executed, miss count, streak, recovery, etc.</div>}
      {tab === 1 && <div>Locked until retirement date.</div>}
      {tab === 2 && <div>Unlocked after retirement. Quarterly reflections.</div>}
    </div>
  );
}
