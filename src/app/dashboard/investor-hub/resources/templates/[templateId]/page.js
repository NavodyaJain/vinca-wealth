"use client";
import { useParams, useRouter } from "next/navigation";
import { templates } from "@/data/investorHub/resourcesData";
import useResourcesSavedState from "@/hooks/useResourcesSavedState";

export default function TemplateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { savedTemplates, toggleSavedTemplate } = useResourcesSavedState();
  const templateId = params?.templateId;
  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="text-lg font-semibold mb-2">Template not found</div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white mt-2"
          onClick={() => router.push('/dashboard/investor-hub/resources')}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top nav */}
      <div className="pt-4 pb-2">
        <button
          className="mb-4 px-4 py-1 rounded bg-gray-100 text-gray-700 hover:bg-blue-50 text-sm font-medium"
          onClick={() => router.push('/dashboard/investor-hub/resources')}
          type="button"
        >
          ← Back to Resources
        </button>
      </div>
      {/* Header */}
      <div className="mb-6">
        <img
          src={template.bannerImage || 'https://placehold.co/400x200?text=Resource+Image'}
          alt={template.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{template.title}</h1>
        <p className="text-gray-700 mb-2">{template.description}</p>
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{template.category}</span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">Best for: {template.bestFor}</span>
          <span className="text-xs text-gray-500">Estimated time: 10 min</span>
        </div>
      </div>
      {/* Preview Card */}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-6 max-w-md mx-auto">
        <h2 className="font-semibold text-lg mb-4 text-center">Template Preview</h2>
        <div className="space-y-3">
          {template.previewFields?.map((field, idx) => (
            <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-b-0">
              <span className="text-gray-600 text-sm">{field.label}</span>
              <span className="font-medium text-gray-900 text-sm">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-2 mb-8 justify-center">
        <button
          className={`px-4 py-1 rounded text-sm font-medium transition ${savedTemplates.includes(template.id) ? 'bg-blue-50 border border-blue-600 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
          onClick={() => toggleSavedTemplate(template.id)}
          type="button"
        >
          {savedTemplates.includes(template.id) ? 'Saved' : 'Save Template'}
        </button>
        <button
          className="px-4 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700"
          onClick={() => alert('Download coming soon')}
          type="button"
        >
          Download
        </button>
        <button
          className="px-4 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700"
          onClick={() => alert('Template usage coming soon')}
          type="button"
        >
          Use this Template
        </button>
      </div>
      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-xs text-yellow-800">
        Templates are educational planning tools. Not a recommendation or guarantee of outcomes.
      </div>
    </div>
  );
}
