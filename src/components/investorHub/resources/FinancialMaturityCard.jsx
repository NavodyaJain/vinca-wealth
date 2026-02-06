// src/components/investorHub/resources/FinancialMaturityCard.jsx
'use client';
import React from 'react';

export default function FinancialMaturityCard({
  maturityLevel,
  completedSeriesByLevel
}) {
  // Color scheme based on maturity level - light green/neutral gradient theme
  const colorSchemes = {
    'Getting Started': {
      border: 'border-slate-200',
      background: 'bg-gradient-to-br from-slate-50 via-white to-slate-50',
      badge: 'bg-slate-100 text-slate-700',
      accentBar: 'bg-slate-300',
      gradientStart: '#cbd5e1',
      gradientEnd: '#94a3b8'
    },
    'Awareness Builder': {
      border: 'border-emerald-200',
      background: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50',
      badge: 'bg-emerald-100 text-emerald-800',
      accentBar: 'bg-emerald-500',
      gradientStart: '#a7f3d0',
      gradientEnd: '#10b981'
    },
    'Decision Ready': {
      border: 'border-teal-200',
      background: 'bg-gradient-to-br from-teal-50 via-white to-cyan-50',
      badge: 'bg-teal-100 text-teal-800',
      accentBar: 'bg-teal-500',
      gradientStart: '#99f6e4',
      gradientEnd: '#14b8a6'
    },
    'Strategy Confident': {
      border: 'border-green-200',
      background: 'bg-gradient-to-br from-green-50 via-white to-emerald-50',
      badge: 'bg-green-100 text-green-800',
      accentBar: 'bg-green-600',
      gradientStart: '#86efac',
      gradientEnd: '#22c55e'
    },
    'Readiness Mature': {
      border: 'border-emerald-300',
      background: 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50',
      badge: 'bg-emerald-200 text-emerald-900',
      accentBar: 'bg-emerald-600',
      gradientStart: '#6ee7b7',
      gradientEnd: '#059669'
    }
  };

  const colors = colorSchemes[maturityLevel] || colorSchemes['Getting Started'];

  // Map maturity level to percentage
  const getMaturityPercentage = () => {
    switch (maturityLevel) {
      case 'Awareness Builder':
        return 25;
      case 'Decision Ready':
        return 50;
      case 'Strategy Confident':
        return 75;
      case 'Readiness Mature':
        return 100;
      default:
        return 0;
    }
  };

  const percentage = getMaturityPercentage();
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`${colors.background} rounded-2xl shadow-lg shadow-slate-100 border ${colors.border} p-6 md:p-8 h-full`}>
      {/* Responsive Layout: Desktop side-by-side, Mobile stacked */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Right side on mobile (top), Left side on desktop */}
        <div className="w-full md:w-auto flex flex-col items-center justify-center md:justify-start md:order-2 shrink-0">
          {/* Circular Progress Indicator */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circle Progress */}
            <svg
              className="absolute w-36 h-36 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Gradient definition */}
              <defs>
                <linearGradient id={`gradient-${maturityLevel}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.gradientStart} />
                  <stop offset="100%" stopColor={colors.gradientEnd} />
                </linearGradient>
              </defs>

              {/* Background circle (light) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />

              {/* Progress circle with gradient */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={`url(#gradient-${maturityLevel})`}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center z-10">
              <span className="text-4xl font-bold text-slate-900">{percentage}%</span>
            </div>
          </div>

          {/* Label below circle */}
          <p className="text-xs font-semibold text-slate-600 text-center mt-4 leading-tight">
            Financial Learning Maturity
          </p>
        </div>

        {/* Left side on desktop, Top on mobile - Content Section */}
        <div className="w-full md:flex-1 md:order-1">
          {/* Header */}
          <div>
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">
              Your financial maturity meter
            </h2>

            {/* Subtitle */}
            <p className="text-xs md:text-sm text-slate-600 mb-4 md:mb-5 leading-relaxed">
              Your awareness and confidence grows in your financial readiness journey as you learn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
