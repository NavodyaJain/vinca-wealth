'use client';

import { useState } from 'react';
import ToolWelcomeHeader from '@/components/ToolWelcomeHeader';
import ToolStepperInputs from '@/components/ToolStepperInputs';
import ToolPlaceholderResults from '@/components/ToolPlaceholderResults';
import { defaultToolFormData, toolStepsConfig } from '@/lib/toolSteps';

export default function BlindSpotToolPage() {
  const [formData, setFormData] = useState(defaultToolFormData);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    localStorage.setItem('vinca_tool_blindspot_formData', JSON.stringify(formData));
    setHasSubmitted(true);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <ToolWelcomeHeader toolName="Blind Spot Analysis" subtitle="A unified flow to capture the essentials before analysis." />

        <ToolStepperInputs
          steps={toolStepsConfig}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          ctaLabel="Analyse your Blind Spot"
        />

        {hasSubmitted && <ToolPlaceholderResults toolName="Blind Spot Analysis" />}
        {!hasSubmitted && (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-600">
            Complete all 3 steps and hit Analyse your Blind Spot to view the upcoming insights.
          </div>
        )}
      </div>
    </div>
  );
}
