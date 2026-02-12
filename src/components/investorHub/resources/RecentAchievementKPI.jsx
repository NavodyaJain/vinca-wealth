'use client';
import React from 'react';

/**
 * KPI 2: Recent Achievement Unlocked
 * Shows the most recently unlocked achievement or empty state
 */
export default function RecentAchievementKPI({
  latestAchievement = null
}) {
  // Achievement icons (emoji-based for simplicity)
  const achievementIcons = {
    'first-step-taken': '🌱',
    'bronze-learner': '🥉',
    'depth-explorer': '🔍',
    'balanced-learner': '⚖️'
  };

  const hasAchievement = latestAchievement && latestAchievement.isUnlocked;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8 lg:p-12 flex flex-col items-center shadow-md h-full min-h-96">
      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-700 mb-6 text-center">
        Latest Achievement
      </h3>

      {/* Achievement Display or Empty State */}
      {hasAchievement ? (
        <div className="flex flex-col items-center flex-grow flex-shrink justify-center">
          {/* Icon */}
          <div className="text-8xl mb-6">
            {achievementIcons[latestAchievement.id] || '🏆'}
          </div>

          {/* Achievement Name */}
          <h4 className="text-lg font-bold text-slate-900 text-center mb-2">
            {latestAchievement.name}
          </h4>

          {/* Achievement Description */}
          <p className="text-sm text-slate-600 text-center mb-4">
            {latestAchievement.description}
          </p>

          {/* Unlocked Badge */}
          <div className="mt-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            ✓ Unlocked
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center flex-grow flex-shrink justify-center">
          {/* Empty State Icon */}
          <div className="text-8xl mb-6 opacity-50">
            🎯
          </div>

          {/* Empty State Message */}
          <p className="text-lg text-slate-600">
            No achievements unlocked yet
          </p>

          {/* Encouragement Text */}
          <p className="text-sm text-slate-500 mt-3">
            Complete your first series to get started
          </p>
        </div>
      )}
    </div>
  );
}
