"use client";
import { useState, useEffect } from 'react';
import challengesCatalog from '@/lib/challengesCatalog';
import {
  getChallengesState,
  joinChallenge,
  getChallengeProgress
} from '@/lib/challengesStore';
import CadenceTabs from '@/components/challenges/CadenceTabs';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import ChallengeKPIStrip from '@/components/challenges/ChallengeKPIStrip';
import RecommendedChallenges from '@/components/challenges/RecommendedChallenges';

export default function ChallengesPage() {
  const [activeCadence, setActiveCadence] = useState('weekly');
  const [challengesState, setChallengesState] = useState({});
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    setChallengesState(getChallengesState());
    // TODO: Integrate with saved readings for recommendations
    setRecommended([]); // Placeholder: no recommendations if no readings
  }, []);

  // Calculate streaks for KPI strip
  const streaks = {
    weekly: 0,
    monthly: 0,
    quarterly: 0,
    yearly: 0
  };
  Object.entries(challengesState).forEach(([cid, state]) => {
    const challenge = challengesCatalog.find(c => c.id === cid);
    if (challenge && state.cyclesCompletedCount) {
      streaks[challenge.cadence] = Math.max(streaks[challenge.cadence], state.cyclesCompletedCount);
    }
  });

  // Filter challenges by cadence
  const filteredChallenges = challengesCatalog.filter(c => c.cadence === activeCadence);

  function handleViewDetails(challenge) {
    window.location.href = `/dashboard/challenges/${challenge.id}`;
  }

  function handleContinue(challenge) {
    window.location.href = `/dashboard/challenges/${challenge.id}`;
  }

  return (
    <div className="w-full px-0 py-6">
      <div className="px-4 sm:px-8 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Challenges</h1>
        <p className="text-slate-600 mb-4">Stay consistent with retirement planning through weekly / monthly / quarterly habits.</p>
        <ChallengeKPIStrip streaks={streaks} />
        <CadenceTabs active={activeCadence} onChange={setActiveCadence} />
        <RecommendedChallenges recommended={recommended} onView={handleViewDetails} />
      </div>
      <div className="px-4 sm:px-8">
        {filteredChallenges.map(challenge => {
          const joined = !!challengesState[challenge.id];
          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              joined={joined}
              onView={() => handleViewDetails(challenge)}
              onContinue={() => handleContinue(challenge)}
            />
          );
        })}
        {filteredChallenges.length === 0 && (
          <div className="text-slate-400 text-center py-8">No challenges for this cadence.</div>
        )}
      </div>
    </div>
  );
}
