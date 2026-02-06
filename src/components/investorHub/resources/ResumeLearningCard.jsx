// src/components/investorHub/resources/ResumeLearningCard.jsx
'use client';
import React from 'react';

export default function ResumeLearningCard({
  series,
  currentVideoIndex,
  totalVideos,
  onResume,
  onStartLearning,
  onExploreNext
}) {
  // Determine card state
  let state = 'zero'; // default: no learning started
  let progressPercentage = 0;

  if (series) {
    // Series has been started
    if (currentVideoIndex >= totalVideos && totalVideos > 0) {
      // Series is completed
      state = 'completed';
    } else {
      // Series is in progress
      state = 'in-progress';
      progressPercentage = totalVideos > 0 
        ? Math.round((currentVideoIndex / totalVideos) * 100) 
        : 0;
    }
  }

  // ZERO STATE: No learning started
  if (state === 'zero') {
    return (
      <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 rounded-2xl shadow-lg shadow-slate-100 border border-slate-200 p-8 h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          {/* Label */}
          <h3 className="text-xs font-bold text-slate-500 mb-3 tracking-widest uppercase">
            Begin Learning
          </h3>
          
          {/* Main Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Start your journey
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 mb-6">
            Build awareness before taking financial actions.
          </p>

          {/* Progress Section */}
          <div className="mb-6">
            {/* Progress Bar - Empty/Muted */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="bg-slate-300 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-400 h-full rounded-full transition-all duration-300"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500 min-w-max">0%</span>
            </div>
            
            {/* Progress Text */}
            <p className="text-sm text-slate-600 font-medium">
              No videos watched yet
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-start pt-4 border-t border-slate-200">
          <button
            onClick={onStartLearning}
            className="bg-emerald-600 hover:bg-emerald-700 active:shadow-none text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Start Learning →
          </button>
        </div>
      </div>
    );
  }

  // IN-PROGRESS STATE: Series started but not completed
  if (state === 'in-progress') {
    return (
      <div className="bg-linear-to-br from-emerald-50 via-white to-teal-50 rounded-2xl shadow-lg shadow-emerald-100 border border-emerald-200 p-8 h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          {/* Label */}
          <h3 className="text-xs font-bold text-emerald-600 mb-3 tracking-widest uppercase">
            Continue Learning
          </h3>
          
          {/* Series Name */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-2">
            {series.title}
          </h2>

          {/* Progress Section */}
          <div className="mt-6">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="bg-emerald-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-700 min-w-max">{progressPercentage}%</span>
            </div>
            
            {/* Progress Text */}
            <p className="text-sm text-slate-600 font-medium">
              <span className="font-bold text-slate-900">{currentVideoIndex}</span> of <span className="font-bold text-slate-900">{totalVideos}</span> videos completed
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-start pt-6 mt-6 border-t border-emerald-200">
          <button
            onClick={onResume}
            className="bg-emerald-600 hover:bg-emerald-700 active:shadow-none text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Resume Learning →
          </button>
        </div>
      </div>
    );
  }

  // COMPLETED STATE: Series fully completed
  if (state === 'completed') {
    return (
      <div className="bg-linear-to-br from-emerald-50 via-white to-teal-50 rounded-2xl shadow-lg shadow-emerald-100 border border-emerald-200 p-8 h-full flex flex-col justify-between">
        {/* Header */}
        <div>
          {/* Label */}
          <h3 className="text-xs font-bold text-emerald-600 mb-3 tracking-widest uppercase">
            Series Completed
          </h3>
          
          {/* Series Name */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-2">
            {series.title}
          </h2>

          {/* Completion Message */}
          <p className="text-sm text-slate-600 mb-6 mt-2">
            Well done on advancing your financial knowledge.
          </p>

          {/* Progress Section - Full Bar */}
          <div className="mt-6">
            {/* Progress Bar - Full */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="bg-emerald-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-700 min-w-max">100%</span>
            </div>
            
            {/* Progress Text */}
            <p className="text-sm text-slate-600 font-medium">
              <span className="font-bold text-slate-900">{totalVideos}</span> of <span className="font-bold text-slate-900">{totalVideos}</span> videos completed
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-start pt-6 mt-6 border-t border-emerald-200">
          <button
            onClick={onExploreNext}
            className="bg-emerald-600 hover:bg-emerald-700 active:shadow-none text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Explore next series →
          </button>
        </div>
      </div>
    );
  }
}
