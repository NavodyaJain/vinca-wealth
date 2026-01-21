import React from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function TemplateCard({ template, isSaved, onSave, onDownload }) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow-sm border flex flex-col w-full max-w-xs min-w-[220px] mx-auto">
      <img
        src={template.bannerImage || 'https://placehold.co/400x200?text=Resource+Image'}
        alt={template.title}
        className="w-full h-32 object-cover rounded-t-lg"
      />
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 mr-2">
            {template.category}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            Best for: {template.bestFor}
          </span>
        </div>
        <h3 className="font-semibold text-base mb-1 line-clamp-2">
          {template.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {template.description}
        </p>
        <div className="flex gap-2 mt-auto">
          <button
            className="flex-1 bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700 transition"
            onClick={() => router.push(`/dashboard/investor-hub/resources/templates/${template.id}`)}
            type="button"
          >
            View Goal Template
          </button>
          <button
            className={clsx(
              "flex-1 border text-xs py-1 rounded transition",
              isSaved
                ? "bg-blue-50 border-blue-600 text-blue-700"
                : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-blue-50"
            )}
            onClick={onSave}
            type="button"
          >
            {isSaved ? "Saved" : "Save Goal Template"}
          </button>
          <button
            className="flex-1 border text-xs py-1 rounded transition bg-gray-50 border-gray-300 text-gray-600 hover:bg-blue-50"
            onClick={onDownload}
            type="button"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
