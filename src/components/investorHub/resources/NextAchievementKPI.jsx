'use client';
import React, { useState } from 'react';

/**
 * KPI 3: Progress to Next Achievement
 * Circular progress ring with hover tooltip showing next achievement details
 */
export default function NextAchievementKPI({
  progressPercentage = 0,
  nextAchievement = null
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Determine color based on progress
  const getProgressColor = () => {
    if (progressPercentage >= 75) return '#22c55e';
    if (progressPercentage >= 50) return '#f59e0b';
    if (progressPercentage >= 25) return '#3b82f6';
    return '#cbd5e1';
  };

  const progressColor = getProgressColor();

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col items-center shadow-sm relative">
      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-700 mb-4 text-center">
        Progress to Next
      </h3>

      {/* Circular Progress Ring */}
      <div
        className="relative w-32 h-32 flex items-center justify-center cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <svg className="w-32 h-32" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={-(strokeDashoffset)}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50px 50px'
            }}
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{progressPercentage}%</span>
        </div>

        {/* Tooltip on Hover */}
        {showTooltip && nextAchievement && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white rounded-lg p-3 whitespace-nowrap z-20 text-xs">
            <div className="font-semibold mb-1">{nextAchievement.name}</div>
            <div className="text-slate-300">
              {nextAchievement.progress} of {nextAchievement.target} completed
            </div>
            {/* Triangle pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
          </div>
        )}

        {/* All Unlocked State */}
        {!nextAchievement && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white rounded-lg p-3 whitespace-nowrap z-20 text-xs">
            <div className="font-semibold">All Achievements Unlocked!</div>
            {/* Triangle pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="mt-4 text-xs text-slate-600 text-center">
        {nextAchievement ? (
          <>
            <p className="font-semibold text-slate-700">{nextAchievement.name}</p>
            <p>{nextAchievement.progress} / {nextAchievement.target}</p>
          </>
        ) : (
          <p className="text-emerald-600 font-semibold">All achievements unlocked!</p>
        )}
      </div>
    </div>
  );
}
