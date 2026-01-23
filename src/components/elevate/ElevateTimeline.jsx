// src/components/elevate/ElevateTimeline.jsx
import { CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    id: 'financialReadiness',
    title: 'Financial Readiness',
    link: '/dashboard/financial-readiness',
  },
  {
    id: 'lifestylePlanner',
    title: 'Lifestyle Planner',
    link: '/dashboard/lifestyle-planner',
  },
  {
    id: 'healthStress',
    title: 'Health Stress Test',
    link: '/dashboard/health-stress',
  },
  {
    id: 'checkEligibility',
    title: 'Check Eligibility',
    link: '/dashboard/check-eligibility',
    optional: true,
  },
];

export default function ElevateTimeline({ progress }) {
  const completedCount = STEPS.filter(s => !s.optional && progress[s.id]).length;
  const totalCount = STEPS.filter(s => !s.optional).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-bold text-emerald-900 mb-2">Your Progress</div>
      <ol className="relative border-l border-slate-200 pl-4">
        {STEPS.map((step, idx) => {
          const done = progress[step.id];
          return (
            <li key={step.id} className="mb-8 ml-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-emerald-200 bg-white">
                  {done ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Clock className="h-5 w-5 text-slate-400" />}
                </span>
                <span className="font-medium text-base text-slate-900">{step.title}</span>
                <span className={`text-xs ${done ? 'text-emerald-600' : 'text-slate-400'}`}>{done ? 'Completed' : step.optional ? 'Optional' : 'Not completed'}</span>
                {!done && (
                  <Link href={step.link} className="ml-2 px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 hover:bg-emerald-100 transition">Complete now</Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-2 text-sm text-emerald-800 font-semibold">{completedCount}/{totalCount} completed</div>
    </div>
  );
}
