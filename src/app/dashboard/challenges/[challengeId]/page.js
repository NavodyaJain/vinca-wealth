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
  // --- Annual challenge: monthly reflections state ---
  const [reflections, setReflections] = useState(() => Array(12).fill({}));
  function saveReflection(monthIdx, patch) {
    setReflections(prev => {
      const next = [...prev];
      next[monthIdx] = { ...next[monthIdx], ...patch };
      return next;
    });
  }
    // Start Challenge logic
    function handleStart() {
      // Enforce only one active sprint at a time
      const state = getChallengeState();
      if (state.activeChallengeId && state.activeChallengeId !== challenge.id) {
        alert("You already have an active sprint in progress. Complete it before switching your sprint mindset.");
        return;
      }
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
              {(() => {
                if (!plan?.monthlySIPs) return null;
                // --- Progressive gating: only current and completed months, sorted DESC ---
                const monthObjs = plan.monthlySIPs.map((amt, idx) => {
                  const { label, range, start } = getMonthRange(startDate, idx);
                  const unit = units[idx] || { form: {}, isOpen: idx === 0, isDirty: false, isSaved: false, isCompleted: false };
                  const { form = {}, isOpen, isSaved, isCompleted } = unit;
                  const prevCompleted = idx === 0 || (units[idx - 1] && units[idx - 1].isCompleted);
                  const isCurrent = !isCompleted && prevCompleted;
                  const isCompletedUnit = isCompleted;
                  return { idx, label, range, start, form, isOpen, isSaved, isCompleted, isCurrent, isCompletedUnit, canSave: form?.completed && form?.comfort && form?.challenge };
                });
                // Sort descending by idx (monthIndex)
                const sorted = [...monthObjs].sort((a, b) => b.idx - a.idx);
                const current = sorted.find(m => m.isCurrent);
                const completed = sorted.filter(m => m.isCompletedUnit);
                return [
                  current && (
                    <div key={current.idx} className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-slate-900 text-lg mb-1">{current.label}</div>
                        <button className="ml-auto text-xs text-emerald-700 underline" onClick={() => toggleUnitOpen(current.idx)}>{current.isOpen ? "Collapse" : "Expand"}</button>
                      </div>
                      <div className="text-slate-500 text-sm mb-1">{current.range}</div>
                      <div className="text-slate-600 text-sm mb-2">Status: Current</div>
                      {current.isOpen && (
                        <>
                          <div className="flex flex-col gap-3">
                            <div className="text-slate-700 text-sm">SIP completed?</div>
                            <div className="flex gap-2">
                              {["yes","no"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${current.form.completed === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(current.idx, { form: { ...current.form, completed: val } })}>{val === "yes" ? "Yes" : "No"}</button>
                              ))}
                            </div>
                            <div className="text-slate-700 text-sm mt-2">Comfort level</div>
                            <div className="flex gap-2">
                              {["comfortable","slightly_stretched","difficult"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${current.form.comfort === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(current.idx, { form: { ...current.form, comfort: val } })}>{val === "comfortable" ? "Comfortable" : val === "slightly_stretched" ? "Slightly stretched" : "Difficult"}</button>
                              ))}
                            </div>
                            <div className="text-slate-700 text-sm mt-2">Challenge faced</div>
                            <div className="flex flex-wrap gap-2">
                              {["forgot_sip","emergency_expense","cash_flow","market_fear","other"].map(val => (
                                <button key={val} className={`px-3 py-1 rounded-full border text-sm ${current.form.challenge === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(current.idx, { form: { ...current.form, challenge: val } })}>{val === "forgot_sip" ? "Forgot SIP" : val === "emergency_expense" ? "Emergency expense" : val === "cash_flow" ? "Cash flow issue" : val === "market_fear" ? "Market fear" : "Other"}</button>
                              ))}
                            </div>
                            <textarea className="w-full mt-2 p-2 border rounded text-sm" rows={2} placeholder="Anything you want to remember? (optional)" value={current.form.notes || ""} onChange={e => updateUnit(current.idx, { form: { ...current.form, notes: e.target.value } })}></textarea>
                            <button className="mt-3 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-50" disabled={!current.canSave} onClick={() => saveUnit(current.idx)}>[ Save Progress ]</button>
                            {current.isSaved && (
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="text-emerald-700 font-semibold">Saved. This period is complete.</div>
                                <button className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(current.idx, { label: current.label, range: current.range })}>Log this into Journal</button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ),
                  ...completed.map(({ idx, label, range, form, isOpen, isSaved, isCompleted }) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-2 mb-4 opacity-80">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-slate-900 text-lg mb-1">{label}</div>
                        <span className="ml-auto text-xs text-slate-400">Completed</span>
                      </div>
                      <div className="text-slate-500 text-sm mb-1">{range}</div>
                      <div className="text-slate-600 text-sm mb-2">Status: Completed</div>
                      {/* Collapsed by default, can expand if needed */}
                      {false && isOpen && (
                        <div className="flex flex-col gap-3"> ... </div>
                      )}
                    </div>
                  ))
                ];
              })()}
            </div>
          )}
          {challenge.id === "annual_retirement_consistency" && (
            <div className="w-full mt-8">
              {(() => {
                // --- Progressive gating: only current and completed quarters ---
                // --- Progressive gating: only current and completed quarters, sorted DESC ---
                const quarterObjs = [0,1,2,3].map(qIdx => {
                  const quarterStartMonth = qIdx * 3;
                  const { start } = getQuarterRange(startDate, qIdx);
                  const quarterCompleted = [0,1,2].every(m => units[quarterStartMonth + m] && units[quarterStartMonth + m].isCompleted);
                  const prevQuarterCompleted = qIdx === 0 || [0,1,2].every(m => units[quarterStartMonth - 3 + m] && units[quarterStartMonth - 3 + m].isCompleted);
                  const isCurrentQuarter = !quarterCompleted && prevQuarterCompleted;
                  return { qIdx, quarterStartMonth, start, quarterCompleted, isCurrentQuarter };
                });
                // Sort descending by qIdx (quarterIndex)
                const sortedQuarters = [...quarterObjs].sort((a, b) => b.qIdx - a.qIdx);
                const currentQuarter = sortedQuarters.find(q => q.isCurrentQuarter);
                const completedQuarters = sortedQuarters.filter(q => q.quarterCompleted);
                return [
                  currentQuarter && (() => {
                    // Only show current and completed months in this quarter, sorted DESC
                    const { qIdx, quarterStartMonth } = currentQuarter;
                    const { label: qLabel, range: qRange } = getQuarterRange(startDate, qIdx);
                    const monthObjs = [0,1,2].map(mIdx => {
                      const monthIdx = quarterStartMonth + mIdx;
                      const { label, range, start } = getMonthRange(startDate, monthIdx);
                      const unit = units[monthIdx] || { form: {}, isOpen: mIdx === 0, isDirty: false, isSaved: false, isCompleted: false };
                      const { form = {}, isOpen, isSaved, isCompleted } = unit;
                      const prevCompleted = mIdx === 0 || (units[quarterStartMonth + mIdx - 1] && units[quarterStartMonth + mIdx - 1].isCompleted);
                      const isCurrent = !isCompleted && prevCompleted;
                      const isCompletedUnit = isCompleted;
                      return { mIdx, monthIdx, label, range, start, form, isOpen, isSaved, isCompleted, isCurrent, isCompletedUnit, canSave: form?.completed && form?.comfort && form?.challenge };
                    });
                    const sortedMonths = [...monthObjs].sort((a, b) => b.mIdx - a.mIdx);
                    const currentMonth = sortedMonths.find(m => m.isCurrent);
                    const completedMonths = sortedMonths.filter(m => m.isCompletedUnit);
                    return (
                      <div key={qIdx} className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="font-semibold text-slate-900 text-lg">{qLabel}</div>
                        </div>
                        {currentMonth && (
                          <div key={currentMonth.mIdx} className="border border-slate-100 rounded-lg p-4 bg-slate-50 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-slate-900 text-base mb-1">{currentMonth.label}</div>
                              <button className="ml-auto text-xs text-emerald-700 underline" onClick={() => toggleUnitOpen(currentMonth.monthIdx)}>{currentMonth.isOpen ? "Collapse" : "Expand"}</button>
                            </div>
                            <div className="text-slate-500 text-xs mb-1">{currentMonth.range}</div>
                            <div className="text-slate-600 text-xs mb-2">Status: Current</div>
                            {currentMonth.isOpen && (
                              <>
                                <div className="flex flex-col gap-3">
                                  <div className="text-slate-700 text-xs">SIP completed?</div>
                                  <div className="flex gap-2">
                                    {["yes","no"].map(val => (
                                      <button key={val} className={`px-3 py-1 rounded-full border text-xs ${currentMonth.form.completed === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(currentMonth.monthIdx, { form: { ...currentMonth.form, completed: val } })}>{val === "yes" ? "Yes" : "No"}</button>
                                    ))}
                                  </div>
                                  <div className="text-slate-700 text-xs mt-2">Comfort level</div>
                                  <div className="flex gap-2">
                                    {["comfortable","slightly_stretched","difficult"].map(val => (
                                      <button key={val} className={`px-3 py-1 rounded-full border text-xs ${currentMonth.form.comfort === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(currentMonth.monthIdx, { form: { ...currentMonth.form, comfort: val } })}>{val === "comfortable" ? "Comfortable" : val === "slightly_stretched" ? "Slightly stretched" : "Difficult"}</button>
                                    ))}
                                  </div>
                                  <div className="text-slate-700 text-xs mt-2">Challenge faced</div>
                                  <div className="flex flex-wrap gap-2">
                                    {["forgot_sip","emergency_expense","cash_flow","market_fear","other"].map(val => (
                                      <button key={val} className={`px-3 py-1 rounded-full border text-xs ${currentMonth.form.challenge === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`} onClick={() => updateUnit(currentMonth.monthIdx, { form: { ...currentMonth.form, challenge: val } })}>{val === "forgot_sip" ? "Forgot SIP" : val === "emergency_expense" ? "Emergency expense" : val === "cash_flow" ? "Cash flow issue" : val === "market_fear" ? "Market fear" : "Other"}</button>
                                    ))}
                                  </div>
                                  <textarea className="w-full mt-2 p-2 border rounded text-xs" rows={2} placeholder="Anything you want to remember? (optional)" value={currentMonth.form.notes || ""} onChange={e => updateUnit(currentMonth.monthIdx, { form: { ...currentMonth.form, notes: e.target.value } })}></textarea>
                                  <button className="mt-3 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-50" disabled={!currentMonth.canSave} onClick={() => saveUnit(currentMonth.monthIdx)}>[ Save Progress ]</button>
                                  {currentMonth.isSaved && (
                                    <div className="flex flex-col gap-2 mt-2">
                                      <div className="text-emerald-700 font-semibold">Saved. This period is complete.</div>
                                      <button className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={() => logToJournal(currentMonth.monthIdx, { label: currentMonth.label, range: currentMonth.range, quarter: qLabel })}>Log this into Journal</button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        {completedMonths.map(({ mIdx, label, range }) => (
                          <div key={mIdx} className="border border-slate-100 rounded-lg p-4 bg-slate-50 mb-2 opacity-80">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-slate-900 text-base mb-1">{label}</div>
                              <span className="ml-auto text-xs text-slate-400">Completed</span>
                            </div>
                            <div className="text-slate-500 text-xs mb-1">{range}</div>
                            <div className="text-slate-600 text-xs mb-2">Status: Completed</div>
                          </div>
                        ))}
                      </div>
                    );
                  })(),
                  ...completedQuarters.map(({ qIdx }) => {
                    const { label: qLabel, range: qRange } = getQuarterRange(startDate, qIdx);
                    return (
                      <div key={qIdx} className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-2 mb-4 opacity-80">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="font-semibold text-slate-900 text-lg">{qLabel}</div>
                          <div className="text-slate-500 text-sm">{qRange}</div>
                          <span className="ml-auto text-xs text-slate-400">Completed</span>
                        </div>
                        <div className="text-slate-600 text-sm">Status: Completed</div>
                      </div>
                    );
                  })
                ];
              })()}
            </div>
          )}
        </>
      ) : null}

      {/* 6️⃣ START CHALLENGE LOGIC */}
      {status === "not_started" && (
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl px-6 py-4 text-xl transition" onClick={handleStart}>
          Start Challenge
        </button>
      )}

      {/* 7️⃣ CHALLENGE COMPLETION STATE */}
      {/* Completion UI: Monthly always, Quarterly only if 3/3, Annual only if 4/4 */}
      {(status === "completed" && (
        (challenge.id === "monthly_sip_kickstart") ||
        (challenge.id === "quarterly_sip_discipline" && plan?.monthlySIPs && plan.monthlySIPs.filter((_, idx) => units[idx]?.isCompleted).length === 3) ||
        (challenge.id === "annual_retirement_consistency" && plan?.quarterlySIPs && plan.quarterlySIPs.filter((_, qIdx) => [0,1,2].every(m => units[qIdx * 3 + m]?.isCompleted)).length === 4)
      )) && (
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
            <button
              className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              onClick={() => {
                // Start Next Sprint logic for Quarterly and Annual
                const state = getChallengeState();
                const prev = state.progress?.[challenge.id];
                if (!prev) return;
                let newStartDate = prev.endDate;
                let newEndDate = newStartDate;
                let phaseLen = 1;
                let newPlan = null;
                if (challenge.id === "quarterly_sip_discipline") {
                  newEndDate = new Date(new Date(newStartDate).setMonth(new Date(newStartDate).getMonth() + 3)).toISOString().slice(0, 10);
                  phaseLen = 3;
                  // Generate new plan for new sprint instance
                  if (challenge.getPlan) {
                    newPlan = challenge.getPlan({
                      ...plan,
                      startDate: newStartDate,
                      endDate: newEndDate
                    });
                  }
                } else if (challenge.id === "annual_retirement_consistency") {
                  newEndDate = new Date(new Date(newStartDate).setMonth(new Date(newStartDate).getMonth() + 12)).toISOString().slice(0, 10);
                  phaseLen = 4;
                  if (challenge.getPlan) {
                    newPlan = challenge.getPlan({
                      ...plan,
                      startDate: newStartDate,
                      endDate: newEndDate
                    });
                  }
                } else {
                  // fallback for monthly
                  newEndDate = new Date(new Date(newStartDate).setMonth(new Date(newStartDate).getMonth() + 1)).toISOString().slice(0, 10);
                  phaseLen = 1;
                  if (challenge.getPlan) {
                    newPlan = challenge.getPlan({
                      ...plan,
                      startDate: newStartDate,
                      endDate: newEndDate
                    });
                  }
                }
                // Create new sprint instance
                state.activeChallengeId = challenge.id;
                state.progress = state.progress || {};
                state.progress[challenge.id] = {
                  startedAt: newStartDate,
                  startDate: newStartDate,
                  endDate: newEndDate,
                  status: "active",
                  plan: newPlan,
                  phaseStatus: Array(phaseLen).fill("pending")
                };
                saveChallengeState(state);
                setStatus("active");
                setStartDate(newStartDate);
                setEndDate(newEndDate);
                setPhaseStatus(Array(phaseLen).fill("pending"));
                setShowSuccess(false);
                setUnits({});
                // Set plan for new sprint instance
                setPlan(newPlan);
              }}
            >
              Start Next Sprint
            </button>
            <button className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50" onClick={() => router.push('/dashboard/challenges')}>
              Switch Sprint Mindset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
