"use client";
import { useEffect, useState } from "react";

export default function ElevatePage() {
  // Progress state for tool completion
  const [progress, setProgress] = useState({
    financialReadiness: false,
    lifestylePlanner: false,
    healthStress: false,
  });

  useEffect(() => {
    // Read tool completion from localStorage (namespace safe)
    setProgress({
      financialReadiness: localStorage.getItem("vinca_financial_readiness_completed") === "true",
      lifestylePlanner: localStorage.getItem("vinca_lifestyle_planner_completed") === "true",
      healthStress: localStorage.getItem("vinca_health_stress_completed") === "true",
    });
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = Object.keys(progress).length;

  // Mock manager data
  const managers = [
    {
      name: "Aarav Mehta",
      avatar: "/public/avatar1.png",
      experience: 12,
      tags: ["Retirement", "FIRE", "Tax Planning"],
    },
    {
      name: "Priya Sharma",
      avatar: "/public/avatar2.png",
      experience: 9,
      tags: ["Health Planning", "Retirement"],
    },
    {
      name: "Rahul Verma",
      avatar: "/public/avatar3.png",
      experience: 15,
      tags: ["Retirement", "Corpus", "Withdrawal"],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Hero Block */}
      <div className="bg-emerald-50 rounded-xl shadow p-6 md:p-10 mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">Elevate your retirement plan</h1>
        <p className="text-emerald-800 mb-2 md:text-lg">
          Your tools already give you clarity. Elevate helps you go one step further with structured guidance and accountability — through an expert session.
        </p>
        <div className="text-xs text-gray-500 mt-2">
          Educational guidance only. No stock tips or recommendations.
        </div>
      </div>

      {/* Progress + Readiness Indicator */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col items-center">
        <div className="font-semibold text-emerald-800 mb-2">Steps Completed</div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-2">
          <Step status={progress.financialReadiness} label="Financial Readiness" link="/dashboard/financial-readiness" />
          <Step status={progress.lifestylePlanner} label="Lifestyle Planner" link="/dashboard/lifestyle-planner" />
          <Step status={progress.healthStress} label="Health Stress Test" link="/dashboard/health-stress" />
        </div>
        <div className="text-sm text-gray-700 mb-2">
          You’ve completed {completedCount}/{totalCount} steps
        </div>
        {completedCount < totalCount && (
          <a
            href={
              !progress.financialReadiness
                ? "/dashboard/financial-readiness"
                : !progress.lifestylePlanner
                ? "/dashboard/lifestyle-planner"
                : "/dashboard/health-stress"
            }
            className="inline-block mt-2 px-4 py-2 rounded bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
          >
            Complete remaining tools
          </a>
        )}
      </div>

      {/* Wealth Managers Section */}
      <div className="mb-4">
        <div className="font-semibold text-emerald-800 mb-4 text-lg text-center">Meet our Wealth Managers</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {managers.map((m, i) => (
            <div key={m.name} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-full h-full object-cover"
                  onError={e => (e.target.style.display = 'none')}
                />
              </div>
              <div className="font-semibold text-emerald-900 text-lg">{m.name}</div>
              <div className="text-xs text-emerald-700 mb-1">Wealth Manager</div>
              <div className="text-xs text-gray-500 mb-2">{m.experience} years experience</div>
              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {m.tags.map(tag => (
                  <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-100">{tag}</span>
                ))}
              </div>
              <a
                href={`/dashboard/investor-hub/elevate/book?manager=${encodeURIComponent(m.name)}`}
                className="mt-auto px-4 py-2 rounded bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
              >
                Book session
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step({ status, label, link }) {
  return (
    <a
      href={link}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
        status
          ? "bg-emerald-100 border-emerald-200 text-emerald-800"
          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
      }`}
    >
      <span className={`inline-block w-3 h-3 rounded-full ${status ? "bg-emerald-500" : "bg-slate-300"}`}></span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs">{status ? "Completed" : "Not completed"}</span>
    </a>
  );
}
