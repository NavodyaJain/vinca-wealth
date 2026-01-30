"use client";
import React, { useState, useEffect } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { getActiveSprint, completeSprint, getSprintHistory } from "@/lib/retirementSprintEngine";
import MonthCard from "@/components/MonthCard";

export default function MonthlySprintExecution() {
  const { formData } = useCalculator();
  const [refresh, setRefresh] = useState(0);
  const [localSprint, setLocalSprint] = useState(null);
  const [history, setHistory] = useState([]);
  const [monthState, setMonthState] = useState({});
  const [showCompleteBanner, setShowCompleteBanner] = useState(false);

  useEffect(() => {
    setLocalSprint(getActiveSprint());
    setHistory(getSprintHistory().filter(s => s.type === "monthly"));
  }, [refresh]);

  // Static KPIs
  const kpiCards = [
    { label: "Sprint Duration", value: "1 Month" },
    { label: "Total SIP Commitment", value: formData.monthlySIP ? `₹${Number(formData.monthlySIP).toLocaleString('en-IN')}` : "-" }
  ];

  function handleSaveMonth(data) {
    setMonthState(data);
    completeSprint();
    setShowCompleteBanner(true);
    setRefresh(r => r + 1);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Monthly Sprint Execution</h1>
      <div className="flex gap-6 mb-8">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col items-center">
            <div className="text-2xl font-bold text-emerald-700 mb-1">{kpi.value}</div>
            <div className="text-slate-700 text-sm font-medium">{kpi.label}</div>
          </div>
        ))}
      </div>
      {showCompleteBanner || (localSprint && localSprint.status === "completed") ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6 flex flex-col gap-2 items-center">
          <div className="text-lg font-semibold text-emerald-800 mb-2">Sprint Completed!</div>
          <div className="text-slate-700 mb-4">You’ve successfully completed your monthly SIP discipline sprint.</div>
          <div className="flex gap-4">
            <a href="/sprints/monthly" className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Start next Monthly Sprint</a>
            <a href="/sprints" className="px-5 py-2 rounded-full bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300">Change Sprint Mindset</a>
          </div>
        </div>
      ) : (
        <MonthCard
          monthLabel={localSprint && localSprint.startDate ? new Date(localSprint.startDate).toLocaleString('default', { month: 'long' }) : "Current Month"}
          startDate={localSprint?.startDate}
          endDate={localSprint?.endDate}
          status={localSprint?.status}
          initial={monthState}
          onSave={handleSaveMonth}
        />
      )}
    </div>
  );
}
