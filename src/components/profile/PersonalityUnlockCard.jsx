// src/components/profile/PersonalityUnlockCard.jsx
'use client';

import { useRouter } from 'next/navigation';
import { Lock, ChevronRight, Check, X } from 'lucide-react';

export default function PersonalityUnlockCard({ completionStatus, onCompleteTools }) {
  const router = useRouter();
  
  const {
    financialReadiness,
    earlyRetirement,
    lifestylePlanner,
    healthStress,
    completedCount
  } = completionStatus;

  const tools = [
    { key: 'financialReadiness', label: 'Financial Readiness', completed: financialReadiness, path: '/dashboard/financial-readiness' },
    { key: 'earlyRetirement', label: 'Early Retirement Optimizer', completed: earlyRetirement, path: '/dashboard/financial-readiness' },
    { key: 'lifestylePlanner', label: 'Lifestyle Planner', completed: lifestylePlanner, path: '/dashboard/lifestyle-planner' },
    { key: 'healthStress', label: 'Health Stress Test', completed: healthStress, path: '/dashboard/health-stress' }
  ];

  const progressPercent = (completedCount / 4) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Blurred preview background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-50" />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/60" />
      
      <div className="relative p-6 sm:p-8">
        {/* Lock icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Unlock Your Retirement Personality
          </h3>
          <p className="text-slate-600">
            Complete all 4 tools to reveal your investor tribe.
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-700">Progress</span>
            <span className="text-slate-500">{completedCount}/4 completed</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        {/* Tool checklist */}
        <div className="space-y-3 mb-6">
          {tools.map((tool) => (
            <div 
              key={tool.key}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                tool.completed 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
              }`}
              onClick={() => !tool.completed && router.push(tool.path)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  tool.completed 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {tool.completed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <span className={`font-medium ${tool.completed ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {tool.label}
                </span>
              </div>
              {!tool.completed && (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </div>
          ))}
        </div>
        
        {/* CTA button */}
        {completedCount < 4 && (
          <button
            onClick={onCompleteTools}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Complete Remaining Tools
          </button>
        )}
      </div>
    </div>
  );
}
