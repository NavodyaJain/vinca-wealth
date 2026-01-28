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
      <div className="max-w-5xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-8 pt-8 pb-12">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2 tracking-tight">Challenges</h1>
        <div className="mb-1 text-[17px] text-slate-800 font-medium">Convert long-term retirement investing into small, time-bound SIP execution sprints.</div>
        <div className="mb-8 text-base text-slate-500 font-normal">Each challenge helps you focus on execution over a defined period — month, quarter, or year.</div>
        {grouped.map((section, idx) => (
          <section
            key={section.cadence}
            className={`w-full ${idx > 0 ? "mt-8" : ""} ${idx < grouped.length - 1 ? "pb-6 border-b border-slate-200" : "pb-0"}`}
          >
            <div className="flex flex-col gap-6">
              {section.challenges.map(challenge => {
                const progress = challengeState.progress?.[challenge.id];
                const isActive = challengeState.activeChallengeId === challenge.id && progress?.status === "active";
                const isCompleted = progress?.status === "completed";
                let description = "";
                if (challenge.id === "monthly_sip_kickstart") {
                  description = "A 30-day execution sprint to start or restart your retirement SIP. Designed to help you convert intention into your first consistent monthly investment.";
                } else if (challenge.id === "quarterly_sip_discipline") {
                  description = "A 3-month execution sprint to maintain SIP discipline across multiple salary cycles. Helps you stay consistent even when expenses, distractions, or motivation fluctuate.";
                } else if (challenge.id === "annual_retirement_consistency") {
                  description = "A 12-month execution sprint to sustain long-term retirement investing without burnout. Focused on rhythm, continuity, and staying invested through all market and life phases.";
                }
                return (
                  <div
                    key={challenge.id}
                    className="border border-slate-200 bg-white px-6 py-5 flex flex-col gap-2 cursor-pointer hover:bg-emerald-50 transition-all w-full"
                    style={{ borderRadius: 16, boxShadow: "0 1px 6px 0 rgba(16, 185, 129, 0.03)" }}
                    onClick={() => router.push(`/dashboard/challenges/${challenge.id}`)}
                  >
                    <div className="font-semibold text-lg text-slate-900 leading-tight mb-1">{challenge.title}</div>
                    <div className="text-slate-500 text-[15px] mb-2 font-normal">{description}</div>
                    <div className="mt-1">
                      {isCompleted ? (
                        <span className="text-emerald-700 font-medium text-sm" style={{ opacity: 0.85 }}>Completed</span>
                      ) : isActive ? (
                        <span className="text-emerald-600 font-medium text-sm" style={{ opacity: 0.85 }}>In Progress</span>
                      ) : (
                        <span className="text-slate-400 font-medium text-sm">Not Started</span>
                      )}
                    </div>
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
