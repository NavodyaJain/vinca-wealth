"use client";
import { useEffect, useState } from "react";
import ElevateTimeline from '@/components/elevate/ElevateTimeline';
import ElevateManagerCard from '@/components/elevate/ElevateManagerCard';
import ElevateWhyCard from '@/components/elevate/ElevateWhyCard';

export default function ElevatePage() {
  // Progress state for tool completion
  const [progress, setProgress] = useState({
    financialReadiness: false,
    lifestylePlanner: false,
    healthStress: false,
    checkEligibility: false,
  });

  useEffect(() => {
    setProgress({
      financialReadiness: localStorage.getItem("vinca_financial_readiness_completed") === "true",
      lifestylePlanner: localStorage.getItem("vinca_lifestyle_planner_completed") === "true",
      healthStress: localStorage.getItem("vinca_health_stress_completed") === "true",
      checkEligibility: localStorage.getItem("vincaUserReadings") ? true : false,
    });
  }, []);

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
    {
      name: "Sneha Iyer",
      avatar: "/public/avatar4.png",
      experience: 8,
      tags: ["Retirement", "Tax Planning"],
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Top Header Strip */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-1">Elevate</h1>
          <p className="text-slate-700 text-base md:text-lg">Get structured guidance with an educational 1:1 session.</p>
        </div>
        {/* Main Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 mb-10 grid grid-cols-12 gap-8 items-start">
          {/* Left: Timeline */}
          <div className="col-span-12 md:col-span-5">
            <ElevateTimeline progress={progress} />
          </div>
          {/* Divider */}
          <div className="hidden md:block col-span-1 h-full">
            <div className="w-px h-full bg-slate-100 mx-auto" />
          </div>
          {/* Right: Booking Panel */}
          <div className="col-span-12 md:col-span-6">
            <div className="mb-4">
              <div className="text-lg font-semibold text-emerald-800 mb-1">Book a session with a Wealth Manager</div>
              <div className="text-slate-600 mb-1 text-sm">This is educational guidance — no stock tips or recommendations.</div>
              <div className="text-slate-500 mb-4 text-sm">Perfect if you want clarity on next steps & a roadmap.</div>
            </div>
            {managers.map((m, i) => (
              <ElevateManagerCard key={m.name} manager={m} />
            ))}
          </div>
        </div>
        {/* Why Elevate Card */}
        <ElevateWhyCard />
      </div>
    </div>
  );
}

// ...existing code...
