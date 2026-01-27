"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CHALLENGES, getChallengeById } from "@/lib/challenges/challengeCatalog";
import {
  getChallengeState,
  saveChallengeState,
  startChallenge,
  toggleTask,
  completeChallenge,
  getChallengeProgress
} from "@/lib/challenges/challengeStore";
import {
  getJournalEntries,
  addJournalEntry,
  hasChallengeCompletionEntry,
  createChallengeCompletionEntry
} from "@/lib/journal/journalStore";

export default function ChallengeDetailPage() {
    // Start Challenge logic
    function handleStart() {
      const today = new Date().toISOString().slice(0, 10);
      let calculatedEnd = today;
      let phaseLen = 1;
      if (challenge.type === "monthly") {
        calculatedEnd = new Date(new Date(today).setMonth(new Date(today).getMonth() + 1)).toISOString().slice(0, 10);
        phaseLen = 1;
      } else if (challenge.type === "quarterly") {
        calculatedEnd = new Date(new Date(today).setMonth(new Date(today).getMonth() + 3)).toISOString().slice(0, 10);
        phaseLen = 3;
      } else if (challenge.type === "yearly") {
        calculatedEnd = new Date(new Date(today).setMonth(new Date(today).getMonth() + 12)).toISOString().slice(0, 10);
        phaseLen = 4;
      }
      const state = getChallengeState();
      state.activeChallengeId = challenge.id;
      state.progress = state.progress || {};
      state.progress[challenge.id] = {
        startedAt: today,
        startDate: today,
        endDate: calculatedEnd,
        status: "active",
        plan,
        phaseStatus: Array(phaseLen).fill("pending")
      };
      saveChallengeState(state);
      setStatus("active");
      setStartDate(today);
      setEndDate(calculatedEnd);
      setPhaseStatus(state.progress[challenge.id].phaseStatus);
      setShowSuccess(false);
    }
  const router = useRouter();
  const params = useParams();
  const { challengeId } = params;
  const challenge = getChallengeById(challengeId);

  // State variables for challenge detail
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState("not_started");
  const [showSuccess, setShowSuccess] = useState(false);
  const [phaseStatus, setPhaseStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    if (!challenge) return;
    const state = getChallengeState();
    setStatus(state.progress?.[challengeId]?.status || "not_started");
    setShowSuccess(state.progress?.[challengeId]?.status === "completed");
    setStartDate(state.progress?.[challengeId]?.startDate || "");
    setEndDate(state.progress?.[challengeId]?.endDate || "");
    setPhaseStatus(state.progress?.[challengeId]?.phaseStatus || []);
    setSelectedStatus(state.progress?.[challengeId]?.phaseStatus?.[0] || null);
    // Simulate readings from user data (replace with actual readings integration)
    const readings = {
      suggestedMonthlySIP: 5000,
      salaryCycle: "Monthly",
      sipMonth1: 5000,
      sipMonth2: 5500,
      sipMonth3: 6000,
      totalQuarterlySIP: 16500,
      stepUpEnabled: true,
      sipQ1: 15000,
      sipQ2: 16000,
      sipQ3: 17000,
      sipQ4: 18000,
      totalAnnualSIP: 66000,
      stepUps: [1000, 1000, 1000, 1000]
    };
    setPlan(challenge?.getPlan ? challenge.getPlan(readings) : null);
  }, [challengeId, challenge]);
  if (!challenge) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500 font-semibold mb-4">Challenge not found</div>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/challenges')}>Back to Challenges</button>
      </div>
    );
  }
  function handlePhaseMark(idx, value) {
    const state = getChallengeState();
    if (!state.progress || !state.progress[challenge.id]) return;
    // Ensure phaseStatus is an array of correct length
    if (!Array.isArray(state.progress[challenge.id].phaseStatus)) {
      let len = 1;
      if (challenge.timelineType === "monthly_checkpoints") len = 3;
      else if (challenge.timelineType === "quarterly_checkpoints") len = 4;
      state.progress[challenge.id].phaseStatus = Array(len).fill("pending");
    }
    state.progress[challenge.id].phaseStatus[idx] = value;
    setSelectedStatus(value);
    if (state.progress[challenge.id].phaseStatus.every(s => s === "completed")) {
      state.progress[challenge.id].status = "completed";
      setShowSuccess(true);
    }
    saveChallengeState(state);
    setPhaseStatus([...state.progress[challenge.id].phaseStatus]);
  }
  function handleLogToJournal() {
    if (!hasChallengeCompletionEntry(challenge.id)) {
      createChallengeCompletionEntry(challenge.id, plan?.suggestedSIP || plan?.totalQuarterlySIP || plan?.totalAnnualSIP || 0);
    }
    router.push("/dashboard/journal");
  }

  // --- PREMIUM FINTECH UI ---
  // ...existing logic...
  // --- PREMIUM FINTECH UI ---
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10 items-center">
      {/* 1️⃣ CHALLENGE BANNER (TOP HERO) */}
      <div className="w-full bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-4 items-center text-center">
        <div className="flex flex-row items-center justify-center gap-4 mb-2">
          <h1 className="text-4xl font-extrabold text-slate-900 flex-1">{challenge.title}</h1>
          <span className="text-base font-semibold rounded-full px-4 py-1 bg-emerald-100 text-emerald-700">{challenge.typeLabel}</span>
          <span className={`text-base font-semibold rounded-full px-4 py-1 ${status === "not_started" ? "bg-slate-100 text-slate-600" : status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 text-white"}`}>{status === "not_started" ? "Not Started" : status === "active" ? "In Progress" : "Completed"}</span>
        </div>
        <div className="flex flex-row justify-center gap-6 text-lg text-slate-700 mb-1">
          {startDate && <div><span className="font-semibold">Start:</span> {startDate}</div>}
          {endDate && <div><span className="font-semibold">End:</span> {endDate}</div>}
        </div>
        <div className="text-slate-500 text-xl font-medium italic mb-1">Build long-term retirement discipline through structured SIP execution.</div>
      </div>

      {/* 2️⃣ OBJECTIVE CARD */}
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-2 items-center">
        <div className="text-lg font-bold text-slate-900 mb-2">Objective</div>
        <div className="flex flex-row gap-8 text-base text-slate-700 justify-center">
          <div><span className="font-semibold">Why:</span> {challenge.objective}</div>
          <div><span className="font-semibold">Who:</span> {challenge.whoFor}</div>
          <div><span className="font-semibold">Discipline:</span> {challenge.disciplineType}</div>
        </div>
      </div>

      {/* 3️⃣ HOW TO COMPLETE THIS CHALLENGE */}
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-2 items-center">
        <div className="text-lg font-bold text-slate-900 mb-2">How to complete this challenge</div>
        {challenge.id === "monthly_sip_kickstart" && (
          <ul className="list-disc text-base text-slate-700 pl-6 text-left w-full max-w-2xl">
            <li>A recommended monthly SIP amount is calculated from your saved retirement readings.</li>
            <li>You must execute this SIP once within the salary month.</li>
            <li>After SIP execution, mark the challenge as completed.</li>
            <li>The challenge completes after one successful SIP confirmation.</li>
          </ul>
        )}
        {challenge.id === "quarterly_sip_discipline" && (
          <ul className="list-disc text-base text-slate-700 pl-6 text-left w-full max-w-2xl">
            <li>A total Quarterly SIP commitment is calculated using your saved retirement readings.</li>
            <li>This amount is automatically divided into 3 monthly SIP executions.</li>
            <li>Each month, you must:
              <ul className="list-disc pl-6">
                <li>Execute the SIP</li>
                <li>Mark it as completed</li>
              </ul>
            </li>
            <li>The challenge completes only when all 3 months are completed.</li>
          </ul>
        )}
        {challenge.id === "annual_retirement_consistency" && (
          <ul className="list-disc text-base text-slate-700 pl-6 text-left w-full max-w-2xl">
            <li>A yearly SIP commitment is calculated using your saved retirement readings.</li>
            <li>This amount is divided into 4 quarterly SIP targets.</li>
            <li>Each quarter, you must:
              <ul className="list-disc pl-6">
                <li>Complete the SIP for that quarter</li>
                <li>Mark the quarter as completed</li>
              </ul>
            </li>
            <li>The challenge completes only when all 4 quarters are completed.</li>
          </ul>
        )}
      </div>

      {/* 4️⃣ NUMERIC INSIGHT CARDS */}
      <div className="w-full flex flex-row gap-8 justify-center">
        {/* Card 1: SIP Commitment */}
        <div className="flex-1 bg-emerald-50 rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-1">
            {challenge.id === "monthly_sip_kickstart"
              ? "Suggested Monthly SIP"
              : challenge.id === "annual_retirement_consistency"
                ? "Annual SIP Commitment"
                : "Quarterly SIP Commitment"}
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            ₹{
              challenge.id === "monthly_sip_kickstart"
                ? plan?.suggestedSIP || "-"
                : challenge.id === "annual_retirement_consistency"
                  ? plan?.totalAnnualSIP || "-"
                  : plan?.totalQuarterlySIP || "-"}
          </div>
        </div>
        {/* Card 2: Salary Month / SIP Completed Till Now */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-1">
            {challenge.id === "monthly_sip_kickstart" ? "Salary Month" : "SIP Completed Till Now"}
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {challenge.id === "monthly_sip_kickstart"
              ? plan?.monthLabel || "-"
              : challenge.id === "annual_retirement_consistency"
                ? (plan?.quarterlySIPs && phaseStatus.length > 0
                    ? plan.quarterlySIPs.reduce((sum, amt, idx) => sum + (phaseStatus[idx] === "completed" ? amt : 0), 0)
                    : 0)
                : (plan?.monthlySIPs && phaseStatus.length > 0
                    ? plan.monthlySIPs.reduce((sum, amt, idx) => sum + (phaseStatus[idx] === "completed" ? amt : 0), 0)
                    : 0)}
          </div>
        </div>
        {/* Card 3: Challenge Completion */}
        <div className="flex-1 bg-emerald-50 rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-1">Challenge Completion</div>
          <div className="text-3xl font-extrabold text-emerald-700">{phaseStatus.length > 0 ? `${Math.round(100 * phaseStatus.filter(s => s === "completed").length / phaseStatus.length)}%` : "0%"}</div>
        </div>
      </div>

      {/* 5️⃣ TIMELINE & CHECKLIST */}
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-4 items-center">
        <div className="text-lg font-bold text-slate-900 mb-2">Timeline & Checklist</div>
        {challenge.id === "monthly_sip_kickstart" && (
          <div className="flex flex-row items-center gap-4 justify-center">
            <button className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition ${phaseStatus[0] === "completed" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => handlePhaseMark(0, "completed")} disabled={phaseStatus[0] === "completed" || status !== "active"}>
              {phaseStatus[0] === "completed" ? "✓" : ""}
            </button>
            <div className="flex flex-col items-start ml-2">
              <span className="text-base text-slate-700 font-semibold">Monthly SIP Executed</span>
              <span className="text-xs text-slate-500">Amount: ₹{plan?.suggestedSIP || "-"}</span>
              <span className="text-xs text-slate-500">Month: {plan?.monthLabel || "-"}</span>
            </div>
          </div>
        )}
        {challenge.type === "quarterly" && (
          <div className="flex flex-row gap-8 justify-center">
            {plan?.monthlySIPs?.map((amt, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <button className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition ${phaseStatus[idx] === "completed" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => handlePhaseMark(idx, "completed")} disabled={phaseStatus[idx] === "completed" || status !== "active"}>
                  {phaseStatus[idx] === "completed" ? "✓" : ""}
                </button>
                <span className="text-xs text-slate-700">Month {idx+1}</span>
                <span className="text-base font-bold text-emerald-700">₹{amt}</span>
              </div>
            ))}
          </div>
        )}
        {challenge.id === "annual_retirement_consistency" && (
          <div className="flex flex-row gap-8 justify-center">
            {plan?.quarterlySIPs?.map((amt, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <button className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition ${phaseStatus[idx] === "completed" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => handlePhaseMark(idx, "completed")} disabled={phaseStatus[idx] === "completed" || status !== "active"}>
                  {phaseStatus[idx] === "completed" ? "✓" : ""}
                </button>
                <span className="text-xs text-slate-700">Quarter {idx+1}</span>
                <span className="text-base font-bold text-emerald-700">₹{amt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6️⃣ START CHALLENGE LOGIC */}
      {status === "not_started" && (
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl px-6 py-4 text-xl transition" onClick={handleStart}>
          Start Challenge
        </button>
      )}

      {/* 7️⃣ CHALLENGE COMPLETION STATE */}
      {status === "completed" && (
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-3xl shadow p-8 flex flex-col gap-4 items-center">
          <div className="text-2xl font-bold text-emerald-700 mb-2">Challenge Completed <span className="align-middle">✅</span></div>
          <div className="text-lg text-slate-900">
            {challenge.id === "monthly_sip_kickstart"
              ? <>SIP Amount Executed: <span className="font-bold">₹{plan?.suggestedSIP || "-"}</span></>
              : challenge.id === "annual_retirement_consistency"
                ? <>Total SIP Invested: <span className="font-bold">₹{plan?.totalAnnualSIP}</span></>
                : <>Total SIP Invested: <span className="font-bold">₹{plan?.totalQuarterlySIP}</span></>}
          </div>
          <div className="text-base text-slate-700">
            {challenge.id === "monthly_sip_kickstart"
              ? <>Salary Month Completed: {plan?.monthLabel || "-"}</>
              : challenge.id === "annual_retirement_consistency"
                ? "Duration completed: 12 months"
                : <>Duration completed: {challenge.durationLabel}</>}
          </div>
          <div className="text-base text-slate-700">
            {challenge.id === "monthly_sip_kickstart"
              ? "You successfully started your retirement SIP this month."
              : challenge.id === "annual_retirement_consistency"
                ? "You successfully maintained SIP discipline for an entire year."
                : "Discipline maintained"}
          </div>
          <div className="flex gap-4 mt-2">
            <button className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50" onClick={handleLogToJournal}>
              Log this into Journal
            </button>
            {challenge.id === "monthly_sip_kickstart" ? (
              <button className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold" onClick={() => router.push('/dashboard/challenges/quarterly_sip_discipline')}>
                View Quarterly SIP Discipline Challenge
              </button>
            ) : (
              <button className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold opacity-50 cursor-not-allowed" disabled>
                View Next Challenge
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
