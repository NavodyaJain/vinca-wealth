'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolWelcomeHeader from '@/components/ToolWelcomeHeader';
import ToolStepperInputs from '@/components/ToolStepperInputs';
import StatusBanner from '@/components/StatusBanner';
import { defaultToolFormData, toolStepsConfig } from '@/lib/toolSteps';

export default function LifestylePlannerToolPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(defaultToolFormData);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const summaryRef = useRef(null);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    localStorage.setItem('vinca_tool_lifestyle_formData', JSON.stringify(formData));
    setHasSubmitted(true);
    requestAnimationFrame(() => {
      if (summaryRef.current) {
        summaryRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem('vinca_tool_lifestyle_formData');
    if (stored) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(stored) }));
      } catch (error) {
        console.warn('Unable to load stored lifestyle planner inputs', error);
      }
    }
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <ToolWelcomeHeader toolName="Lifestyle Planner" />

        <ToolStepperInputs
          steps={toolStepsConfig}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          ctaLabel="Analyze your Lifestyle Plan"
        />

        <div ref={summaryRef} className="space-y-4">
          {hasSubmitted && <StatusBanner formData={formData} />}

          {hasSubmitted && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center space-y-3">
              <p className="text-sm text-slate-700">Your Lifestyle Planner preview is ready. Continue to unlock the detailed dashboard.</p>
              <button
                onClick={() => router.push('/signin')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <span>✅ Get Detailed Analysis</span>
              </button>
            </div>
          )}

          {!hasSubmitted && (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-600">
              Complete all 3 steps and hit Analyze your Lifestyle Plan to view your status banner preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
