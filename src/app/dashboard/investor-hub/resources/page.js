"use client";
import resources from '../../../../lib/investorHubResources';
import groups from '../../../../lib/investorHubGroups';
import { useState } from 'react';

export default function ResourcesPage() {
  return (
    <div>
      <div className="mb-4 text-green-700 font-medium">All Resources</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}

function ResourceCard({ resource }) {
  return (
    <div className="rounded-2xl border bg-white p-6 flex flex-col shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">{resource.type}</span>
        <h3 className="font-bold text-lg text-green-800">{resource.title}</h3>
      </div>
      <div className="text-gray-600 mb-4">{resource.description}</div>
      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-auto px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 text-center">Open Resource</a>
    </div>
  );
}
