'use client';

import { useState } from 'react';
import InputField from './InputField';

export default function ToolStepperInputs({ steps, formData, onChange, onSubmit, ctaLabel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = steps.length;
  const activeStep = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (onSubmit) {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border-2 transition-colors ${
                    currentStep >= index + 1 ? 'bg-green-600 border-green-600 text-white' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-10 sm:w-14 mx-1 sm:mx-2 ${currentStep > index + 1 ? 'bg-green-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-green-700 uppercase tracking-[0.08em]">Step {currentStep} of {totalSteps}</p>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">{activeStep.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{activeStep.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 min-h-[280px]">
          {activeStep.fields.map((field) => (
            <InputField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              value={formData[field.id]}
              onChange={(value) => onChange(field.id, value)}
              min={field.min}
              max={field.max}
              prefix={field.prefix}
              suffix={field.suffix}
              helper={field.helper}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 sm:pt-4 border-t border-slate-200">
          <button
            onClick={handleBack}
            className={`btn-secondary w-full sm:w-auto ${currentStep === 1 ? 'invisible sm:invisible' : ''}`}
            type="button"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="btn-primary w-full sm:w-auto h-11"
            type="button"
          >
            {currentStep === totalSteps ? ctaLabel : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
