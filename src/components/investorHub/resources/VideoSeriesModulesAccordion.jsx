import React, { useState } from "react";

export default function VideoSeriesModulesAccordion({ modules }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No modules added yet.</div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {modules.map((mod, idx) => (
        <div key={mod.moduleId}>
          <button
            className="w-full flex justify-between items-center py-3 px-2 text-left focus:outline-none"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            aria-expanded={openIndex === idx}
          >
            <div>
              <span className="font-medium text-base">{mod.title}</span>
              <span className="ml-2 text-xs text-gray-500">{mod.videos?.length || 0} videos</span>
            </div>
            <span className="text-xs text-gray-400 ml-2">
              {openIndex === idx ? "▲" : "▼"}
            </span>
          </button>
          {openIndex === idx && (
            <div className="bg-gray-50 px-4 pb-4">
              {mod.videos && mod.videos.length > 0 ? (
                <ul className="space-y-2">
                  {mod.videos.map((vid) => (
                    <li key={vid.videoId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <span className="font-medium text-sm">{vid.title}</span>
                        <span className="ml-2 text-xs text-gray-500">{vid.durationMinutes} min</span>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">Video</span>
                      </div>
                      <button
                        className="text-xs text-blue-600 border border-blue-600 rounded px-2 py-0.5 hover:bg-blue-50"
                        type="button"
                        onClick={() => window.open(vid.previewUrl, "_blank")}
                      >
                        Preview
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm py-2">No videos in this module.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
