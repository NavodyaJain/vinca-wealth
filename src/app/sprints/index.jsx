"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCalculator } from "@/context/CalculatorContext";
import { getSprintKPIs, getActiveSprint } from "@/lib/retirementSprintEngine";
import CircularKpiCard from "@/components/CircularKpiCard";

export default function SprintsHome() {
  const router = useRouter();
  const { formData } = useCalculator();
  const [kpis, setKpis] = useState(null);
  const [activeSprint, setActiveSprint] = useState(null);
  useEffect(() => {
    // Only run on client
    const user = {
      currentAge: formData.currentAge,
      retirementAge: formData.retirementAge,
      requiredCorpus: formData.requiredCorpus ?? formData.expectedCorpus,
      currentCorpus: formData.moneySaved,
      monthlySIP: formData.monthlySIP,
    };
    setKpis(getSprintKPIs(user));
    setActiveSprint(getActiveSprint());
  }, [formData]);

  const sprintCards = [
    {
      type: "monthly",
      title: "Monthly Sprint Mindset",
      copy: "Kickstart your SIP for the first time. One-time activation to begin your retirement journey.",
      route: "/sprints/monthly"
    },
    {
      type: "quarterly",
      title: "Quarterly Sprint Mindset",
      copy: "Short-term motivation with visible progress. Review discipline every quarter and adjust.",
      route: "/sprints/quarterly"
    },
    {
      type: "annual",
      title: "Annual Sprint Mindset",
      copy: "Long-term discipline and compounding. Measure progress yearly and stay on track.",
      route: "/sprints/annual"
    }
  ];

  if (!kpis) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Retirement Sprints</h1>
        <div className="text-lg text-slate-600">Break long-term retirement investing into focused sprints and track your real progress.</div>
      </div>

      {/* KPI Cards */}
      <div className="flex flex-col sm:flex-row gap-6 mb-12 items-center justify-center">
        <CircularKpiCard
          percent={kpis.journeyCompleted}
          label="Journey Completed"
          subtext="From start of investing to retirement age"
        />
        <CircularKpiCard
          percent={kpis.corpusProgress}
          label="Corpus Progress"
          subtext={`${formData.moneySaved?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} of ${(formData.requiredCorpus ?? formData.expectedCorpus)?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} goal`}
        />
        <div className="flex flex-col items-center">
          <CircularKpiCard
            percent={activeSprint ? 100 : 0}
            label={activeSprint ? `${capitalize(activeSprint.type)} Sprint · In Progress` : "No Active Sprint"}
            subtext={activeSprint ? `Ends ${activeSprint.endDate ? new Date(activeSprint.endDate).toLocaleDateString() : ''}` : ""}
            active={!!activeSprint}
          />
          {kpis.delta > 0 && (
            <div className="text-xs text-emerald-700 mt-1">You’re {kpis.delta}% closer to financial readiness than last sprint.</div>
          )}
        </div>
      </div>

      {/* Sprint Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sprintCards.map((card) => (
          <div
            key={card.type}
            className="border border-slate-200 bg-white px-6 py-6 flex flex-col gap-2 cursor-pointer hover:bg-emerald-50 transition-all w-full rounded-2xl shadow-sm"
            onClick={() => router.push(card.route)}
          >
            <div className="font-semibold text-lg text-slate-900 leading-tight mb-1">{card.title}</div>
            <div className="text-slate-700 text-[15px] mb-2 font-normal min-h-12">{card.copy}</div>
            <button className="mt-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all w-fit self-start">View Sprint</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
