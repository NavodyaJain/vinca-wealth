"use client";
import React, { useState, useEffect } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { getActiveSprint, completeSprint, getSprintHistory } from "@/lib/retirementSprintEngine";
import MonthCard from "@/components/MonthCard";
import { formatDateRange } from "@/utils/dateFormatter";

export default function AnnualSprintExecution() {
  const { formData } = useCalculator();
  const [refresh, setRefresh] = useState(0);
  const [localSprint, setLocalSprint] = useState(null);
  const [history, setHistory] = useState([]);
  const [quarterStates, setQuarterStates] = useState([
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}],
  ]);
  const [expandedQuarter, setExpandedQuarter] = useState(0);
  const [expandedMonth, setExpandedMonth] = useState([0,0,0,0]);
  const [showCompleteBanner, setShowCompleteBanner] = useState(false);

  useEffect(() => {
    setLocalSprint(getActiveSprint());
    setHistory(getSprintHistory().filter(s => s.type === "annual"));
  }, [refresh]);

  // Static KPIs
  const kpiCards = [
    { label: "Sprint Duration", value: "12 Months (4 Quarters)" },
    { label: "Total SIP Commitment", value: formData.monthlySIP ? `₹${Number(formData.monthlySIP * 12).toLocaleString('en-IN')}` : "-" }
  ];

  // Simulate 4 quarters × 3 months
  let quarters = [];
  if (localSprint && localSprint.startDate) {
    const start = new Date(localSprint.startDate);
    for (let q = 0; q < 4; q++) {
      const qStart = new Date(start);
      qStart.setMonth(start.getMonth() + q * 3);
      const qEnd = new Date(qStart);
      qEnd.setMonth(qEnd.getMonth() + 3);
      qEnd.setDate(qEnd.getDate() - 1);
      quarters.push({
        label: `Quarter ${q + 1}`,
        start: qStart,
        end: qEnd,
        months: Array.from({ length: 3 }, (_, m) => {
          const mStart = new Date(qStart);
          mStart.setMonth(qStart.getMonth() + m);
          const mEnd = new Date(mStart);
          mEnd.setDate(mEnd.getDate() + 29);
          return {
            label: mStart.toLocaleString('default', { month: 'long' }),
            start: mStart,
            end: mEnd,
          };
        })
      });
    }
  }

  function handleSaveMonth(qIdx, mIdx, data) {
    const newStates = quarterStates.map(q => q.map(m => ({ ...m })));
    newStates[qIdx][mIdx] = data;
    setQuarterStates(newStates);
    // Expand next month or next quarter
    if (mIdx < 2) {
      const newExpanded = [...expandedMonth];
      newExpanded[qIdx] = mIdx + 1;
      setExpandedMonth(newExpanded);
    } else if (qIdx < 3) {
      setExpandedQuarter(qIdx + 1);
    }
    // If all months in all quarters saved, complete sprint
    if (newStates.every(q => q.every(m => m.saved))) {
      completeSprint();
      setShowCompleteBanner(true);
      setRefresh(r => r + 1);
    }
  }

  const quartersCompleted = quarterStates.filter(q => q.every(m => m.saved)).length;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Annual Sprint Execution</h1>
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
          <div className="text-slate-700 mb-4">You’ve successfully completed your annual SIP discipline sprint.</div>
          <div className="flex gap-4">
            <a href="/sprints/annual" className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Start next Annual Sprint</a>
            <a href="/sprints" className="px-5 py-2 rounded-full bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300">Change Sprint Mindset</a>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-slate-700 font-medium">Quarter {quartersCompleted + 1} of 4</div>
          <div className="flex flex-col gap-8">
            {quarters.map((quarter, qIdx) => (
              <div key={qIdx} className={`border rounded-xl p-5 ${expandedQuarter === qIdx ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200"} ${qIdx > 0 && !quarterStates[qIdx-1].every(m => m.saved) ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-lg font-semibold text-slate-900">{quarter.label} ({formatDateRange(quarter.start, quarter.end)})</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${quarterStates[qIdx].every(m => m.saved) ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {quarterStates[qIdx].every(m => m.saved) ? "Completed" : "Pending"}
                  </span>
                </div>
                {expandedQuarter === qIdx && (
                  <div className="flex flex-col gap-6">
                    {quarter.months.map((month, mIdx) => (
                      <MonthCard
                        key={mIdx}
                        monthLabel={month.label}
                        startDate={month.start}
                        endDate={month.end}
                        status={quarterStates[qIdx][mIdx]?.saved ? "completed" : "pending"}
                        initial={quarterStates[qIdx][mIdx]}
                        onSave={data => handleSaveMonth(qIdx, mIdx, data)}
                        disabled={mIdx > 0 && !quarterStates[qIdx][mIdx-1]?.saved}
                        readOnly={quarterStates[qIdx][mIdx]?.saved}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
