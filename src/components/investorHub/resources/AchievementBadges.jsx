'use client';
import React from 'react';

export default function AchievementBadges({ achievements = [] }) {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 mb-3">Achievements Unlocked</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex flex-col items-center p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 group cursor-pointer"
            title={achievement.description}
          >
            {/* Emoji Badge */}
            <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-200">
              {achievement.emoji}
            </div>

            {/* Achievement Name */}
            <p className="text-xs font-semibold text-slate-900 text-center leading-tight">
              {achievement.name}
            </p>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              {achievement.description}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational message */}
      <p className="text-xs text-slate-500 mt-3 text-center">
        Keep learning to unlock more achievements!
      </p>
    </div>
  );
}
