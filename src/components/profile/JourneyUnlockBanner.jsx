// src/components/profile/JourneyUnlockBanner.jsx
'use client';

import { useRouter } from 'next/navigation';
import { PartyPopper, ArrowRight } from 'lucide-react';

export default function JourneyUnlockBanner({ 
  isVisible = false, 
  onViewProfile,
  completionStatus 
}) {
  const router = useRouter();

  if (!isVisible) return null;

  const allCompleted = completionStatus?.completedCount === 4;

  if (!allCompleted) {
    // Show incomplete checklist
    return (
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Almost there! Complete your journey
            </h3>
            <p className="text-slate-600 text-sm mb-3">
              {completionStatus?.completedCount}/4 tools completed. Finish remaining tools to unlock your Retirement Personality.
            </p>
            
            {/* Mini checklist */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                completionStatus?.financialReadiness ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {completionStatus?.financialReadiness ? '✅' : '⬜'} Financial Readiness
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                completionStatus?.earlyRetirement ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {completionStatus?.earlyRetirement ? '✅' : '⬜'} Early Retirement
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                completionStatus?.lifestylePlanner ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {completionStatus?.lifestylePlanner ? '✅' : '⬜'} Lifestyle Planner
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                completionStatus?.healthStress ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {completionStatus?.healthStress ? '✅' : '⬜'} Health Stress
              </span>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/financial-readiness')}
            className="flex-shrink-0 py-2 px-4 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors flex items-center gap-2"
          >
            Complete Tools
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Show success celebration
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
          <PartyPopper className="w-6 h-6 text-emerald-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            🎉 Congratulations! You've unlocked your Retirement Personality
          </h3>
          <p className="text-slate-600 text-sm">
            Your personalized retirement profile is ready. Discover your investor tribe and connect with like-minded individuals.
          </p>
        </div>
        
        <button
          onClick={onViewProfile || (() => router.push('/dashboard/profile'))}
          className="flex-shrink-0 py-2 px-4 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          View in Profile
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
