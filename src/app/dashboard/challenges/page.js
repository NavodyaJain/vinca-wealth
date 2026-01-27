"use client";
// src/app/dashboard/challenges/page.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CHALLENGES } from "@/lib/challenges/challengeCatalog";
import { getChallengeState } from "@/lib/challenges/challengeStore";

const CADENCES = ["monthly", "quarterly", "yearly"];

export default function ChallengesHome() {
  const router = useRouter();
  const [cadence, setCadence] = useState("monthly");
  const [challengeState, setChallengeState] = useState({});

  useEffect(() => {
    setChallengeState(getChallengeState());
  }, []);

  const filtered = CHALLENGES.filter(c => c.cadence === cadence);

  return (
    <div className="w-full px-0 py-6">
      <div className="px-4 sm:px-8 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Challenges</h1>
        <p className="text-slate-600 mb-4">Build retirement discipline with structured SIP commitment challenges.</p>
        <div className="flex gap-2 mb-4">
          {CADENCES.map(c => (
            <button
              key={c}
              className={`px-3 py-1 rounded-full border text-sm font-medium ${cadence === c ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`}
              onClick={() => setCadence(c)}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(challenge => {
            const progress = challengeState.progress?.[challenge.id];
            const isActive = challengeState.activeChallengeId === challenge.id;
            const isCompleted = progress?.status === "completed";
            return (
              <div
                key={challenge.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-2 cursor-pointer hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/challenges/${challenge.id}`)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-slate-900">{challenge.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">{challenge.cadence.charAt(0).toUpperCase() + challenge.cadence.slice(1)}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{challenge.durationLabel}</span>
                </div>
                <div className="text-slate-600 text-sm mb-1">{challenge.bestFor}</div>
                <div className="text-slate-700 text-sm mb-2">{challenge.description}</div>
                {isCompleted ? (
                  <div className="text-emerald-700 font-semibold">Completed ✅</div>
                ) : isActive ? (
                  <div className="text-emerald-600 font-semibold">In Progress</div>
                ) : (
                  <div className="text-slate-400 font-medium">Not started</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
