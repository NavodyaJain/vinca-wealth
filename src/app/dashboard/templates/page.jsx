"use client";
import { useState } from 'react';
import { getTemplates } from '@/lib/templates/templatesData';
import TemplateCard from '@/components/shared/TemplateCard';

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const templates = getTemplates();
  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full max-w-none px-0 py-6">
      <div className="px-4 sm:px-8 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Templates</h1>
        <p className="text-slate-600 mb-4">Pick a proven retirement blueprint and follow it step-by-step.</p>
        <input
          type="text"
          placeholder="Search by name or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md border border-slate-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-8">
        {filtered.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-slate-400 text-center py-8">No templates found.</div>
        )}
      </div>
    </div>
  );
}
