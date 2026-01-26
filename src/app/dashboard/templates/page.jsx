"use client";

import { useState, useEffect } from 'react';
import roleModelTemplates from '@/lib/templates/roleModelTemplates';
import { useRouter } from 'next/navigation';


export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('recommended');
  const [savedRoleModels, setSavedRoleModels] = useState([]);
  const [userInputs, setUserInputs] = useState({ retirementAge: null });
  const router = useRouter();

  useEffect(() => {
    // Read user inputs from localStorage
    let inputs = null;
    try {
      inputs = JSON.parse(localStorage.getItem('financialReadinessInputs')) ||
        JSON.parse(localStorage.getItem('retirementInputs')) ||
        JSON.parse(localStorage.getItem('calculatorInputs')) || {};
    } catch (e) {
      inputs = {};
    }
    setUserInputs({
      retirementAge: inputs.retirementAge || inputs.goalRetirementAge || '',
      monthlyExpenses: inputs.monthlyExpenses || '',
      monthlySIP: inputs.monthlySIP || '',
      monthlyIncome: inputs.monthlyIncome || ''
    });
    // Saved role models
    const saved = JSON.parse(localStorage.getItem('vinca_saved_role_models') || '[]');
    setSavedRoleModels(saved);
  }, []);

  // Matching logic
  function isMatched(template) {
    const age = Number(userInputs.retirementAge);
    if (!age) return false;
    const [min, max] = template.matches.retireByAgeRange;
    return age >= min && age <= max;
  }

  // Filter tabs
  const recommendedTemplates = roleModelTemplates.filter(t => !savedRoleModels.includes(t.id));
  const savedTemplates = roleModelTemplates.filter(t => savedRoleModels.includes(t.id));

  const templatesToShow = activeTab === 'saved' ? savedTemplates : recommendedTemplates;

  return (
    <div className="w-full px-0 py-6">
      <div className="px-4 sm:px-8 mb-6">
        <div className="rounded-2xl bg-linear-to-r from-emerald-50 via-white to-emerald-50 p-6 mb-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Role Model Templates</h1>
          <p className="text-slate-600 mb-2">See how people with similar retirement goals achieved financial freedom — step by step.</p>
          {userInputs.retirementAge && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-emerald-700 bg-emerald-100 rounded px-2 py-0.5">Your goal: Retire by {userInputs.retirementAge}</span>
              <span className="text-xs text-slate-500 bg-slate-100 rounded px-2 py-0.5">Based on your Financial Readiness inputs</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-1 rounded-full font-semibold text-sm border ${activeTab === 'recommended' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200'} transition`}
            onClick={() => setActiveTab('recommended')}
          >Recommended</button>
          <button
            className={`px-4 py-1 rounded-full font-semibold text-sm border ${activeTab === 'saved' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200'} transition`}
            onClick={() => setActiveTab('saved')}
          >Saved</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-8">
        {templatesToShow.length === 0 && (
          <div className="col-span-3 text-slate-400 text-center py-8">No role models found.</div>
        )}
        {templatesToShow.map(template => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-92.5 min-h-92.5 w-full overflow-hidden transition hover:shadow-md">
            <div className="w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
              <img src={template.thumbnailImage || '/images/templates/placeholder.jpg'} alt={template.name} className="object-cover w-full h-full rounded-t-2xl" />
            </div>
            <div className="flex-1 flex flex-col px-4 py-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900">Hi, I'm {template.name}</span>
                {isMatched(template) && (
                  <span className="ml-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded px-2 py-0.5">Same as your goal ✅</span>
                )}
              </div>
              <span className="text-emerald-700 font-semibold text-sm">Goal: Retire by {template.goal.retireByAge}</span>
              <span className="text-slate-700 text-sm">{template.heroLine}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {template.matches.lifestyleTags.map((tag, i) => (
                  <span key={i} className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs capitalize">{tag}</span>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-2">Started at {template.ageWhenStarted} • {template.profession} • {template.city}</div>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-3 py-2 text-sm transition"
                onClick={() => router.push(`/dashboard/templates/${template.id}`)}
              >View Journey</button>
              <button
                className="flex-1 border border-emerald-600 text-emerald-700 font-semibold rounded-lg px-3 py-2 text-sm hover:bg-emerald-50 transition"
                onClick={() => {
                  // Save for later
                  const saved = JSON.parse(localStorage.getItem('vinca_saved_role_models') || '[]');
                  if (!saved.includes(template.id)) {
                    const updated = [...saved, template.id];
                    localStorage.setItem('vinca_saved_role_models', JSON.stringify(updated));
                    setSavedRoleModels(updated);
                  }
                }}
              >Save for later</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
