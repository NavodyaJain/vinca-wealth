"use client";
import React, { useState, useEffect } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { getActiveSprint, completeSprint, getSprintHistory } from "@/lib/retirementSprintEngine";
import MonthCard from "@/components/MonthCard";
import { formatDateRange } from "@/utils/dateFormatter";

export default function QuarterlySprintExecution() {
  const { formData } = useCalculator();
  const [refresh, setRefresh] = useState(0);
  const [localSprint, setLocalSprint] = useState(null);
  const [history, setHistory] = useState([]);
  const [monthStates, setMonthStates] = useState([{}, {}, {}]);
  const [expanded, setExpanded] = useState(0);
  const [showCompleteBanner, setShowCompleteBanner] = useState(false);

  useEffect(() => {
    setLocalSprint(getActiveSprint());
    setHistory(getSprintHistory().filter(s => s.type === "quarterly"));
  }, [refresh]);

  // Static KPIs
  const kpiCards = [
    { label: "Sprint Duration", value: "3 Months (1 Quarter)" },
    { label: "Total SIP Commitment", value: formData.monthlySIP ? `₹${Number(formData.monthlySIP * 3).toLocaleString('en-IN')}` : "-" }
  ];

  // Simulate 3 months for the quarter
  let months = [];
  if (localSprint && localSprint.startDate) {
    const start = new Date(localSprint.startDate);
    for (let i = 0; i < 3; i++) {
      const mStart = new Date(start);
      mStart.setMonth(start.getMonth() + i);
      const mEnd = new Date(mStart);
      mEnd.setDate(mEnd.getDate() + 29); // Approximate 1 month
      months.push({
        label: mStart.toLocaleString('default', { month: 'long' }),
        start: mStart,
        end: mEnd,
      });
    }
  }

  function handleSaveMonth(idx, data) {
    const newStates = [...monthStates];
    newStates[idx] = data;
    setMonthStates(newStates);
    // Expand next month if exists
    if (idx < 2) setExpanded(idx + 1);
    // If all months saved, complete sprint
    if (newStates.every(m => m.saved)) {
      completeSprint();
      setShowCompleteBanner(true);
      setRefresh(r => r + 1);
    }
  }

  const monthsCompleted = monthStates.filter(m => m.saved).length;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Quarterly Sprint Execution</h1>
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
          <div className="text-slate-700 mb-4">You’ve successfully completed your quarterly SIP discipline sprint.</div>
          <div className="flex gap-4">
            <a href="/sprints/quarterly" className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Start next Quarterly Sprint</a>
            <a href="/sprints" className="px-5 py-2 rounded-full bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300">Change Sprint Mindset</a>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-slate-700 font-medium">{monthsCompleted} of 3 months completed</div>
          <div className="flex flex-col gap-6">
            {months.map((month, idx) => (
              <MonthCard
                key={idx}
                monthLabel={month.label}
                startDate={month.start}
                endDate={month.end}
                status={monthStates[idx]?.saved ? "completed" : "pending"}
                initial={monthStates[idx]}
                onSave={data => handleSaveMonth(idx, data)}
                disabled={idx > 0 && !monthStates[idx-1]?.saved}
                readOnly={monthStates[idx]?.saved}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
