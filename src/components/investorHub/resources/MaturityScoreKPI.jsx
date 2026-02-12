'use client';
import React from 'react';

/**
 * KPI 1: Financial Maturity Score
 * Circular progress indicator with maturity level tag
 */
export default function MaturityScoreKPI({
  maturityScore = 0,
  maturityLevel = 'Getting Started'
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (maturityScore / 100) * circumference;

  // Color scheme based on maturity level
  const colorMap = {
    'Getting Started': {
      gradientStart: '#cbd5e1',
      gradientEnd: '#94a3b8',
      badge: 'bg-slate-100 text-slate-700'
    },
    'Awareness Builder': {
      gradientStart: '#a7f3d0',
      gradientEnd: '#10b981',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    'Decision Ready': {
      gradientStart: '#99f6e4',
      gradientEnd: '#14b8a6',
      badge: 'bg-teal-100 text-teal-800'
    },
    'Strategy Confident': {
      gradientStart: '#86efac',
      gradientEnd: '#22c55e',
      badge: 'bg-green-100 text-green-800'
    },
    'Readiness Mature': {
      gradientStart: '#6ee7b7',
      gradientEnd: '#059669',
      badge: 'bg-emerald-200 text-emerald-900'
    }
  };

  const colors = colorMap[maturityLevel] || colorMap['Getting Started'];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8 lg:p-12 flex flex-col items-center shadow-md h-full min-h-96">
      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-700 mb-6 text-center">
        Financial Maturity Score
      </h3>

      {/* Circular Progress */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-6 flex-grow flex-shrink-0">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="maturity-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.gradientStart} />
              <stop offset="100%" stopColor={colors.gradientEnd} />
            </linearGradient>
          </defs>

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
            stroke="url(#maturity-gradient)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-slate-900">{maturityScore}%</span>
        </div>
      </div>

      {/* Maturity Level Tag */}
      <div className={`${colors.badge} px-4 py-2 rounded-full text-base font-semibold`}>
        {maturityLevel}
      </div>
    </div>
  );
}
