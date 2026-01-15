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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center gap-3">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold border-2 transition-colors ${
                  currentStep >= index + 1 ? 'bg-green-600 border-green-600 text-white' : 'border-slate-200 text-slate-400'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-12 mx-2 ${currentStep > index + 1 ? 'bg-green-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-[0.08em]">Step {currentStep} of {totalSteps}</p>
          <h2 className="text-2xl font-semibold text-slate-900 mt-2">{activeStep.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{activeStep.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <button
            onClick={handleBack}
            className={`btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
            type="button"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="btn-primary ml-auto"
            type="button"
          >
            {currentStep === totalSteps ? ctaLabel : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
