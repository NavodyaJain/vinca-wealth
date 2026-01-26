"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTemplateById } from '@/lib/templates/templatesData';
import { setActiveTemplateId } from '@/lib/templates/templatesStorage';
import TemplatePreviewHeader from '@/components/shared/TemplatePreviewHeader';

export default function TemplatePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [applied, setApplied] = useState(false);
  const template = getTemplateById(id);

  if (!template) {
    return (
      <div className="p-8 text-center text-slate-500">Template not found.</div>
    );
  }

  function handleApply() {
    setActiveTemplateId(template.id);
    setApplied(true);
  }

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6">
        <button
          className="mb-4 text-emerald-600 hover:underline text-sm"
          onClick={() => router.push('/dashboard/templates')}
        >
          ← Back to Templates
        </button>
        <TemplatePreviewHeader template={template} />
        <div className="mt-6">
          <h3 className="font-semibold text-slate-800 mb-2">What this template sets up</h3>
          <ul className="list-disc pl-6 text-slate-700 mb-4">
            {template.whatItSetsUp.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h3 className="font-semibold text-slate-800 mb-2">Assumptions used</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {template.assumptions.map((a, i) => (
              <span key={i} className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-xs">{a}</span>
            ))}
          </div>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg transition-all"
            onClick={handleApply}
          >
            Use this Template
          </button>
          {applied && (
            <div className="mt-4 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2 text-sm">
              Template applied ✅ Your next step is to start the challenge.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
