import React from "react";
import clsx from "clsx";

const tabs = [
  { key: "all", label: "All" },
  { key: "video-series", label: "Video Series" },
  { key: "blogs", label: "Blogs" },
  { key: "templates", label: "Goal Templates" },
  { key: "saved", label: "Saved" },
];

export default function ResourcesTabs({ activeTab, onTabChange }) {
  return (
    <nav className="w-full overflow-x-auto border-b border-gray-200 mb-6">
      <ul className="flex space-x-2 min-w-max px-1 py-2">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <button
              className={clsx(
                "px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap transition",
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              )}
              onClick={() => onTabChange(tab.key)}
              type="button"
              aria-current={activeTab === tab.key ? "page" : undefined}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
