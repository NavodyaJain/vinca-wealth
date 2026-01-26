"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import roleModelTemplates from '@/lib/templates/roleModelTemplates';

export default function RoleModelJourneyPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const found = roleModelTemplates.find(t => t.id === id);
    setTemplate(found);
  }, [id]);

  if (!template) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500">Role model not found.</div>
        <button className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/templates')}>← Back to Role Models</button>
      </div>
    );
  }

  // Save selected template on CTA
  function followJourney() {
    localStorage.setItem('vinca_selected_role_model_template', template.id);
    router.push(`/dashboard/challenges/${template.recommendedChallengePackId}`);
  }

  function saveForLater() {
    const saved = JSON.parse(localStorage.getItem('vinca_saved_role_models') || '[]');
    if (!saved.includes(template.id)) {
      const updated = [...saved, template.id];
      localStorage.setItem('vinca_saved_role_models', JSON.stringify(updated));
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <button className="mb-4 text-emerald-700 font-semibold" onClick={() => router.push('/dashboard/templates')}>← Back to Role Models</button>
      <div className="rounded-2xl bg-linear-to-r from-emerald-50 via-white to-emerald-50 p-6 mb-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <img src={template.thumbnailImage || '/images/templates/placeholder.jpg'} alt={template.name} className="w-32 h-32 object-cover rounded-2xl border border-gray-200" />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-slate-900">{template.name}'s Journey</h2>
          <div className="text-emerald-700 font-semibold text-lg">Goal: Retire by {template.goal.retireByAge} • Lifestyle: {template.goal.lifestyle}</div>
          <div className="text-slate-700 text-base">{template.heroLine}</div>
          <div className="flex gap-2 mt-2">
            <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{template.profession}</span>
            <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{template.family}</span>
            <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{template.city}</span>
          </div>
        </div>
      </div>
      <div className="mb-8">
        {template.journeyTimeline.map((phase, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-200 shadow-sm mb-6 p-6 bg-white">
            <div className="font-bold text-lg text-emerald-700 mb-1">{phase.phaseTitle} <span className="text-xs text-slate-500 font-normal">{phase.duration}</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <div className="font-semibold text-slate-700 mb-1">What they did</div>
                <ul className="list-disc pl-5 text-slate-700 text-sm">
                  {phase.actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-700 mb-1">Challenges faced</div>
                <ul className="list-disc pl-5 text-slate-700 text-sm">
                  {phase.challengesFaced.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-700 mb-1">How they handled it</div>
                <ul className="list-disc pl-5 text-slate-700 text-sm">
                  {phase.howSolved.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Action buttons removed as requested */}
    </div>
  );
}
