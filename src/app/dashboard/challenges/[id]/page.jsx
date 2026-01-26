"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import challengesCatalog from '@/lib/challengesCatalog';
import { getChallengesState, saveChallengesState } from '@/lib/challengesStore';
import { getJournalEntries, createJournalEntry, createChallengeCompletionEntry } from '@/lib/journalStore';

export default function ChallengeDetailPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  // Fallback-safe challenge lookup
  const normalized = (v) => String(v || "").trim().toLowerCase();
  const challenge =
    challengesCatalog.find((c) => normalized(c.id) === normalized(id)) ||
    challengesCatalog.find((c) => normalized(c.slug) === normalized(id));

  // Fallback tasks if missing
  const fallbackTasks = [
    { id: 'review_plan', label: 'Review your saved plan', type: 'manual' },
    { id: 'set_improvement', label: 'Set 1 improvement action', type: 'manual' },
    { id: 'log_journal', label: 'Log this in journal', type: 'manual' }
  ];
  const tasks = (challenge && Array.isArray(challenge.actionChecklist) && challenge.actionChecklist.length > 0)
    ? challenge.actionChecklist
    : fallbackTasks;

  // Persistent state
  const STORAGE_KEY = 'vinca_challenges_progress_v1';
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        setProgress(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
      } catch {
        setProgress({});
      }
    }
    // eslint-disable-next-line
  }, []);
  const challengeProgress = progress[id] || {
    status: 'not_started',
    startedAt: null,
    completedAt: null,
    tasks: {}
  };

  const [localTasks, setLocalTasks] = useState(challengeProgress.tasks);
  const [status, setStatus] = useState(challengeProgress.status);

  // Sync local state with progress only on mount or id change
  useEffect(() => {
    if (!mounted) return;
    setLocalTasks(challengeProgress.tasks);
    setStatus(challengeProgress.status);
    // eslint-disable-next-line
  }, [mounted, String(id)]);

  // Sync progress to localStorage
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    const updated = {
      ...progress,
      [id]: {
        ...challengeProgress,
        status,
        tasks: localTasks
      }
    };
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // eslint-disable-next-line
  }, [localTasks, status, mounted]);

  if (!mounted) {
    return null;
  }
  if (!challenge) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500 font-semibold mb-4">Challenge not found</div>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/challenges')}>Back to Challenges</button>
      </div>
    );
  }

  // Header
  const cadenceLabel = challenge.cadence ? challenge.cadence.charAt(0).toUpperCase() + challenge.cadence.slice(1) : '';

  // What you'll do bullets
  const whatYouDo = challenge.whatYouDo || [challenge.descriptionShort, challenge.descriptionLong].filter(Boolean).slice(0, 3);
  if (whatYouDo.length === 0) whatYouDo.push('Stay consistent with your plan.');

  // Checklist logic
  const allComplete = tasks.every((t) => localTasks[t.id]);

  // Journal integration
  function hasJournalEntryForChallenge() {
    const entries = getJournalEntries();
    return entries.some(e => e.type === 'challenge_completion' && e.meta && String(e.meta.challengeId) === String(challenge.id));
  }

  function handleLogToJournal() {
    if (hasJournalEntryForChallenge()) {
      router.push('/dashboard/journal');
      return;
    }
    const entry = createChallengeCompletionEntry({ challenge, challengeId: challenge.id });
    createJournalEntry(entry);
    router.push('/dashboard/journal');
  }

  function handleTaskToggle(taskId) {
    setLocalTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  }
  function handleStart() {
    setStatus('active');
    setLocalTasks({});
  }
  function handleComplete() {
    setStatus('completed');
  }
  function handleRestart() {
    setStatus('not_started');
    setLocalTasks({});
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{challenge.title}</h1>
        <div className="flex gap-2 mb-2">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold rounded px-2 py-0.5">{cadenceLabel}</span>
          <span className="bg-slate-100 text-slate-700 text-xs rounded px-2 py-0.5">{challenge.effortLabel}</span>
        </div>
        <div className="text-slate-700 text-base mb-2">{challenge.descriptionShort}</div>
      </div>
      {/* What you'll do */}
      <div className="mb-6">
        <div className="font-semibold text-slate-900 mb-1">What you'll do</div>
        <ul className="list-disc pl-6 text-slate-700">
          {whatYouDo.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
      {/* Checklist */}
      <div className="mb-6">
        <div className="font-semibold text-slate-900 mb-2">Tasks Checklist</div>
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!localTasks[task.id]}
                disabled={status !== 'active'}
                onChange={() => handleTaskToggle(task.id)}
                className="w-5 h-5 accent-emerald-600"
              />
              <span className="text-slate-800 font-medium">{task.label}</span>
              <span className={`text-xs rounded px-2 py-0.5 ${task.type === 'manual' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>{task.type === 'manual' ? 'Manual' : 'Tool-linked'}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Completion Flow */}
      <div className="mb-8 flex gap-3">
        {status === 'not_started' && (
          <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-4 py-3 text-lg transition" onClick={handleStart}>
            Start Challenge
          </button>
        )}
        {status === 'active' && (
          <>
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-4 py-3 text-lg transition" onClick={handleComplete} disabled={!allComplete}>
              Mark Completed
            </button>
          </>
        )}
        {status === 'completed' && (
          <>
            <span className="flex-1 bg-emerald-100 text-emerald-700 font-semibold rounded-lg px-4 py-3 text-lg flex items-center justify-center">Completed ✅</span>
            <button
              className="flex-1 border border-emerald-600 text-emerald-700 font-semibold rounded-lg px-4 py-3 text-lg hover:bg-emerald-50 transition"
              onClick={handleRestart}
            >
              Restart Challenge
            </button>
            <button
              className={`flex-1 border border-emerald-600 text-emerald-700 font-semibold rounded-lg px-4 py-3 text-lg hover:bg-emerald-50 transition ${hasJournalEntryForChallenge() ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={handleLogToJournal}
              disabled={hasJournalEntryForChallenge()}
            >
              {hasJournalEntryForChallenge() ? 'Already Logged in Journal' : 'Log into Journal'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
