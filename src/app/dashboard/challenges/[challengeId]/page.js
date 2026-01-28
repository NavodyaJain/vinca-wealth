"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CHALLENGES, getChallengeById } from "@/lib/challenges/challengeCatalog";
import ChallengeSummaryCardRow from "@/components/ChallengeSummaryCardRow";
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
      createChallengeCompletionEntry({ challenge, phase: plan?.suggestedSIP || plan?.totalQuarterlySIP || plan?.totalAnnualSIP || 0 });
    }
    router.push("/dashboard/journal");
  }

  // --- PREMIUM FINTECH UI ---
  // ...existing logic...
  // --- PREMIUM FINTECH UI ---
    // --- Helper for month/quarter date ranges ---
    function getMonthRange(start, monthOffset) {
      const base = new Date(start);
      const monthStart = new Date(base.getFullYear(), base.getMonth() + monthOffset, base.getDate());
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      return {
        label: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
        range: `${monthStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} → ${monthEnd.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`,
        start: monthStart,
        end: monthEnd
      };
    }
    function getQuarterRange(start, quarterIdx) {
      const base = new Date(start);
      const qStart = new Date(base.getFullYear(), base.getMonth() + quarterIdx * 3, base.getDate());
      const qEnd = new Date(qStart);
      qEnd.setMonth(qEnd.getMonth() + 3);
      return {
        label: `Q${quarterIdx + 1} ${qStart.getFullYear()}`,
        range: `${qStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} → ${qEnd.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`,
        start: qStart,
        end: qEnd
      };
    }

    // --- Execution unit state model ---
    // { [unitIdx]: { form: {...}, isOpen, isDirty, isSaved, isCompleted } }
    const [units, setUnits] = useState({});
    useEffect(() => {
      if (status === "active" || status === "completed") {
        const state = getChallengeState();
        const saved = state.progress?.[challengeId]?.units || {};
        setUnits(saved);
      }
    }, [challengeId, status]);

    function updateUnit(unitIdx, patch) {
      setUnits(prev => {
        const next = { ...prev, [unitIdx]: { ...prev[unitIdx], ...patch, isDirty: true } };
        return next;
      });
    }

    function saveUnit(unitIdx) {
      setUnits(prev => {
        const next = { ...prev, [unitIdx]: { ...prev[unitIdx], isSaved: true, isCompleted: true, isDirty: false } };
        // Persist
        const state = getChallengeState();
        state.progress[challengeId].units = next;
        saveChallengeState(state);
        return next;
      });
    }

    function logToJournal(unitIdx, meta) {
      const unit = units[unitIdx];
      addJournalEntry({
        challengeId,
        challengeTitle: challenge.title,
        period: meta.label,
        range: meta.range,
        quarter: meta.quarter,
        answers: unit?.form
      });
      router.push("/dashboard/journal");
    }

    function toggleUnitOpen(unitIdx) {
      setUnits(prev => ({ ...prev, [unitIdx]: { ...prev[unitIdx], isOpen: !prev[unitIdx]?.isOpen } }));
    }

    // --- UI ---
    return (
      <div className="w-full max-w-3xl mx-auto pl-4 pr-4 sm:pl-8 sm:pr-8 py-10 flex flex-col gap-10">
        {/* 1️⃣ CHALLENGE HEADER */}
        <div className="w-full bg-white rounded-2xl shadow p-7 flex flex-col gap-2 items-start">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{challenge.title}</h1>
          <div className="text-[16px] text-slate-700 mb-1">This challenge breaks your long-term retirement SIP into manageable execution sprints.</div>
          <div className="text-sm mt-2">
            {status === "completed" ? (
              <span className="text-emerald-700 font-medium">Completed</span>
            ) : status === "active" ? (
              <span className="text-emerald-600 font-medium">In Progress</span>
            ) : (
              <span className="text-slate-400 font-medium">Not Started</span>
            )}
          </div>
        </div>

      {/* 2️⃣ OBJECTIVE CARD (REWRITTEN) */}
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-2 items-start">
        <div className="text-lg font-bold text-slate-900 mb-2">Objective</div>
        <div className="flex flex-row gap-8 text-base text-slate-700">
          <div><span className="font-semibold">Why:</span> Reduce execution friction by focusing on a single, time-bound SIP commitment.</div>
          <div><span className="font-semibold">Who:</span> Investors starting or restarting retirement investing.</div>
          <div><span className="font-semibold">Discipline:</span> Salary-aligned SIP execution with clear completion criteria.</div>
        </div>
      </div>

      {/* 3️⃣ HOW TO COMPLETE (STANDARDIZED, ANNUAL) */}
      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-2 items-start">
        <div className="text-lg font-bold text-slate-900 mb-2">How to complete</div>
        {challenge.id === "annual_retirement_consistency" ? (
          <ul className="list-disc text-base text-slate-700 pl-6 text-left w-full max-w-2xl">
            <li>Your annual SIP commitment is divided into quarterly and monthly execution sprints</li>
            <li>Each month requires:
              <ul className="list-disc pl-6">
                <li>SIP execution</li>
                <li>Reflection & notes to track comfort, challenges, and discipline</li>
              </ul>
            </li>
            <li>These reflections help you understand sustainability over time</li>
            <li>Completion depends on consistent execution + tracking, not just investing once</li>
          </ul>
        ) : (
          <ul className="list-disc text-base text-slate-700 pl-6 text-left w-full max-w-2xl">
            <li>SIP amount is pre-calculated from your saved retirement plan</li>
            <li>You must execute the SIP within the defined time window</li>
            <li>Each execution confirms progress for this sprint</li>
            <li>Completion is based on confirmed execution, not intent</li>
          </ul>
        )}
      </div>

      {/* 4️⃣ EXECUTION FLOW (AFTER START) */}
      {status === "active" || status === "completed" ? (
        <>
          {/* Execution Summary (Reusable, compact) */}
          <ChallengeSummaryCardRow
            startDate={startDate}
            endDate={endDate}
            sipAmount={challenge.id === "monthly_sip_kickstart" ? plan?.suggestedSIP || "-" : challenge.id === "quarterly_sip_discipline" ? plan?.totalQuarterlySIP || "-" : plan?.totalAnnualSIP || "-"}
            status={status === "completed" ? "Completed" : status === "active" ? "In Progress" : "Current"}
            className="mb-2 mt-1"
          />

          {/* Execution Units (Progressive) */}
          {challenge.id === "monthly_sip_kickstart" && (
            <div className="w-full mt-8">
              {/* Only one execution unit */}
              {(() => {
                const { label, range } = getMonthRange(startDate, 0);
                const unit = units[0] || { form: {}, isOpen: true, isDirty: false, isSaved: false, isCompleted: false };
                const { form = {}, isOpen, isSaved, isCompleted } = unit;
                // Required fields: completed, comfort, challenge
                const canSave = form?.completed && form?.comfort && form?.challenge;
                return (
                  <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-slate-900 text-lg mb-1">{label}</div>
                      <button className="ml-auto text-xs text-emerald-700 underline" onClick={() => toggleUnitOpen(0)}>{isOpen ? "Collapse" : "Expand"}</button>
                    </div>
                    <div className="text-slate-500 text-sm mb-1">{range}</div>
                    <div className="text-slate-600 text-sm mb-2">Status: {isCompleted ? "Completed" : "Current"}</div>
                    {isOpen && (
                      <>
                        {/* Reflection Form */}
                        {!isCompleted ? (
                          <div className="flex flex-col gap-3">
                            <div className="text-slate-700 text-sm">SIP completed?</div>
                            <div className="flex gap-2">
                              {["yes","no"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${form.completed === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(0, { form: { ...form, completed: val } })}>{val === "yes" ? "Yes" : "No"}</button>
                              ))}
                            </div>
                            <div className="text-slate-700 text-sm mt-2">Comfort level</div>
                            <div className="flex gap-2">
                              {["comfortable","slightly_stretched","difficult"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${form.comfort === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(0, { form: { ...form, comfort: val } })}>{val === "comfortable" ? "Comfortable" : val === "slightly_stretched" ? "Slightly stretched" : "Difficult"}</button>
                              ))}
                            </div>
                            <div className="text-slate-700 text-sm mt-2">Challenge faced</div>
                            <div className="flex flex-wrap gap-2">
                              {["forgot_sip","emergency_expense","cash_flow","market_fear","other"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${form.challenge === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(0, { form: { ...form, challenge: val } })}>{val === "forgot_sip" ? "Forgot SIP" : val === "emergency_expense" ? "Emergency expense" : val === "cash_flow" ? "Cash flow issue" : val === "market_fear" ? "Market fear" : "Other"}</button>
                              ))}
                            </div>
                            <textarea className="w-full mt-2 p-2 border rounded text-sm" rows={2} placeholder="Anything you want to remember? (optional)" value={form.notes || ""} onChange={e => updateUnit(0, { form: { ...form, notes: e.target.value } })}></textarea>
                            <button className="mt-3 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-50" disabled={!canSave} onClick={() => saveUnit(0)}>[ Save Progress ]</button>
                            {isSaved && (
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="text-emerald-700 font-semibold">Saved. This period is complete.</div>
                                <button className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(0, { label, range })}>Log this into Journal</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="text-emerald-700 font-semibold">This month is completed and logged.</div>
                            <button className="mt-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(0, { label, range })}>View in Journal</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          {challenge.id === "quarterly_sip_discipline" && (
            <div className="w-full mt-8">
              {plan?.monthlySIPs?.map((amt, idx) => {
                const { label, range } = getMonthRange(startDate, idx);
                const unit = units[idx] || { form: {}, isOpen: idx === 0, isDirty: false, isSaved: false, isCompleted: false };
                const { form = {}, isOpen, isSaved, isCompleted } = unit;
                // Only current month is open, past read-only, future hidden
                const prevCompleted = idx === 0 || (units[idx - 1] && units[idx - 1].isCompleted);
                const isCurrent = !isCompleted && prevCompleted;
                if (!isCompleted && !isCurrent && idx > 0) return null;
                const canSave = form?.completed && form?.comfort && form?.challenge;
                return (
                  <div key={idx} className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-slate-900 text-lg mb-1">{label}</div>
                      <button className="ml-auto text-xs text-emerald-700 underline" onClick={() => toggleUnitOpen(idx)}>{isOpen ? "Collapse" : "Expand"}</button>
                    </div>
                    <div className="text-slate-500 text-sm mb-1">{range}</div>
                    <div className="text-slate-600 text-sm mb-2">Status: {isCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}</div>
                    {isOpen && (
                      <>
                        {!isCompleted ? (
                          <div className="flex flex-col gap-3">
                            <div className="text-slate-700 text-sm">SIP completed?</div>
                            <div className="flex gap-2">
                              {["yes","no"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${form.completed === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(idx, { form: { ...form, completed: val } })}>{val === "yes" ? "Yes" : "No"}</button>
                              ))}
                            </div>
                            <div className="text-slate-700 text-sm mt-2">Comfort level</div>
                            <div className="flex gap-2">
                              {["comfortable","slightly_stretched","difficult"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${form.comfort === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(idx, { form: { ...form, comfort: val } })}>{val === "comfortable" ? "Comfortable" : val === "slightly_stretched" ? "Slightly stretched" : "Difficult"}</button>
                              ))}
                            </div>
                            <div className="text-slate-700 text-sm mt-2">Challenge faced</div>
                            <div className="flex flex-wrap gap-2">
                              {["forgot_sip","emergency_expense","cash_flow","market_fear","other"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${form.challenge === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(idx, { form: { ...form, challenge: val } })}>{val === "forgot_sip" ? "Forgot SIP" : val === "emergency_expense" ? "Emergency expense" : val === "cash_flow" ? "Cash flow issue" : val === "market_fear" ? "Market fear" : "Other"}</button>
                              ))}
                            </div>
                            <textarea className="w-full mt-2 p-2 border rounded text-sm" rows={2} placeholder="Anything you want to remember? (optional)" value={form.notes || ""} onChange={e => updateUnit(idx, { form: { ...form, notes: e.target.value } })}></textarea>
                            <button className="mt-3 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-50" disabled={!canSave} onClick={() => saveUnit(idx)}>[ Save Progress ]</button>
                            {isSaved && (
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="text-emerald-700 font-semibold">Saved. This period is complete.</div>
                                <button className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(idx, { label, range })}>Log this into Journal</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="text-emerald-700 font-semibold">This month is completed and logged.</div>
                            <button className="mt-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(idx, { label, range })}>View in Journal</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {challenge.id === "annual_retirement_consistency" && (
            <div className="w-full mt-8">
              {[0,1,2,3].map(qIdx => {
                const quarterStartMonth = qIdx * 3;
                const quarterCompleted = [0,1,2].every(m => units[quarterStartMonth + m] && units[quarterStartMonth + m].isCompleted);
                const prevQuarterCompleted = qIdx === 0 || [0,1,2].every(m => units[quarterStartMonth - 3 + m] && units[quarterStartMonth - 3 + m].isCompleted);
                const isCurrentQuarter = !quarterCompleted && prevQuarterCompleted;
                if (!quarterCompleted && !isCurrentQuarter && qIdx > 0) return null;
                const { label: qLabel, range: qRange } = getQuarterRange(startDate, qIdx);
                return (
                  <div key={qIdx} className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-semibold text-slate-900 text-lg">{qLabel}</div>
                      <div className="text-slate-500 text-sm">{qRange}</div>
                      <div className="text-slate-600 text-sm">Quarter SIP Commitment: ₹{plan?.quarterlySIPs ? plan.quarterlySIPs[qIdx] : "-"}</div>
                      <div className="text-slate-500 text-sm">Status: {quarterCompleted ? "Completed" : isCurrentQuarter ? "In Progress" : "Pending"}</div>
                    </div>
                    {(isCurrentQuarter || quarterCompleted) && (
                      <div className="flex flex-col gap-2 ml-4">
                        {[0,1,2].map(mIdx => {
                          const monthIdx = quarterStartMonth + mIdx;
                          const { label, range } = getMonthRange(startDate, monthIdx);
                          const unit = units[monthIdx] || { form: {}, isOpen: mIdx === 0, isDirty: false, isSaved: false, isCompleted: false };
                          const { form = {}, isOpen, isSaved, isCompleted } = unit;
                          const prevCompleted = mIdx === 0 || (units[quarterStartMonth + mIdx - 1] && units[quarterStartMonth + mIdx - 1].isCompleted);
                          const isCurrent = !isCompleted && prevCompleted;
                          if (!isCompleted && !isCurrent && mIdx > 0) return null;
                          const canSave = form?.completed && form?.comfort && form?.challenge;
                          return (
                            <div key={mIdx} className="border border-slate-100 rounded-lg p-4 bg-slate-50 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="font-semibold text-slate-900 text-base mb-1">{label}</div>
                                <button className="ml-auto text-xs text-emerald-700 underline" onClick={() => toggleUnitOpen(monthIdx)}>{isOpen ? "Collapse" : "Expand"}</button>
                              </div>
                              <div className="text-slate-500 text-xs mb-1">{range}</div>
                              <div className="text-slate-600 text-xs mb-2">Status: {isCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}</div>
                              {isOpen && (
                                <>
                                  {!isCompleted ? (
                                    <div className="flex flex-col gap-3">
                                      <div className="text-slate-700 text-xs">SIP completed?</div>
                                      <div className="flex gap-2">
                                        {["yes","no"].map(val => (
                                          <button key={val} className={`px-3 py-1 rounded-full border text-xs ${form.completed === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(monthIdx, { form: { ...form, completed: val } })}>{val === "yes" ? "Yes" : "No"}</button>
                                        ))}
                                      </div>
                                      <div className="text-slate-700 text-xs mt-2">Comfort level</div>
                                      <div className="flex gap-2">
                                        {["comfortable","slightly_stretched","difficult"].map(val => (
                                          <button key={val} className={`px-3 py-1 rounded-full border text-xs ${form.comfort === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(monthIdx, { form: { ...form, comfort: val } })}>{val === "comfortable" ? "Comfortable" : val === "slightly_stretched" ? "Slightly stretched" : "Difficult"}</button>
                                        ))}
                                      </div>
                                      <div className="text-slate-700 text-xs mt-2">Challenge faced</div>
                                      <div className="flex flex-wrap gap-2">
                                        {["forgot_sip","emergency_expense","cash_flow","market_fear","other"].map(val => (
                                          <button key={val} className={`px-3 py-1 rounded-full border text-xs ${form.challenge === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(monthIdx, { form: { ...form, challenge: val } })}>{val === "forgot_sip" ? "Forgot SIP" : val === "emergency_expense" ? "Emergency expense" : val === "cash_flow" ? "Cash flow issue" : val === "market_fear" ? "Market fear" : "Other"}</button>
                                        ))}
                                      </div>
                                      <textarea className="w-full mt-2 p-2 border rounded text-xs" rows={2} placeholder="Anything you want to remember? (optional)" value={form.notes || ""} onChange={e => updateUnit(monthIdx, { form: { ...form, notes: e.target.value } })}></textarea>
                                      <button className="mt-3 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-50" disabled={!canSave} onClick={() => saveUnit(monthIdx)}>[ Save Progress ]</button>
                                      {isSaved && (
                                        <div className="flex flex-col gap-2 mt-2">
                                          <div className="text-emerald-700 font-semibold">Saved. This period is complete.</div>
                                          <button className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(monthIdx, { label, range, quarter: qLabel })}>Log this into Journal</button>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-2">
                                      <div className="text-emerald-700 font-semibold">This month is completed and logged.</div>
                                      <button className="mt-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(monthIdx, { label, range, quarter: qLabel })}>View in Journal</button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : null}

      {/* 5️⃣ EXECUTION TIMELINE (ANNUAL, ONLY AFTER START) */}
      {challenge.id === "annual_retirement_consistency" && status !== "not_started" && (
        <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-6 items-start">
          <div className="text-lg font-bold text-slate-900 mb-2">Execution Timeline</div>
          <div className="flex flex-col gap-4 w-full">
            {[...Array(12)].map((_, monthIdx) => {
              const { label, range } = getMonthRange(startDate, monthIdx);
              const reflection = reflections[monthIdx] || {};
              const isCurrent = phaseStatus[monthIdx] === "active" || (phaseStatus[monthIdx] !== "completed" && !phaseStatus.slice(0, monthIdx).includes("active"));
              const isCompleted = phaseStatus[monthIdx] === "completed";
              const isFuture = phaseStatus.slice(0, monthIdx).some(s => s !== "completed");
              return (
                <div key={monthIdx} className={`flex flex-col gap-2 border border-slate-100 rounded-lg p-4 bg-slate-50 ${isCurrent ? "ring-2 ring-emerald-200" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{label}</span>
                    <span className="text-xs text-slate-500">{range}</span>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-base font-bold transition ${isCompleted ? "bg-emerald-600 text-white border-emerald-600" : isCurrent ? "bg-white text-emerald-700 border-emerald-400" : "bg-slate-100 text-slate-400 border-slate-200"}`}>{isCompleted ? "✓" : monthIdx + 1}</span>
                      <span className="text-slate-700 text-sm">Status: {isCompleted ? "Completed" : isCurrent ? "Current" : "Pending"}</span>
                    </div>
                    {/* Reflection prompts, only for current or completed months */}
                    {(isCurrent || isCompleted) && (
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="text-slate-700 text-sm">Have you completed this month’s SIP commitment?</div>
                        <div className="flex gap-2">
                          {["yes","no"].map(val => (
                            <button key={val} className={`px-3 py-1 rounded border text-sm ${reflection.completed === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => saveReflection(monthIdx, { ...reflection, completed: val })}>{val === "yes" ? "Yes" : "No"}</button>
                          ))}
                        </div>
                        <div className="text-slate-700 text-sm mt-2">Were you financially comfortable with this commitment?</div>
                        <div className="flex gap-2">
                          {["comfortable","slightly_stretched","difficult"].map(val => (
                            <button key={val} className={`px-3 py-1 rounded border text-sm ${reflection.comfort === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => saveReflection(monthIdx, { ...reflection, comfort: val })}>{val === "comfortable" ? "Comfortable" : val === "slightly_stretched" ? "Slightly stretched" : "Difficult"}</button>
                          ))}
                        </div>
                        <div className="text-slate-700 text-sm mt-2">Did you face any challenge?</div>
                        <div className="flex flex-wrap gap-2">
                          {["forgot_sip","emergency_expense","cash_flow","market_fear","other"].map(val => (
                            <button key={val} className={`px-3 py-1 rounded border text-sm ${reflection.challenge === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => saveReflection(monthIdx, { ...reflection, challenge: val })}>
                              {val === "forgot_sip" ? "Forgot SIP" : val === "emergency_expense" ? "Emergency expense" : val === "cash_flow" ? "Cash flow issue" : val === "market_fear" ? "Market fear" : "Other"}
                            </button>
                          ))}
                        </div>
                        <textarea className="w-full mt-2 p-2 border rounded text-sm" rows={2} placeholder="Anything you want to remember about this month? (optional)" value={reflection.notes || ""} onChange={e => saveReflection(monthIdx, { ...reflection, notes: e.target.value })}></textarea>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
