"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getActiveSprint, startSprint } from "@/lib/retirementSprintEngine";

const SPRINTS = {
  monthly: {
    title: "Monthly Sprint",
    desc: "Kickstart your SIP for the first time. One-time activation to begin your retirement journey.",
    objective: [
      "Breaks inertia and gets you started.",
      "Perfect for beginners or those restarting.",
      "Helps you build the first habit of monthly investing."
    ],
    how: [
      "Execute your SIP once for the month."
    ]
  },
  quarterly: {
    title: "Quarterly Sprint",
    desc: "Short-term motivation with visible progress. Review discipline every quarter and adjust.",
    objective: [
      "Tracks discipline over 3 months.",
      "Ideal for those who want to build consistency.",
      "Lets you review and adjust every quarter."
    ],
    how: [
      "Execute your SIP for 3 consecutive months.",
      "Complete all 3 months to finish the sprint."
    ]
  },
  annual: {
    title: "Annual Sprint",
    desc: "Long-term discipline and compounding. Measure progress yearly and stay on track.",
    objective: [
      "Tracks discipline for a full year (4 quarters).",
      "Best for experienced investors seeking long-term consistency.",
      "Helps you stay accountable for the entire year."
    ],
    how: [
      "Maintain discipline for 4 quarters.",
      "Annual sprint completes ONLY after all 4 quarters are completed."
    ]
  }
};

export default function ViewSprintPage({ type }) {
  const router = useRouter();
  const active = getActiveSprint();
  const isActive = active && active.type === type && active.status === "in_progress";
  const isOtherActive = active && (!isActive);

  function handleStart() {
    startSprint(type);
    router.push(`/sprints/${type}/execute`);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* 1. Top Banner */}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{SPRINTS[type].title}</h1>
      <div className="text-lg text-slate-600 mb-6">{SPRINTS[type].desc}</div>

      {/* 2. Objective Section */}
      <div className="mb-6">
        <div className="font-semibold text-slate-900 mb-1">Why this sprint?</div>
        <ul className="list-disc ml-6 text-slate-700 text-[15px]">
          {SPRINTS[type].objective.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </div>

      {/* 3. How to Complete */}
      <div className="mb-8">
        <div className="font-semibold text-slate-900 mb-1">How to Complete This Sprint</div>
        <ul className="list-disc ml-6 text-slate-700 text-[15px]">
          {SPRINTS[type].how.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>

      {/* 4. Start Sprint Button */}
      <button
        className={`px-6 py-3 rounded-full font-semibold bg-emerald-600 text-white hover:bg-emerald-700${isOtherActive ? " bg-slate-400 cursor-not-allowed" : ""}`}
        onClick={isActive ? () => router.push(`/sprints/${type}/execute`) : handleStart}
        disabled={isOtherActive}
      >
        {isActive ? "Go to Active Sprint" : "Start Sprint"}
      </button>
      {isOtherActive && (
        <div className="mt-2 text-rose-600 font-medium">You are already enrolled in a sprint. Complete it before switching.</div>
      )}
    </div>
  );
}
