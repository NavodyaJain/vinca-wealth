"use client";
// src/app/dashboard/challenges/page.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CHALLENGES } from "@/lib/challenges/challengeCatalog";
import { getChallengeState } from "@/lib/challenges/challengeStore";


export default function ChallengesHome() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [challengeState, setChallengeState] = useState({});
  useEffect(() => {
    setChallengeState(getChallengeState());
  }, []);

  // Calculate Comfort Score from all sprint progress
  function calculateComfortScore() {
    const comfortLevels = [];
    
    // Iterate through all challenge progress
    if (challengeState.progress) {
      Object.values(challengeState.progress).forEach(progress => {
        // Get units from each challenge progress
        if (progress.units && typeof progress.units === 'object') {
          Object.values(progress.units).forEach(unit => {
            // Only include entries where sipCompleted === true
            if (unit.form && unit.form.sipCompleted === true && unit.form.comfortLevel) {
              comfortLevels.push(unit.form.comfortLevel);
            }
          });
        }
      });
    }

    // Calculate average and round to whole number
    if (comfortLevels.length === 0) {
      return { score: null, percentage: null, count: 0 };
    }

    const avgComfort = comfortLevels.reduce((sum, level) => sum + level, 0) / comfortLevels.length;
    const roundedScore = Math.round(avgComfort);

    return { score: roundedScore, percentage: null, count: comfortLevels.length };
  }

  const comfortScoreData = calculateComfortScore();

  // Group challenges by cadence
  const cadenceOrder = ["monthly", "quarterly", "yearly"];
  const grouped = cadenceOrder.map(cadence => ({
    cadence,
    challenges: CHALLENGES.filter(c => c.cadence === cadence)
  }));

  // Mindset cards data
  const mindsetCards = [
    {
      id: "monthly_sip_kickstart",
      title: "Monthly Sprint Mindset",
      description: "Kickstart your SIP for the first time. One-time activation to begin your retirement journey."
    },
    {
      id: "quarterly_sip_discipline",
      title: "Quarterly Sprint Mindset",
      description: "Short-term sprint with visible progress. Review discipline every quarter and adjust."
    },
    {
      id: "annual_retirement_consistency",
      title: "Annual Sprint Mindset",
      description: "Long-term discipline and compounding. Measure progress yearly and stay on track."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 pt-12 pb-16">
        {/* Header Update */}
        <div className="mb-8 text-lg text-slate-600 font-normal max-w-2xl">Break long-term retirement investing into focused sprints and track your real progress.</div>

        {/* KPI Cards Section */}
        <div className="w-full flex flex-col sm:flex-row gap-6 mb-14">
          {/* ...existing KPI cards... */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 min-w-[220px]">
            <div className="text-sm text-slate-600 text-center mb-6 leading-snug">You have covered</div>
            <div className="text-5xl font-bold text-emerald-600 mb-4">65%</div>
            <div className="text-sm text-slate-500 text-center leading-snug">In your path from starting to invest until your retirement age.</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 min-w-[220px]">
            <div className="text-sm text-slate-600 text-center mb-6 leading-snug">You have built</div>
            <div className="text-5xl font-bold text-emerald-600 mb-4">65%</div>
            <div className="text-sm text-slate-500 text-center leading-snug">Of the total money your retirement plan requires.</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 min-w-[220px]">
            <div className="text-sm text-slate-600 text-center mb-6 leading-snug">You are currently focused on</div>
            <div className="text-3xl font-bold text-emerald-600 mb-4">Quarterly Sprint</div>
            <div className="text-sm text-slate-500 text-center leading-snug">Jan 29, 2026 – Apr 29, 2026</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 min-w-[220px]">
            <div className="text-sm text-slate-600 text-center mb-6 leading-snug">You feel</div>
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl font-bold text-emerald-600">
                {comfortScoreData.score !== null ? comfortScoreData.score : "—"}
              </div>
              <div className="text-2xl text-slate-400 ml-2">/ 5</div>
            </div>
            <div className="text-sm text-slate-500 text-center leading-snug">confident across your completed sprint.</div>
          </div>
        </div>

        {/* Financial Readiness Sprint Drawer Section */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 mt-10 mb-12">
          <div className="flex flex-col gap-2 mb-4">
            <div className="text-2xl font-bold text-slate-900">Financial Readiness Sprint</div>
            <div className="text-base text-slate-500">Follow this sprint to track your financial readiness.</div>
          </div>
          <button
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base rounded transition-colors w-fit mb-4"
            onClick={() => setDrawerOpen((v) => !v)}
            type="button"
          >
            {drawerOpen ? 'Hide Mindsets' : 'Choose Mindset'}
          </button>
          {drawerOpen && (
            <div className="mt-4 flex flex-col gap-6">
              {mindsetCards.map(card => {
                const isMonthlyCompleted = card.id === "monthly_sip_kickstart" && challengeState.progress?.["monthly_sip_kickstart"]?.status === "completed_final";
                return (
                  <div
                    key={card.id}
                    className={`border px-8 py-7 flex flex-col gap-3 transition-all w-full ${
                      isMonthlyCompleted
                        ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                        : "border-slate-200 bg-white cursor-pointer hover:bg-emerald-50"
                    }`}
                    style={{ borderRadius: 18, boxShadow: isMonthlyCompleted ? "none" : "0 2px 10px 0 rgba(16, 185, 129, 0.04)" }}
                    onClick={() => !isMonthlyCompleted && router.push(`/dashboard/challenges/${card.id}`)}
                  >
                    <div className="font-semibold text-xl text-slate-900 leading-tight mb-2">{card.title}</div>
                    <div className="text-slate-500 text-base mb-3 font-normal">{card.description}</div>
                    {isMonthlyCompleted ? (
                      <div className="mt-2 px-5 py-2 bg-slate-200 text-slate-600 font-medium text-base rounded w-fit cursor-not-allowed">
                        Completed ✓
                      </div>
                    ) : (
                      <button
                        className="mt-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base rounded transition-colors w-fit"
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/dashboard/challenges/${card.id}`);
                        }}
                      >
                        View Sprint
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ...existing grouped sprint cards (if any) can go here... */}
      </div>
    </div>
  );
}
