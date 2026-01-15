'use client';

import { useState } from 'react';
import ToolWelcomeHeader from '@/components/ToolWelcomeHeader';
import ToolStepperInputs from '@/components/ToolStepperInputs';
import ToolPlaceholderResults from '@/components/ToolPlaceholderResults';
import { defaultToolFormData, toolStepsConfig } from '@/lib/toolSteps';

export default function LifestylePlannerToolPage() {
  const [formData, setFormData] = useState(defaultToolFormData);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    localStorage.setItem('vinca_tool_lifestyle_formData', JSON.stringify(formData));
    setHasSubmitted(true);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <ToolWelcomeHeader toolName="Lifestyle Planner" subtitle="Unified 3-step flow to keep every tool consistent." />

        <ToolStepperInputs
          steps={toolStepsConfig}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          ctaLabel="Analyse your Lifestyle Planner"
        />

        {hasSubmitted && <ToolPlaceholderResults toolName="Lifestyle Planner" />}
        {!hasSubmitted && (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-600">
            Complete all 3 steps and hit Analyse your Lifestyle Planner to view the upcoming insights.
          </div>
        )}
      </div>
    </div>
  );
}
