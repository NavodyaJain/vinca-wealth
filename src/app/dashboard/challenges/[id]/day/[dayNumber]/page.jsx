"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getChallengeById } from '@/lib/challenges/challengesData';
import {
  getActiveChallenge,
  completeTask,
  uncompleteTask,
  completeDay,
  getChallengeProgress
} from '@/lib/challenges/challengesStorage';
import { getStreak, updateStreakOnDayComplete } from '@/lib/challenges/streakStorage';
import TaskRowCard from '@/components/shared/TaskRowCard';

export default function ChallengeDayRunner() {
  const router = useRouter();
  const params = useParams();
  const { id, dayNumber } = params;
  const dayNum = parseInt(dayNumber, 10);
  const [challenge, setChallenge] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [progress, setProgress] = useState(null);
  const [checked, setChecked] = useState({});
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setChallenge(getChallengeById(id));
    const ac = getActiveChallenge();
    setActiveChallenge(ac);
    if (ac && ac.challengeId === id) {
      setProgress(getChallengeProgress(id));
    }
  }, [id]);

  useEffect(() => {
    if (!challenge || !progress) return;
    const dayTasks = challenge.dailyTasks[dayNum - 1] || [];
    const completedTasks = progress.tasksCompletedByDay?.[dayNum] || [];
    const checkedMap = {};
    dayTasks.forEach((task) => {
      checkedMap[task.id] = completedTasks?.includes(task.id);
    });
    setChecked(checkedMap);
    setCompleted(progress.completedDays?.includes(dayNum));
    setStreak(getStreak().streakCount);
  }, [challenge, progress, dayNum]);

  if (!challenge) return <div className="p-8 text-center text-slate-500">Challenge not found.</div>;
  if (!activeChallenge || activeChallenge.challengeId !== id)
    return (
      <div className="p-8 text-center text-slate-500">
        Challenge not started.<br />
        <button
          className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          onClick={() => router.replace(`/dashboard/challenges/${id}`)}
        >
          Start Challenge
        </button>
      </div>
    );
  if (dayNum > challenge.durationDays)
    return <div className="p-8 text-center text-slate-500">Invalid day.</div>;
  if (dayNum > 1 && !(progress.completedDays || []).includes(dayNum - 1))
    return <div className="p-8 text-center text-slate-500">Locked until you complete Day {dayNum - 1}.</div>;

  const dayTasks = challenge.dailyTasks[dayNum - 1] || [];
  const nonOptionalTaskIds = dayTasks.filter((t) => !t.isOptional).map((t) => t.id);
  const allNonOptionalComplete = nonOptionalTaskIds.every((id) => checked[id]);

  function handleToggle(task) {
    if (checked[task.id]) {
      uncompleteTask(challenge.id, dayNum, task.id);
    } else {
      completeTask(challenge.id, dayNum, task.id);
    }
    // Refresh progress
    setProgress(getChallengeProgress(challenge.id));
  }

  function handleCompleteDay() {
    completeDay(challenge.id, dayNum, nonOptionalTaskIds, challenge.durationDays);
    updateStreakOnDayComplete();
    setShowSuccess(true);
    setStreak(getStreak().streakCount);
    setCompleted(true);
    setProgress(getChallengeProgress(challenge.id));
  }

  function handleNextDay() {
    router.replace(`/dashboard/challenges/${challenge.id}/day/${dayNum + 1}`);
  }

  function handleJournal() {
    // Prefill journal entry in localStorage
    const entry = {
      date: new Date().toISOString(),
      actions: [
        `Completed Day ${dayNum} of ${challenge.title}`
      ],
      verified: true
    };
    try {
      const raw = localStorage.getItem('vinca_journal_drafts') || '[]';
      const arr = JSON.parse(raw);
      arr.push(entry);
      localStorage.setItem('vinca_journal_drafts', JSON.stringify(arr));
    } catch {}
    router.replace('/dashboard/journal/new?fromChallenge=1');
  }

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6 flex items-center gap-4">
        <button
          className="text-emerald-600 hover:underline text-sm"
          onClick={() => router.push(`/dashboard/challenges/${challenge.id}`)}
        >
          ← Back to Challenge Plan
        </button>
        <span className="text-xs text-slate-500">Day {dayNum} of {challenge.durationDays}</span>
        <span className="ml-auto text-xs text-emerald-700">Streak: {streak} 🔥</span>
      </div>
      <div className="px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Tasks for Day {dayNum}</h2>
        {dayTasks.map((task) => (
          <TaskRowCard
            key={task.id}
            task={task}
            checked={checked[task.id]}
            onToggle={() => handleToggle(task)}
            disabled={completed}
          />
        ))}
        {!completed && (
          <button
            className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
            disabled={!allNonOptionalComplete}
            onClick={handleCompleteDay}
          >
            Complete Day
          </button>
        )}
        {showSuccess && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
            <div className="font-semibold mb-2">Day {dayNum} completed ✅</div>
            <div className="mb-2">Streak: {streak} 🔥</div>
            <div className="flex gap-2 flex-wrap">
              {dayNum < challenge.durationDays && (
                <button
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                  onClick={handleNextDay}
                >
                  Go to next day
                </button>
              )}
              <button
                className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
                onClick={handleJournal}
              >
                Log this in Journal
              </button>
              <button
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                onClick={() => router.replace('/dashboard/challenges')}
              >
                Back to Challenges
              </button>
            </div>
          </div>
        )}
        {completed && !showSuccess && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
            <div className="font-semibold mb-2">Day {dayNum} already completed ✅</div>
            <div className="mb-2">Streak: {streak} 🔥</div>
            <div className="flex gap-2 flex-wrap">
              {dayNum < challenge.durationDays && (
                <button
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                  onClick={handleNextDay}
                >
                  Go to next day
                </button>
              )}
              <button
                className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
                onClick={handleJournal}
              >
                Log this in Journal
              </button>
              <button
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                onClick={() => router.replace('/dashboard/challenges')}
              >
                Back to Challenges
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
