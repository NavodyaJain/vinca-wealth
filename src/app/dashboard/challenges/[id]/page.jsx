"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getChallengeById, getChallenges } from '@/lib/challenges/challengesData';
import { getActiveChallenge, startChallenge, getChallengeProgress, stopChallenge } from '@/lib/challenges/challengesStorage';
import ChallengeDayCard from '@/components/shared/ChallengeDayCard';
import ChallengeProgressBar from '@/components/shared/ChallengeProgressBar';

export default function ChallengeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [challenge, setChallenge] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setChallenge(getChallengeById(id));
    const ac = getActiveChallenge();
    setActiveChallenge(ac);
    if (ac && ac.challengeId === id) {
      setProgress(getChallengeProgress(id));
    }
  }, [id]);

  if (!challenge) return <div className="p-8 text-center text-slate-500">Challenge not found.</div>;

  const isActive = activeChallenge && activeChallenge.challengeId === id;
  const duration = challenge.durationDays;
  const completedDays = progress?.completedDays || [];
  const currentDay = progress?.currentDay || 1;

  function handleStart() {
    startChallenge(challenge.id, challenge.durationDays);
    router.replace(`/dashboard/challenges/${challenge.id}/day/1`);
  }

  function handleStop() {
    stopChallenge();
    router.replace('/dashboard/challenges');
  }

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{challenge.title}</h1>
        <p className="text-slate-600 mb-2">{challenge.goal}</p>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-medium rounded px-2 py-0.5">{challenge.reward}</span>
          <span className="text-xs text-slate-500">Duration: {challenge.durationDays} days</span>
          <span className="text-xs text-slate-500">{challenge.timePerDay}</span>
        </div>
        {isActive && (
          <div className="mb-4">
            <ChallengeProgressBar value={completedDays.length} max={duration} />
            <div className="text-xs text-slate-500 mt-1">Day {currentDay} of {duration}</div>
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                onClick={() => router.push(`/dashboard/challenges/${challenge.id}/day/${currentDay}`)}
              >
                {completedDays.length === duration ? 'Review Progress' : 'Continue Today'}
              </button>
              <button
                className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
                onClick={handleStop}
              >
                Stop Challenge
              </button>
            </div>
          </div>
        )}
        {!isActive && (
          <button
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            onClick={handleStart}
          >
            Start this Challenge
          </button>
        )}
      </div>
      <div className="px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Challenge Days</h2>
        <div className="flex flex-col gap-1">
          {challenge.dailyTasks.map((_, i) => {
            const dayNum = i + 1;
            let status = 'locked';
            if (completedDays.includes(dayNum)) status = 'completed';
            else if (isActive && dayNum === currentDay) status = 'today';
            else if (isActive && dayNum < currentDay) status = 'completed';
            return (
              <ChallengeDayCard
                key={dayNum}
                dayNumber={dayNum}
                status={status}
                onStart={() => router.push(`/dashboard/challenges/${challenge.id}/day/${dayNum}`)}
                onReview={() => router.push(`/dashboard/challenges/${challenge.id}/day/${dayNum}`)}
                lockedReason={dayNum > 1 && !completedDays.includes(dayNum - 1) ? `Locked until Day ${dayNum - 1} is complete` : ''}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
