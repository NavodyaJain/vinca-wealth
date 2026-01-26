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
  const router = useRouter();
  const params = useParams();
  const { challengeId } = params;
  const [challenge, setChallenge] = useState(null);
  const [challengeState, setChallengeState] = useState({});
  const [progress, setProgress] = useState({ completedCount: 0, totalCount: 0, percent: 0 });
  const [localTasks, setLocalTasks] = useState({});
  const [status, setStatus] = useState("not_started");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const c = getChallengeById(challengeId);
    setChallenge(c);
    const state = getChallengeState();
    setChallengeState(state);
    const prog = getChallengeProgress(challengeId, c);
    setProgress(prog);
    const taskState = state.progress?.[challengeId]?.tasks || {};
    setLocalTasks(taskState);
    setStatus(state.progress?.[challengeId]?.status || "not_started");
    if (state.progress?.[challengeId]?.status === "completed") setShowSuccess(true);
  }, [challengeId]);

  if (!challenge) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500 font-semibold mb-4">Challenge not found</div>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/challenges')}>Back to Challenges</button>
      </div>
    );
  }

  function handleStart() {
    startChallenge(challenge.id);
    setStatus("active");
    setShowSuccess(false);
    router.refresh();
  }

  function handleToggleTask(taskId) {
    const newVal = !localTasks[taskId];
    toggleTask(challenge.id, taskId, newVal);
    setLocalTasks({ ...localTasks, [taskId]: newVal });
    const prog = getChallengeProgress(challenge.id, challenge);
    setProgress(prog);
    if (prog.completedCount === prog.totalCount) {
      completeChallenge(challenge.id);
      setStatus("completed");
      setShowSuccess(true);
    }
  }

  function handleLogToJournal() {
    if (!hasChallengeCompletionEntry(challenge.id)) {
      const entry = createChallengeCompletionEntry({ challenge });
      addJournalEntry(entry);
    }
    router.push("/dashboard/journal");
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{challenge.title}</h1>
        <div className="flex gap-2 mb-2">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold rounded px-2 py-0.5">{challenge.cadence.charAt(0).toUpperCase() + challenge.cadence.slice(1)}</span>
          <span className="bg-slate-100 text-slate-700 text-xs rounded px-2 py-0.5">{challenge.durationLabel}</span>
        </div>
        <div className="text-slate-700 text-base mb-2">{challenge.description}</div>
        <div className="text-slate-500 text-sm mb-2">Best for: {challenge.bestFor}</div>
        <div className="text-slate-400 text-xs mb-2">{challenge.whyThisMatters}</div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${progress.percent}%` }}></div>
        </div>
        <div className="text-xs text-slate-600 mb-2">{progress.completedCount}/{progress.totalCount} tasks completed</div>
      </div>
      {showSuccess && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-semibold flex flex-col gap-2">
          <div>Challenge completed ✅</div>
          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700" onClick={handleLogToJournal}>
            Log into Journal
          </button>
          <button className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50" onClick={() => router.push('/dashboard/challenges')}>
            Back to Challenges
          </button>
        </div>
      )}
      <div className="mb-6">
        <div className="font-semibold text-slate-900 mb-2">Tasks</div>
        <ul className="flex flex-col gap-2">
          {challenge.tasks.map(task => (
            <li key={task.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm px-3 py-2">
              <input
                type="checkbox"
                checked={!!localTasks[task.id]}
                disabled={status !== "active" && status !== "not_started"}
                onChange={() => handleToggleTask(task.id)}
                className="w-5 h-5 accent-emerald-600"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-800">{task.title}</div>
                <div className="text-xs text-slate-500">{task.description}</div>
              </div>
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold ${localTasks[task.id] ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                onClick={() => handleToggleTask(task.id)}
                disabled={status !== "active" && status !== "not_started"}
              >
                {localTasks[task.id] ? "Done ✅" : task.ctaLabel}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {status === "not_started" && (
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-4 py-3 text-lg transition" onClick={handleStart}>
          Start Challenge
        </button>
      )}
    </div>
  );
}
