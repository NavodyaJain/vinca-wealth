// This file has been removed to prevent routing conflicts and ensure the new UI is deployed.

export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getChallenges, getChallengeById } from '@/lib/challenges/challengesData';
import { getActiveChallenge, startChallenge, stopChallenge, getChallengeProgress } from '@/lib/challenges/challengesStorage';
import roleModelTemplates from '@/lib/templates/roleModelTemplates';
import ChallengeCard from '@/components/shared/ChallengeCard';
import ChallengeProgressBar from '@/components/shared/ChallengeProgressBar';

export default function ChallengesPage() {
  const router = useRouter();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [progress, setProgress] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [roleModel, setRoleModel] = useState(null);
  const [allChallenges, setAllChallenges] = useState([]);

  useEffect(() => {
    setAllChallenges(getChallenges());
    const ac = getActiveChallenge();
    setActiveChallenge(ac);
    if (ac) setProgress(getChallengeProgress(ac.challengeId));
    // Get template from query param or localStorage
    let tid = null;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      tid = urlParams.get('template') || localStorage.getItem('vinca_selected_role_model_template');
    }
    setTemplateId(tid);
    if (tid) {
      const rm = roleModelTemplates.find(t => t.id === tid);
      setRoleModel(rm);
    }
  }, []);

  function handleStart(challenge) {
    if (activeChallenge) return;
    startChallenge(challenge.id, challenge.durationDays);
    router.replace(`/dashboard/challenges/${challenge.id}/day/1`);
  }

  function handleStop() {
    stopChallenge();
    setActiveChallenge(null);
    setProgress(null);
  }

  // Recommended challenge logic
  let recommended = null;
  if (roleModel) {
    recommended = allChallenges.find(c => c.id === roleModel.recommendedChallengePackId);
  }

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Challenges</h1>
        <p className="text-slate-600 mb-4">Complete small steps daily to build a retirement-ready plan.</p>
        {roleModel && (
          <div className="bg-linear-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-emerald-700 mb-1">Following {roleModel.name}'s journey</div>
              <div className="text-lg font-bold text-slate-900 mb-1">Recommended path: {recommended?.title || 'Challenge'}</div>
              <div className="text-xs text-slate-500 mb-2">{roleModel.heroLine}</div>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              onClick={() => window.location.href = `/dashboard/templates/${roleModel.id}`}
            >View role model journey</button>
          </div>
        )}
      </div>
      {/* Active Challenge Section */}
      {activeChallenge && progress && (
        <div className="px-4 sm:px-8 mb-8">
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg text-slate-900">Active Challenge:</span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-medium rounded px-2 py-0.5">{getChallengeById(activeChallenge.challengeId)?.reward}</span>
              </div>
              <div className="text-xl font-bold text-emerald-700 mb-1">{getChallengeById(activeChallenge.challengeId)?.title}</div>
              <div className="text-xs text-slate-500 mb-2">Started: {activeChallenge.startedAtISO ? new Date(activeChallenge.startedAtISO).toLocaleDateString() : 'Today'}</div>
              <ChallengeProgressBar value={progress.completedDays.length} max={getChallengeById(activeChallenge.challengeId)?.durationDays || 1} />
              <div className="text-xs text-slate-500 mt-1">Day {progress.currentDay} of {getChallengeById(activeChallenge.challengeId)?.durationDays}</div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                onClick={() => router.push(`/dashboard/challenges/${activeChallenge.challengeId}/day/${progress.currentDay}`)}
              >
                Continue Today
              </button>
              <button
                className="w-full sm:w-auto px-5 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
                onClick={() => router.push(`/dashboard/challenges/${activeChallenge.challengeId}`)}
              >
                View Plan
              </button>
              <button
                className="w-full sm:w-auto px-5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 text-xs"
                onClick={handleStop}
              >
                Stop Challenge
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Recommended Challenge Section */}
      {recommended && !activeChallenge && (
        <div className="px-4 sm:px-8 mb-8">
          <ChallengeCard
            challenge={recommended}
            activeChallengeId={activeChallenge?.challengeId}
            onStart={handleStart}
            disableStart={!!activeChallenge}
            highlight={true}
          />
        </div>
      )}
      {/* All Challenges Section */}
      <div className="px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">All Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              activeChallengeId={activeChallenge?.challengeId}
              onStart={handleStart}
              disableStart={!!activeChallenge}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
