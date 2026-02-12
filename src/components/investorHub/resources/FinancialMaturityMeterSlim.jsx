'use client';
import React, { useState } from 'react';

/**
 * Financial Maturity Meter - Points-Based Edition
 * Shows 3 KPI cards: Total Points | Latest Achievement | Next Achievement Progress
 * 
 * Layout: Horizontal cards with vertical dividers
 * Responsive: Stacks on mobile, 1 row on desktop
 */
export default function FinancialMaturityMeterSlim({
  totalPoints = 0,
  latestAchievement = null,
  nextAchievementProgress = null
}) {

  const [hoveredKpi, setHoveredKpi] = useState(null);

  // Determine color scheme based on achievement level
  const getColorScheme = () => {
    if (!latestAchievement) {
      return {
        border: 'border-slate-300',
        background: 'bg-slate-50',
        kpiBackground: 'bg-slate-100',
        text: 'text-slate-900',
        textMuted: 'text-slate-600',
        divider: 'border-slate-200',
        progressBar: 'bg-slate-300'
      };
    }
    
    // Color by achievement level (higher level = warmer colors)
    const level = latestAchievement.level;
    
    if (level <= 3) {
      return {
        border: 'border-emerald-300',
        background: 'bg-emerald-50',
        kpiBackground: 'bg-emerald-100',
        text: 'text-emerald-900',
        textMuted: 'text-emerald-700',
        divider: 'border-emerald-200',
        progressBar: 'bg-emerald-400'
      };
    } else if (level <= 6) {
      return {
        border: 'border-teal-300',
        background: 'bg-teal-50',
        kpiBackground: 'bg-teal-100',
        text: 'text-teal-900',
        textMuted: 'text-teal-700',
        divider: 'border-teal-200',
        progressBar: 'bg-teal-400'
      };
    } else {
      return {
        border: 'border-blue-300',
        background: 'bg-blue-50',
        kpiBackground: 'bg-blue-100',
        text: 'text-blue-900',
        textMuted: 'text-blue-700',
        divider: 'border-blue-200',
        progressBar: 'bg-blue-500'
      };
    }
  };

  const colors = getColorScheme();

  // Achievement emoji map
  const achievementEmojis = {
    'first-step': '🌱',
    'learning-starter': '📚',
    'consistent-learner': '✨',
    'knowledge-builder': '🧠',
    'awareness-strong': '💡',
    'discipline-formed': '🎯',
    'strategy-mindset': '🎲',
    'financial-explorer': '🔭',
    'advanced-learner': '🏔️',
    'financially-mature': '👑'
  };

  return (
    <div className={`${colors.background} border ${colors.border} rounded-lg shadow-sm w-full`} style={{ minHeight: '140px' }}>
      {/* Main container - flex row with 3 KPI cards */}
      <div className="flex flex-col md:flex-row items-stretch h-full">
        
        {/* KPI 1: Total Learning Points */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-5 sm:py-6 border-b md:border-b-0 md:border-r border-slate-200">
          <p className={`text-xs font-medium ${colors.textMuted} uppercase tracking-wide mb-2`}>
            Learning Points
          </p>
          <div className={`text-5xl sm:text-6xl font-bold ${colors.text}`}>
            {totalPoints}
          </div>
          <p className={`text-xs ${colors.textMuted} mt-2 text-center`}>
            Total points earned
          </p>
        </div>

        {/* KPI 2: Latest Achievement */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-5 sm:py-6 border-b md:border-b-0 md:border-r border-slate-200">
          {latestAchievement ? (
            <>
              <p className={`text-xs font-medium ${colors.textMuted} uppercase tracking-wide mb-2`}>
                Latest Achievement
              </p>
              <div className="text-4xl sm:text-5xl mb-3">
                {achievementEmojis[latestAchievement.id] || '🏆'}
              </div>
              <h3 className={`text-sm sm:text-base font-bold ${colors.text} text-center`}>
                {latestAchievement.name}
              </h3>
              <p className={`text-xs ${colors.textMuted} mt-1`}>
                Unlocked at {latestAchievement.pointsRequired} pts
              </p>
            </>
          ) : (
            <>
              <p className={`text-xs font-medium ${colors.textMuted} uppercase tracking-wide mb-2`}>
                Latest Achievement
              </p>
              <div className="text-3xl opacity-30 mb-2">🎯</div>
              <p className={`text-xs ${colors.textMuted} text-center`}>
                Complete video series<br />to unlock achievements
              </p>
            </>
          )}
        </div>

        {/* KPI 3: Next Achievement Progress (auto-hide if all unlocked) */}
        {nextAchievementProgress && !nextAchievementProgress.allUnlocked && (
          <div 
            className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-5 sm:py-6"
            onMouseEnter={() => setHoveredKpi(3)}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <p className={`text-xs font-medium ${colors.textMuted} uppercase tracking-wide mb-2`}>
              Next Achievement
            </p>
            <h3 className={`text-sm font-bold ${colors.text} mb-3`}>
              {nextAchievementProgress.nextAchievementName}
            </h3>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className={`${colors.progressBar} h-full rounded-full transition-all duration-300`}
                style={{ width: `${nextAchievementProgress.percentage}%` }}
              ></div>
            </div>
            
            {/* Progress label */}
            <p className={`text-xs ${colors.textMuted} font-medium`}>
              {nextAchievementProgress.current} / {nextAchievementProgress.target} pts
            </p>
            
            {/* Tooltip on hover */}
            {hoveredKpi === 3 && (
              <div className={`text-xs ${colors.textMuted} mt-2 p-2 rounded bg-white bg-opacity-60 italic`}>
                Earn points by completing more video series
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
