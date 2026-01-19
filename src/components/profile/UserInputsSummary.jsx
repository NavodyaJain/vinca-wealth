
import React from 'react';
import { toolStepsConfig } from '@/lib/toolSteps';

export default function UserInputsSummary({ formData, onEditClick }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-green-50 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-green-800">Your Inputs (Saved)</h2>
          <p className="text-sm text-green-700">These are the inputs you provided during onboarding. Edit to update your plan.</p>
        </div>
        <button
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Edit Inputs
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {toolStepsConfig.map((step, idx) => (
          <div key={step.title} className="rounded-xl border border-green-100 bg-green-50/50 p-5 flex flex-col gap-3">
            <h3 className="text-base font-semibold text-green-700 mb-2">{step.title}</h3>
            <div className="flex flex-col gap-2">
              {step.fields.map(field => (
                <FieldDisplay key={field.id} field={field} value={formData[field.id]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldDisplay({ field, value }) {
  let display = value;
  if (field.type === 'currency') {
    display = `${field.prefix || ''}${Number(value).toLocaleString('en-IN')}${field.suffix || ''}`;
  } else if (field.type === 'percentage') {
    display = `${value}%`;
  } else if (field.type === 'number') {
    display = `${value}${field.suffix ? ' ' + field.suffix : ''}`;
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-green-800">{field.label}</span>
      <span className="text-sm font-semibold text-green-900">{display}</span>
    </div>
  );
}
