import React from "react";

const TABS = [
  { key: "all", label: "All Events" },
  { key: "recent", label: "Recent" },
  { key: "past", label: "Past" },
  { key: "interested", label: "Interested" },
  { key: "registered", label: "Registered" },
];

export default function InvestorHubEventsTabs({ activeTab, onTabChange }) {
  return (
    <div className="w-full overflow-x-auto whitespace-nowrap pb-2">
      <div className="flex gap-2 min-w-max">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all min-w-[110px] focus:outline-none
              ${activeTab === tab.key
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-white text-slate-700 border-slate-200 hover:bg-green-50"}
            `}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
