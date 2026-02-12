'use client';
import React from 'react';

/**
 * AchievementTracker - Transparent achievement visibility system
 * Shows all achievements (locked & unlocked) with progress indicators
 * No gamification language, purely informational
 */
export default function AchievementTracker({ achievements = [] }) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Your Learning Achievements</h3>
        <p className="text-sm text-slate-600 mt-1">
          Milestones you've reached through your learning journey
        </p>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 text-xs text-slate-500 text-center">
        {unlockedCount} of {totalCount} milestones reached
      </div>
    </div>
  );
}

/**
 * Individual Achievement Card
 */
function AchievementCard({ achievement }) {
  const { isUnlocked, progress, target, description, metric } = achievement;

  const progressPercentage = Math.min((progress / target) * 100, 100);

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isUnlocked
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Header: Name & Status */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-900 text-sm">
          {achievement.name}
        </h4>
        {isUnlocked && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
            Unlocked
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 mb-3">
        {description}
      </p>

      {/* Progress Indicator */}
      <div className="space-y-1">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isUnlocked ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-xs text-slate-600">
          {metric === 'difficultyCoverage'
            ? `${progress} of ${target} difficulty levels covered`
            : `${progress} of ${target} ${metric === 'completedSeriesCount' ? 'series completed' : 'advanced series completed'}`}
        </p>

        {/* Difficulty Coverage Details (for Balanced Learner) */}
        {metric === 'difficultyCoverage' && achievement.details && (
          <div className="flex gap-3 mt-2 text-xs">
            <span className={achievement.details.beginner ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
              {achievement.details.beginner ? '✓' : '○'} Beginner
            </span>
            <span className={achievement.details.intermediate ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
              {achievement.details.intermediate ? '✓' : '○'} Intermediate
            </span>
            <span className={achievement.details.advanced ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
              {achievement.details.advanced ? '✓' : '○'} Advanced
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
