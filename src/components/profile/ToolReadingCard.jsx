// src/components/profile/ToolReadingCard.jsx
'use client';

import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Lock } from 'lucide-react';

export default function ToolReadingCard({ 
  title, 
  icon, 
  isCompleted, 
  reading, 
  toolPath,
  accentColor = 'indigo'
}) {
  const router = useRouter();

  const colorClasses = {
    indigo: {
      completed: 'border-indigo-200 bg-indigo-50/50',
      icon: 'bg-indigo-100 text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700'
    },
    emerald: {
      completed: 'border-emerald-200 bg-emerald-50/50',
      icon: 'bg-emerald-100 text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    purple: {
      completed: 'border-purple-200 bg-purple-50/50',
      icon: 'bg-purple-100 text-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    },
    blue: {
      completed: 'border-blue-200 bg-blue-50/50',
      icon: 'bg-blue-100 text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.indigo;

  if (!isCompleted) {
    return (
      <div 
        className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:border-slate-300 hover:bg-slate-100/50 transition-all group"
        onClick={() => router.push(toolPath)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center`}>
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
        
        <h4 className="font-semibold text-slate-700 mb-1">{title}</h4>
        <p className="text-sm text-slate-500 mb-3">Complete this tool to unlock insights</p>
        
        <button className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-white transition-colors">
          Go to tool
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 rounded-xl border ${colors.completed} transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors.icon} flex items-center justify-center`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${colors.badge} text-xs font-medium`}>
          <Check className="w-3 h-3" />
          Completed
        </div>
      </div>
      
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      
      {/* Reading values */}
      <div className="space-y-1.5">
        {reading && Object.entries(reading).map(([key, value]) => {
          // Skip internal fields
          if (key.startsWith('_') || key === 'isCompleted' || value === null || value === undefined) {
            return null;
          }
          
          // Format key for display
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
          
          // Format value for display
          let displayValue = value;
          if (typeof value === 'number') {
            if (key.includes('Corpus') || key.includes('Expense') || key.includes('corpus') || key.includes('expense')) {
              displayValue = `₹${value.toLocaleString('en-IN')}`;
            } else if (key.includes('Ratio') || key.includes('ratio')) {
              displayValue = `${(value * 100).toFixed(0)}%`;
            } else if (key.includes('Age') || key.includes('Years') || key.includes('age') || key.includes('years')) {
              displayValue = `${value} yrs`;
            }
          }
          
          return (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{label}</span>
              <span className="font-medium text-slate-900">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
