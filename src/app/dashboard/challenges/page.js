"use client";
// src/app/dashboard/challenges/page.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CHALLENGES } from "@/lib/challenges/challengeCatalog";
import { getChallengeState } from "@/lib/challenges/challengeStore";


export default function ChallengesHome() {
  const router = useRouter();

  const [challengeState, setChallengeState] = useState({});
  useEffect(() => {
    setChallengeState(getChallengeState());
  }, []);

  // Group challenges by cadence
  const cadenceOrder = ["monthly", "quarterly", "yearly"];
  const cadenceMeta = {
    monthly: {
      title: "Monthly Challenge",
      description: "Short-term commitment to kick-start your retirement investing habit."
    },
    quarterly: {
      title: "Quarterly Challenge",
      description: "Build consistency and discipline across multiple salary cycles."
    },
    yearly: {
      title: "Yearly Challenge",
      description: "Long-term retirement execution discipline across the year."
    }
  };

  // Group challenges by cadence
  const grouped = cadenceOrder.map(cadence => ({
    cadence,
    challenges: CHALLENGES.filter(c => c.cadence === cadence)
  }));

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 pt-12 pb-16">
        {/* Header Update */}
        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">Retirement Sprints</h1>
        <div className="mb-8 text-lg text-slate-600 font-normal max-w-2xl">Break long-term retirement investing into focused sprints and track your real progress.</div>

        {/* KPI Cards Section */}
        <div className="w-full flex flex-col sm:flex-row gap-6 mb-14">
          {/* KPI Card 1: Journey Completed */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 min-w-[220px]">
            <div className="mb-4 font-semibold text-slate-900 text-lg">Journey Completed</div>
            <div className="relative flex items-center justify-center mb-3" style={{ width: 100, height: 100 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="kpi1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#kpi1-gradient)"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * 0.35}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s' }}
                />
                <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="2em" fontWeight="bold" fill="#10b981">65%</text>
              </svg>
            </div>
            <div className="text-sm text-slate-500 text-center leading-snug">From start of investing to retirement age</div>
          </div>

          {/* KPI Card 2: Corpus Generated */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 min-w-[220px]">
            <div className="mb-4 font-semibold text-slate-900 text-lg">Corpus Generated</div>
            <div className="relative flex items-center justify-center mb-3" style={{ width: 100, height: 100 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="kpi2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#kpi2-gradient)"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * 0.35}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s' }}
                />
                <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="2em" fontWeight="bold" fill="#10b981">65%</text>
              </svg>
            </div>
            <div className="text-sm text-slate-500 text-center leading-snug">Of target retirement corpus</div>
          </div>

          {/* KPI Card 3: Active Sprint */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 min-w-[220px]">
            <div className="mb-4 font-semibold text-slate-900 text-lg">Active Sprint</div>
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="text-xl font-bold text-emerald-600 mb-1">Quarterly Sprint</div>
              <div className="text-base text-slate-500">Jan 29, 2026 – Apr 29, 2026</div>
            </div>
            <div className="text-sm text-slate-400 text-center">Sprint name and duration</div>
          </div>
        </div>

        {/* Sprint Cards */}
        {grouped.map((section, idx) => (
          <section
            key={section.cadence}
            className={`w-full ${idx > 0 ? "mt-12" : ""} ${idx < grouped.length - 1 ? "pb-10 border-b border-slate-200" : "pb-0"}`}
          >
            <div className="flex flex-col gap-8">
              {section.challenges.map(challenge => {
                let title = "";
                let description = "";
                if (challenge.id === "monthly_sip_kickstart") {
                  title = "Monthly Sprint Mindset";
                  description = "Kickstart your SIP for the first time. One-time activation to begin your retirement journey.";
                } else if (challenge.id === "quarterly_sip_discipline") {
                  title = "Quarterly Sprint Mindset";
                  description = "Short-term sprint with visible progress. Review discipline every quarter and adjust.";
                } else if (challenge.id === "annual_retirement_consistency") {
                  title = "Annual Sprint Mindset";
                  description = "Long-term discipline and compounding. Measure progress yearly and stay on track.";
                }
                return (
                  <div
                    key={challenge.id}
                    className="border border-slate-200 bg-white px-8 py-7 flex flex-col gap-3 cursor-pointer hover:bg-emerald-50 transition-all w-full"
                    style={{ borderRadius: 18, boxShadow: "0 2px 10px 0 rgba(16, 185, 129, 0.04)" }}
                    onClick={() => router.push(`/dashboard/challenges/${challenge.id}`)}
                  >
                    <div className="font-semibold text-xl text-slate-900 leading-tight mb-2">{title}</div>
                    <div className="text-slate-500 text-base mb-3 font-normal">{description}</div>
                    <button
                      className="mt-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base rounded transition-colors w-fit"
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/dashboard/challenges/${challenge.id}`);
                      }}
                    >
                      View Sprint
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
